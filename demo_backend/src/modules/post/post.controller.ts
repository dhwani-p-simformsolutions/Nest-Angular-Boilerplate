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
import { Posts, Role, User } from 'src/database/entities';
import { Roles } from 'src/decorators';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ClientAuthGuard, RolesGuard } from 'src/guards';
import { PostCreateDto } from './dto/post-create.dto';
import { PostService } from './post.service';
import { PostUpdateDto } from './dto/post-update.dto';

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
    @Query('page') page = 1, // Default page is 1
    @Query('limit') limit = 10, // Default limit is 10
  ): Promise<Posts[]> {
    const offset = (page - 1) * limit;
    return this.postService.getPostsByUserId(authUser.id, limit, offset);
  }

  @UseGuards(ClientAuthGuard)
  @Delete('/:id')
  async deletePost(@CurrentUser() authUser: User, @Param('id') postId: number): Promise<void> {
    // Check if the post belongs to the authenticated user before deleting
    const postToDelete = await this.postService.getPostById(postId);
    if (!postToDelete || postToDelete.author.id !== authUser.id) {
      throw new NotFoundException('Post not found or unauthorized');
    }

    await this.postService.deletePostById(postId);
  }

  @UseGuards(ClientAuthGuard)
  @Put('/:id')
  async editPost(
    @CurrentUser() authUser: User,
    @Param('id') postId: number,
    @Body() updateData: PostUpdateDto, // Assuming you have a PostUpdateDto
  ): Promise<Posts> {
    const postToUpdate = await this.postService.getPostById(postId);

    if (!postToUpdate || postToUpdate.author.id !== authUser.id) {
      throw new NotFoundException('Post not found or unauthorized');
    }

    return this.postService.editPostById(postId, updateData);
  }

  @Get('/:id')
  async getPostById(@Param('id', ParseIntPipe) postId: number): Promise<Posts> {
    const post = await this.postService.getPostById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
}
