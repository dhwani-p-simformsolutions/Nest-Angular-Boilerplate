import { Injectable, NotFoundException } from '@nestjs/common';
import { Posts, User } from 'src/database/entities';
import { PostRepository } from '../../shared/repository';
import { PostCreateDto } from './dto/post-create.dto';
import { PostUpdateDto } from './dto/post-update.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepo: PostRepository) {}

  /**
   * Create a new post.
   * @param data - The data for creating a new post.
   * @param authUser - The authenticated user creating the post.
   * @returns The newly created post.
   */
  public async createPost(data: PostCreateDto, authUser: User): Promise<Posts> {
    const { title, description } = data;
    const newPost = this.postRepo.create({
      title: title,
      description: description,
      author: authUser,
    });

    return await this.postRepo.save(newPost);
  }

  /**
   * Get posts by user ID.
   * @param userId - The ID of the user whose posts are to be fetched.
   * @returns An array of posts by the specified user.
   */
  async getPostsByUserId(userId: number, limit: number, offset: number): Promise<Posts[]> {
    try {
      const posts = await this.postRepo.find({
        take: limit,
        skip: offset,
        relations: ['author'],
        order: { updatedAt: -1 },
      });

      return posts;
    } catch (error) {
      throw new Error('Error fetching posts by user ID');
    }
  }

  /**
   * Get a post by its ID.
   * @param postId - The ID of the post to retrieve.
   * @returns The retrieved post or undefined if not found.
   */
  async getPostById(postId: number): Promise<Posts | undefined> {
    try {
      return await this.postRepo.findOne(postId, { relations: ['author'] });
    } catch (error) {
      throw new Error('Error fetching post by ID');
    }
  }

  /**
   * Delete a post by its ID.
   * @param postId - The ID of the post to delete.
   */
  async deletePostById(postId: number): Promise<void> {
    try {
      const deleteResult = await this.postRepo.delete(postId);
      if (deleteResult.affected === 0) {
        throw new NotFoundException('Post not found');
      }
    } catch (error) {
      throw new Error('Error deleting post by ID');
    }
  }

  /**
   * Edit a post by its ID.
   * @param postId - The ID of the post to edit.
   * @param updateData - The data to update the post with.
   * @returns The updated post.
   */
  async editPostById(postId: number, updateData: PostUpdateDto): Promise<Posts> {
    const postToUpdate = await this.postRepo.findOne(postId);

    if (!postToUpdate) {
      throw new NotFoundException('Post not found');
    }

    // Update fields from updateData
    postToUpdate.title = updateData.title;
    postToUpdate.description = updateData.description;

    // Save the updated post
    return await this.postRepo.save(postToUpdate);
  }
}
