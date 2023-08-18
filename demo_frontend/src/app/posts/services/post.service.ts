import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostInterface } from 'src/app/interfaces/post.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  createPost(post: Pick<PostInterface, 'title' | 'description'>) {
    return this.http.post<
      ResponseInterface<{ post: Omit<PostInterface, 'comments' | 'postedBy'> }>
    >('/post', post);
  }

  getAllPosts() {
    return this.http.get<ResponseInterface<{ posts: PostInterface[] }>>(
      '/post'
    );
  }

  getPostById(id: string) {
    return this.http.get<
      ResponseInterface<{ post: Omit<PostInterface, 'comments'> }>
    >(`/post/${id}`);
  }

  deletePostById(id: string) {
    return this.http.delete(`/post/${id}`);
  }

  updatePostById(
    id: number,
    body: Pick<PostInterface, 'title' | 'description'>
  ) {
    return this.http.put(`/post/${id}`, body);
  }
}
