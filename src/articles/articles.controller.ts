import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { ArticlesService } from './articles.service';
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto';
import { CreateArticleDto } from "./dtos/create-article.dto";
import { UpdateArticleDto } from "./dtos/update-article.dto";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { User } from "../auth/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";

@Controller('articles')
export class ArticlesController {

  constructor(private readonly articlesService: ArticlesService) {
  }

  @Get()
  findAll(
    @Query(ValidationPipe) paginationQuery: PaginationQueryDto
  ) {
    return this.articlesService.findAll(paginationQuery);
  }

  @Get(':username')
  findAllByUsername(
    @Param('username') username: string,
    @Query(ValidationPipe) paginationQuery: PaginationQueryDto
  ) {
    return this.articlesService.findAllByUsername(paginationQuery, username);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Post()
  @UsePipes(ValidationPipe)
  create(
    @Body() createArticle: CreateArticleDto,
    @GetUser() user: User) {
    console.log(user);
    return this.articlesService.create(createArticle, user);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArticle: UpdateArticleDto
  ) {
    this.articlesService.update(id, updateArticle);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.articlesService.remove(id);
  }

}
