export enum PostStatus {
  New = 'New',
  SecondHand = 'SecondHand',
}

export enum UserPosition {
  Newbie = 'Newbie',
  Professional = 'Professional',
}

export enum PostCondition {
  Pending = 'Pending',
  Active = 'Active',
  Inactive = 'Inactive',
  Reject = 'Reject',
}

export interface IComment {
  user_id: string;
  content: string;
  createdAt: Date;
}

export interface IUserInPost {
  id: string;
  fullname: string;
  phone: string;
  email: string;
  address?: string;
  gender: string;
  role: string;
  ava_img_url?: string;
  is_active?: boolean;
  license?: boolean;
  isPremium: boolean;
  postCount: number;
  lastLoginAt: Date;
  lastActivityAt: Date;
  is_deleted: boolean;
  deleted_at?: Date | null;
}

export interface IPost {
  id: string;

  category: string;

  image: string[];
  video: string[];

  status: PostStatus;

  title: string;

  user_position: UserPosition;

  address: string;

  description: string;
  content?: string;

  seller: IUserInPost;

  condition: PostCondition;

  comments: IComment[];

  likes: string[];      // userId
  favorites: string[];  // userId

  createdAt?: Date;
  updatedAt?: Date;
}