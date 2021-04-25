import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ArticlesModule,
    MongooseModule.forRoot('mongodb://localhost:27017/blog_db'),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
