import { UserInterface } from './user.interface';

export interface PostInterface {
  title: string;
  description: string;
  author: UserInterface;
  createdAt: string;
  updatedAt: string;
  id: number;
}
