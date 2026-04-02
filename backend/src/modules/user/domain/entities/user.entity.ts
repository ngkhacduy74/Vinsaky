import { IUser } from '../interfaces/user.interface';

// Pure Domain Entity - Không phụ thuộc database
export class UserEntity implements IUser {
  constructor(
    public readonly id: string,
    public readonly fullname: string,
    public readonly phone: string,
    public readonly email: string,
    public readonly password: string,
    public readonly gender: string,
    public readonly role: string,
    public readonly address?: string,
    public readonly ava_img_url?: string,
    public readonly is_active?: boolean,
    public readonly license?: boolean,
    public readonly isPremium: boolean = false,
    public readonly postCount: number = 0,
    public readonly lastLoginAt: Date = new Date(),
    public readonly lastActivityAt: Date = new Date(),
    public readonly is_deleted: boolean = false,
    public readonly deleted_at?: Date | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  // Factory methods
  static create(data: {
    id: string;
    fullname: string;
    phone: string;
    email: string;
    password: string;
    gender: string;
    address?: string;
    ava_img_url?: string;
  }): UserEntity {
    return new UserEntity(
      data.id,
      data.fullname,
      data.phone,
      data.email,
      data.password,
      data.gender,
      'User', // Default role
      data.address,
      data.ava_img_url,
      true, // is_active
      true, // license
      false, // isPremium
      0, // postCount
      new Date(), // lastLoginAt
      new Date(), // lastActivityAt
      false, // is_deleted
      null, // deleted_at
      new Date(), // createdAt
      new Date(), // updatedAt
    );
  }

  // Business methods
  update(data: Partial<UserEntity>): UserEntity {
    // Business validation
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    return new UserEntity(
      data.id ?? this.id,
      data.fullname ?? this.fullname,
      data.phone ?? this.phone,
      data.email ?? this.email,
      data.password ?? this.password,
      data.gender ?? this.gender,
      data.role ?? this.role,
      data.address ?? this.address,
      data.ava_img_url ?? this.ava_img_url,
      data.is_active ?? this.is_active,
      data.license ?? this.license,
      data.isPremium ?? this.isPremium,
      data.postCount ?? this.postCount,
      data.lastLoginAt ?? this.lastLoginAt,
      data.lastActivityAt ?? this.lastActivityAt,
      data.is_deleted ?? this.is_deleted,
      data.deleted_at ?? this.deleted_at,
      data.createdAt ?? this.createdAt,
      data.updatedAt ?? data.updatedAt ?? new Date(),
    );
  }

  softDelete(): UserEntity {
    return new UserEntity(
      this.id,
      this.fullname,
      this.phone,
      this.email,
      this.password,
      this.gender,
      this.role,
      this.address,
      this.ava_img_url,
      this.is_active,
      this.license,
      this.isPremium,
      this.postCount,
      this.lastLoginAt,
      this.lastActivityAt,
      true, // is_deleted = true
      new Date(), // deleted_at
      this.createdAt,
      new Date(), // updatedAt
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  upgradeToPremium(): UserEntity {
    return new UserEntity(
      this.id,
      this.fullname,
      this.phone,
      this.email,
      this.password,
      this.gender,
      this.role,
      this.address,
      this.ava_img_url,
      this.is_active,
      this.license,
      true, // isPremium = true
      this.postCount,
      this.lastLoginAt,
      new Date(), // Update activity
      this.is_deleted,
      this.deleted_at,
      this.createdAt,
      this.updatedAt,
    );
  }

  updateLastActivity(): UserEntity {
    return new UserEntity(
      this.id,
      this.fullname,
      this.phone,
      this.email,
      this.password,
      this.gender,
      this.role,
      this.address,
      this.ava_img_url,
      this.is_active,
      this.license,
      this.isPremium,
      this.postCount,
      this.lastLoginAt,
      new Date(), // Update activity
      this.is_deleted,
      this.deleted_at,
      this.createdAt,
      this.updatedAt,
    );
  }

  incrementPostCount(): UserEntity {
    return new UserEntity(
      this.id,
      this.fullname,
      this.phone,
      this.email,
      this.password,
      this.gender,
      this.role,
      this.address,
      this.ava_img_url,
      this.is_active,
      this.license,
      this.isPremium,
      this.postCount + 1,
      this.lastLoginAt,
      this.lastActivityAt,
      this.is_deleted,
      this.deleted_at,
      this.createdAt,
      this.updatedAt,
    );
  }

  // Business validation
  canUpgradeToPremium(): boolean {
    return !this.isPremium && this.is_active === true;
  }

  isDeleted(): boolean {
    return this.is_deleted === true;
  }

  isActive(): boolean {
    return this.is_active === true && !this.is_deleted;
  }

  canLogin(): boolean {
    return this.isActive() && !this.isDeleted();
  }
}
