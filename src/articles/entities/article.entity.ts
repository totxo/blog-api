import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../auth/entities/user.entity';
import * as mongoose from 'mongoose';

@Schema()
export class Article extends Document {
  @Prop()
  title: string;
  @Prop()
  body: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ArticleSchema = SchemaFactory.createForClass(Article)
