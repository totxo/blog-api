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
  ValidationPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto';
import { CreateArticleDto } from './dtos/create-article.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll(@Query(ValidationPipe) paginationQuery: PaginationQueryDto) {
    return this.articlesService.findAll(paginationQuery);
  }

  @Get('all/:username')
  findAllByUsername(
    @Param('username') username: string,
    @Query(ValidationPipe) paginationQuery: PaginationQueryDto,
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
  create(@Body() createArticle: CreateArticleDto, @GetUser() user: User) {
    return this.articlesService.create(createArticle, user);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  update(@GetUser() user: User, @Param('id') id: string, @Body() updateArticle: UpdateArticleDto) {
    return this.articlesService.update(id, user, updateArticle);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.articlesService.remove(id, user);
  }
}
