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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Find all articles' })
  @ApiResponse({ status: 200, description: '' })
  findAll(@Query(ValidationPipe) paginationQuery: PaginationQueryDto) {
    return this.articlesService.findAll(paginationQuery);
  }

  @Get('all/:username')
  @ApiOperation({ summary: 'Find all articles by username' })
  @ApiResponse({ status: 200, description: '' })
  findAllByUsername(
    @Param('username') username: string,
    @Query(ValidationPipe) paginationQuery: PaginationQueryDto,
  ) {
    return this.articlesService.findAllByUsername(paginationQuery, username);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one article by id' })
  @ApiResponse({ status: 200, description: '' })
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create article' })
  @ApiResponse({ status: 201, description: '' })
  @UsePipes(ValidationPipe)
  create(@Body() createArticle: CreateArticleDto, @GetUser() user: User) {
    return this.articlesService.create(createArticle, user);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update article by id' })
  @ApiResponse({ status: 200, description: '' })
  update(@GetUser() user: User, @Param('id') id: string, @Body() updateArticle: UpdateArticleDto) {
    return this.articlesService.update(id, user, updateArticle);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete article by id' })
  @ApiResponse({ status: 200, description: '' })
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.articlesService.remove(id, user);
  }
}
