import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Article } from './entities/article.entity';
import { Connection, Model } from 'mongoose';
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { User } from '../auth/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import * as mongoose from 'mongoose';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const { limit, offset } = paginationQueryDto;
    return this.articleModel
      .find()
      .populate('user', 'username')
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async findAllByUsername(
    paginationQueryDto: PaginationQueryDto,
    username: string,
  ) {
    const userDB = await this.userModel.findOne({ username }).exec();
    if (!userDB) {
      throw new NotFoundException('Username not found!');
    }
    const { limit, offset } = paginationQueryDto;
    return this.articleModel
      .find({ user: userDB })
      .populate('user', 'username')
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(`Id #${id} not is valid`, HttpStatus.BAD_REQUEST);
    }

    const article = await this.articleModel
      .findOne({ _id: id })
      .populate('user', 'username')
      .populate({
        path: 'comments',
        select: 'body',
        populate: {
          path: 'user',
          select: 'username',
        },
      })
      .exec();
    if (!article) {
      throw new HttpException(`Article #${id} not found`, HttpStatus.NOT_FOUND);
    }
    return article;
  }

  async create(createArticle: CreateArticleDto, user: User) {
    const article = new this.articleModel(createArticle);
    article.user = user;
    await article.save();
  }

  async update(id: string, user: User, updateArticle: UpdateArticleDto) {
    const existingArticle = await this.findOne(id);

    if (JSON.stringify(existingArticle.user._id) !== JSON.stringify(user._id)) {
      throw new UnauthorizedException();
    }

    await this.articleModel
      .findOneAndUpdate({ _id: id }, { $set: updateArticle }, { new: true })
      .exec();
  }

  async remove(id: string, user: User) {
    const existingArticle = await this.findOne(id);

    if (JSON.stringify(existingArticle.user._id) !== JSON.stringify(user._id)) {
      throw new UnauthorizedException();
    }

    return existingArticle.remove();
  }
}
