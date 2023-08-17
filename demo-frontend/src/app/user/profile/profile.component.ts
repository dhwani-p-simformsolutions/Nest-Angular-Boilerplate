import { Component } from '@angular/core';
import { UserInterface } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: UserInterface;
  constructor() {
    this.user = JSON.parse(localStorage.getItem("user")!) as UserInterface;
  }
}
