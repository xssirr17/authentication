import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/docii'),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
