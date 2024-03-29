import {
  Injectable,
  NestMiddleware,
  Inject,
  Headers,
  Body,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { verify } from 'jsonwebtoken';
import errors from 'src/constants/errors';
import { getTokenPayload } from 'src/helpers/getTokenPayload';

@Injectable()
export class CheckTempTokenMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async use(req: any, res: any, next: NextFunction) {
    const token = req.headers?.token;
    const body = req?.body;

    const mobileNumber = body.mobileNumber;
    const isVerify = await this.#verifyTempToken(mobileNumber, token);
    if (isVerify) {
      next();
    } else throw errors.unauthorized;
  }

  async #verifyTempToken(mobileNumber: string, inputToken: string) {
    const tokenKey = `tempToken_${mobileNumber}`;
    const token = await this.cacheManager.get(tokenKey);

    if (!token) {
      return false;
    } else if (token == inputToken) {
      const decodedToken = await getTokenPayload(inputToken);
      if (!decodedToken) {
        return false;
      }
      return true;
    }
    return false;
  }
}
