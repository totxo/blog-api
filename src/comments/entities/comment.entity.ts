import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../auth/entities/user.entity';
import { Article } from '../../articles/entities/article.entity';

@Schema()
export class Comment extends Document {
  @Prop()
  body: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Article' })
  article: Article;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
