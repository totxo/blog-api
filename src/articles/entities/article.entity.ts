import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../auth/entities/user.entity';
import * as mongoose from 'mongoose';
import { Comment } from '../../comments/entities/comment.entity';

@Schema()
export class Article extends Document {
  @Prop()
  title: string;
  @Prop()
  body: string;
  @Prop([String])
  tags: string[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
