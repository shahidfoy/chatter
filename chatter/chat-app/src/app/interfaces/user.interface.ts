export interface User {
  username: string;
  email: string;
  password: string;
  posts: UserPost[];
}

export interface UserPost {
  _id: string;
  postId: string;
  post: string;
  createdAt: Date;
}
