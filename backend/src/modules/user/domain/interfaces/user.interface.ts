export interface IUser {
  id: string;
  fullname: string;
  phone: string;
  email: string;
  address?: string;
  password: string;
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

  createdAt?: Date;
  updatedAt?: Date;
}