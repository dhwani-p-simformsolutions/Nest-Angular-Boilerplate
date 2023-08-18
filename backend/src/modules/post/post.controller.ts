import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  UseGuards,
  UseInterceptors,
  Post,
  Get,
  Delete,
  Param,
  NotFoundException,
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Posts, User } from 'src/database/entities';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ClientAuthGuard } from 'src/guards';
import { PostCreateDto } from './dto/post-create.dto';
import { PostService } from './post.service';
import { PostUpdateDto } from './dto/post-update.dto';
import { statusMessages } from 'src/common/constant';
import { GetPostsDto } from './dto';

@ApiBearerAuth()
@Controller('post')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  public constructor(private readonly postService: PostService) {}

  @UseGuards(ClientAuthGuard)
  @Post('/')
  public async addPracticeUser(@Body() data: PostCreateDto, @CurrentUser() authUser: User): Promise<Posts> {
    return this.postService.createPost(data, authUser);
  }

  @UseGuards(ClientAuthGuard)
  @Get('/')
  async getPosts(
    @CurrentUser() authUser: User,
    @Query() query: GetPostsDto, // Use the DTO here
  ): Promise<Posts[]> {
    const { page, limit } = query;
    const offset = (page - 1) * limit;
    return this.postService.getPostsByUserId(authUser.id, limit, offset);
  }

  @UseGuards(ClientAuthGuard)
  @Delete('/:id')
  async deletePost(@CurrentUser() authUser: User, @Param('id') postId: number): Promise<void> {
    // Check if the post belongs to the authenticated user before deleting
    const postToDelete = await this.postService.getPostById(postId);
    if (!postToDelete || postToDelete.author.id !== authUser.id) {
      throw new NotFoundException(statusMessages[404]);
    }

    await this.postService.deletePostById(postId);
  }

  @UseGuards(ClientAuthGuard)
  @Put('/:id')
  async editPost(
    @CurrentUser() authUser: User,
    @Param('id') postId: number,
    @Body() updateData: PostUpdateDto,
  ): Promise<Posts> {
    const postToUpdate = await this.postService.getPostById(postId);

    if (!postToUpdate || postToUpdate.author.id !== authUser.id) {
      throw new NotFoundException(statusMessages[404]);
    }

    return this.postService.editPostById(postId, updateData);
  }

  @Get('/:id')
  async getPostById(@Param('id', ParseIntPipe) postId: number): Promise<Posts> {
    const post = await this.postService.getPostById(postId);
    if (!post) {
      throw new NotFoundException(statusMessages[404]);
    }
    return post;
  }
}
