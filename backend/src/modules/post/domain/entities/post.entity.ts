import { IPost, IComment, PostStatus, UserPosition, PostCondition } from 'src/modules/post/domain/interfaces/post.interface';

export class PostEntity implements IPost {
  constructor(
    public readonly id: string,
    public readonly category: string,
    public readonly image: string[],
    public readonly video: string[],
    public readonly status: PostStatus,
    public readonly title: string,
    public readonly user_position: UserPosition,
    public readonly address: string,
    public readonly description: string,
    public readonly seller: any,
    public readonly condition: PostCondition,
    public readonly comments: IComment[],
    public readonly likes: string[],
    public readonly favorites: string[],
    public readonly content?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  // Factory method
  static create(data: {
    id: string;
    category: string;
    title: string;
    description: string;
    seller: any;
    condition: PostCondition;
    images?: string[];
    videos?: string[];
    address?: string;
    content?: string;
  }): PostEntity {
    return new PostEntity(
      data.id,
      data.category,
      data.images || [],
      data.videos || [],
      PostStatus.New, // Default status
      data.title,
      UserPosition.Newbie, // Default user position
      data.address || '',
      data.description,
      data.seller,
      data.condition,
      [], // Empty comments
      [], // Empty likes
      [], // Empty favorites
      data.content,
      new Date(), // createdAt
      new Date(), // updatedAt
    );
  }

  // Business methods
  addComment(comment: IComment): PostEntity {
    return new PostEntity(
      this.id,
      this.category,
      this.image,
      this.video,
      this.status,
      this.title,
      this.user_position,
      this.address,
      this.description,
      this.seller,
      this.condition,
      [...this.comments, comment],
      this.likes,
      this.favorites,
      this.content,
      this.createdAt,
      new Date(), // Update updatedAt
    );
  }

  toggleLike(userId: string): PostEntity {
    const isLiked = this.likes.includes(userId);
    const newLikes = isLiked 
      ? this.likes.filter(id => id !== userId)
      : [...this.likes, userId];

    return new PostEntity(
      this.id,
      this.category,
      this.image,
      this.video,
      this.status,
      this.title,
      this.user_position,
      this.address,
      this.description,
      this.seller,
      this.condition,
      this.comments,
      newLikes,
      this.favorites,
      this.content,
      this.createdAt,
      new Date(), // Update updatedAt
    );
  }

  toggleFavorite(userId: string): PostEntity {
    const isFavorited = this.favorites.includes(userId);
    const newFavorites = isFavorited 
      ? this.favorites.filter(id => id !== userId)
      : [...this.favorites, userId];

    return new PostEntity(
      this.id,
      this.category,
      this.image,
      this.video,
      this.status,
      this.title,
      this.user_position,
      this.address,
      this.description,
      this.seller,
      this.condition,
      this.comments,
      this.likes,
      newFavorites,
      this.content,
      this.createdAt,
      new Date(), // Update updatedAt
    );
  }

  updateCondition(newCondition: PostCondition): PostEntity {
    return new PostEntity(
      this.id,
      this.category,
      this.image,
      this.video,
      this.status,
      this.title,
      this.user_position,
      this.address,
      this.description,
      this.seller,
      newCondition,
      this.comments,
      this.likes,
      this.favorites,
      this.content,
      this.createdAt,
      new Date(), // Update updatedAt
    );
  }

  // Business validation
  isActive(): boolean {
    return this.condition === PostCondition.Active;
  }

  canBeModifiedByUser(userId: string): boolean {
    return this.seller?.id === userId;
  }

  isLikedByUser(userId: string): boolean {
    return this.likes.includes(userId);
  }

  isFavoritedByUser(userId: string): boolean {
    return this.favorites.includes(userId);
  }
}
