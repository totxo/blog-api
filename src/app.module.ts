import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import * as config from 'config';
const dbConfig = config.get('db');
const mongoUri = process.env.MONGO_URI || dbConfig.uri

@Module({
  imports: [
    ArticlesModule,
    MongooseModule.forRoot('mongodb+srv://admin:zS3iMVAZLhbp3en1@cluster0.ogfto.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'),
    AuthModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
