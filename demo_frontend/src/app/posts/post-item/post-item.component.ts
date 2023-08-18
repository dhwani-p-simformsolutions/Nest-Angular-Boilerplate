import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostInterface } from 'src/app/interfaces/post.interface';
import { UserInterface } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent {
  @Input() post!: PostInterface;
  @Input() user!: UserInterface;
  @Output() handleDelete = new EventEmitter();
  @Output() handleEdit = new EventEmitter();

  handleDeleteButton(id: number) {
    this.handleDelete.emit(id);
  }

  handleEditButton(id: number) {
    this.handleEdit.emit(id);
  }
}
