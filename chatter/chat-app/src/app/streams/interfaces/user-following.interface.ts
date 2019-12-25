export interface UserFollowing {
  _id?: string;
  userFollower: Following;
}

export interface Following {
  _id: string;
}
