import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  findAllByArticle(
    @Param('id') id: string,
    @Query(ValidationPipe) paginationQuery: PaginationQueryDto,
  ) {
    return this.commentsService.findAllByArticle(id, paginationQuery);
  }

  @UseGuards(AuthGuard())
  @Post(':id')
  @UsePipes(ValidationPipe)
  create(
    @Param('id') id: string,
    @Body() createComment: CreateCommentDto,
    @GetUser() user: User,
  ) {
    return this.commentsService.create(id, user, createComment);
  }
}
