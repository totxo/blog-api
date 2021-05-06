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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Find all comments by articleId' })
  @ApiResponse({ status: 200, description: '' })
  findAllByArticle(
    @Param('id') id: string,
    @Query(ValidationPipe) paginationQuery: PaginationQueryDto,
  ) {
    return this.commentsService.findAllByArticle(id, paginationQuery);
  }

  @UseGuards(AuthGuard())
  @Post(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create comment by articleId' })
  @ApiResponse({ status: 201, description: '' })
  @UsePipes(ValidationPipe)
  create(
    @Param('id') id: string,
    @Body() createComment: CreateCommentDto,
    @GetUser() user: User,
  ) {
    return this.commentsService.create(id, user, createComment);
  }
}
