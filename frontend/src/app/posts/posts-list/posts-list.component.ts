import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, EMPTY, finalize, map, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PostInterface } from 'src/app/interfaces/post.interface';
import { showErrorToast } from 'src/app/utils/errorHandler';
import { PostService } from '../services/post.service';
import { AuthService as AdminAuthService } from '../../admin/services/auth.service';
import { UserInterface } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit {
  posts: PostInterface[] = [];
  loading = false;
  postCreateLoading = false;
  postEditMode = false;
  postId!: number;
  signedIn$: BehaviorSubject<boolean | null>;
  adminSignedIn$: BehaviorSubject<boolean | null>;
  user!: UserInterface;

  postForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private toast: ToastrService,
    private adminAuthService: AdminAuthService
  ) {
    this.signedIn$ = this.authService.signedIn$;
    this.adminSignedIn$ = this.adminAuthService.signedIn$;
    const storedUser = localStorage.getItem('user');

    this.user = storedUser ? JSON.parse(storedUser) : null;
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.postService
      .getAllPosts()
      .pipe(
        map((posts: any) => {
          this.posts = posts.data;
        }),
        catchError((err) => {
          return EMPTY;
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(() => {});
  }

  handlePostCreate() {
    if (this.postForm.invalid) {
      Object.values(this.postForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
    } else {
      this.postCreateLoading = true;
      const value = this.postForm.getRawValue();
      if (!this.postEditMode) {
        this.createPost({
          title: value.title!,
          description: value.description!,
        });
      } else {
        this.updatePost(this.postId, {
          title: value.title!,
          description: value.description!,
        });
      }
    }
  }

  updatePost(
    postId: number,
    value: Pick<PostInterface, 'title' | 'description'>
  ) {
    this.postService
      .updatePostById(postId, {
        title: value.title!,
        description: value.description!,
      })
      .pipe(
        tap((value) => {
          this.toast.success('post updated!');
          this.loadPosts();
        }),
        catchError((err) => {
          showErrorToast(this.toast, err);
          return EMPTY;
        }),
        finalize(() => {
          this.postForm.reset();
          this.postCreateLoading = false;
        })
      )
      .subscribe(() => {});
  }

  createPost(value: Pick<PostInterface, 'title' | 'description'>) {
    this.postService
      .createPost({ title: value.title!, description: value.description! })
      .pipe(
        tap((value) => {
          this.loadPosts();
        }),
        catchError((err) => {
          showErrorToast(this.toast, err);
          return EMPTY;
        }),
        finalize(() => {
          this.postForm.reset();
          this.postCreateLoading = false;
        })
      )
      .subscribe(() => {});
  }

  handleDeletePost(id: string) {
    const choice = window.confirm('Are you sure?');
    if (choice) {
      this.postService
        .deletePostById(id)
        .pipe(
          tap((data) => {
            this.toast.success('post deleted successfully!');
            this.loadPosts();
          }),
          catchError((err) => {
            showErrorToast(this.toast, err);
            return EMPTY;
          })
        )
        .subscribe(() => {});
    }
  }

  handlePostEditButtonClick(id: number) {
    this.postEditMode = true;
    const post = this.posts.find((post) => post.id === id);
    if (post) {
      this.postId = post.id;
      this.postForm.patchValue({
        title: post?.title,
        description: post?.description,
      });
    }
  }

  toggleLoading() {
    this.loading = !this.loading;
  }
}
