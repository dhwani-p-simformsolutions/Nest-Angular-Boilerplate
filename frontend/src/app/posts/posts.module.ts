import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { PostsListComponent } from './posts-list/posts-list.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PostItemComponent } from './post-item/post-item.component';

@NgModule({
  declarations: [PostsListComponent, PostItemComponent],
  imports: [
    CommonModule,
    PostsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class PostsModule {}
