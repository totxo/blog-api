import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Article } from '../articles/entities/article.entity';
import { Connection, Model } from 'mongoose';
import { Comment } from './entities/comment.entity';
import { User } from '../auth/entities/user.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findAllByArticle(id: string, paginationQueryDto: PaginationQueryDto) {
    const article = await this.articleModel.findOne({ _id: id }).exec();
    if (!article) {
      throw new HttpException(`Article #${id} not found`, HttpStatus.NOT_FOUND);
    }
    const { limit, offset } = paginationQueryDto;
    return this.commentModel.find({ article }).skip(offset).limit(limit).exec();
  }

  async create(id: string, user: User, createComment: CreateCommentDto) {
    const article = await this.articleModel.findOne({ _id: id }).exec();
    if (!article) {
      throw new HttpException(`Article #${id} not found`, HttpStatus.NOT_FOUND);
    }
    const comment = new this.commentModel(createComment);
    comment.user = user;
    comment.article = article;
    await comment.save();
    article.comments.push(comment);
    await this.articleModel
      .findOneAndUpdate({ _id: id }, { $set: { comments: article.comments } }, { new: true })
      .exec();
  }
}
