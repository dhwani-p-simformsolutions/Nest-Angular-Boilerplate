import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, EMPTY, map } from 'rxjs';
import { PostInterface } from 'src/app/interfaces/post.interface';
import { PostService } from '../post.service';

@Injectable({
  providedIn: 'root',
})
export class PostResolverService
  implements Resolve<Omit<PostInterface, 'comments'>>
{
  constructor(private router: Router, private postService: PostService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const { postId } = route.params;
    return this.postService.getPostById(postId).pipe(
      map((data) => data.data.post),
      catchError((err) => {
        this.router.navigateByUrl('/');
        return EMPTY;
      })
    );
  }
}
