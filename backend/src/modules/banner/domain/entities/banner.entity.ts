export class BannerEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: string,
    public readonly image: string,
    public readonly badge: string,
    public readonly category: string = 'Sản phẩm',
    public readonly discount: string = 'Giảm 15%',
    public readonly buttonText: string = 'Mua Ngay',
    public readonly isActive: boolean = true,
    public readonly order: number = 0,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(data: {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    badge: string;
    category?: string;
    discount?: string;
    buttonText?: string;
    isActive?: boolean;
    order?: number;
  }): BannerEntity {
    return new BannerEntity(
      data.id,
      data.name,
      data.description,
      data.price,
      data.image,
      data.badge,
      data.category || 'Sản phẩm',
      data.discount || 'Giảm 15%',
      data.buttonText || 'Mua Ngay',
      data.isActive !== undefined ? data.isActive : true,
      data.order || 0,
      new Date(),
      new Date(),
    );
  }

  update(data: Partial<BannerEntity>): BannerEntity {
    return new BannerEntity(
      data.id ?? this.id,
      data.name ?? this.name,
      data.description ?? this.description,
      data.price ?? this.price,
      data.image ?? this.image,
      data.badge ?? this.badge,
      data.category ?? this.category,
      data.discount ?? this.discount,
      data.buttonText ?? this.buttonText,
      data.isActive ?? this.isActive,
      data.order ?? this.order,
      this.createdAt,
      new Date(),
    );
  }
}

export class BannerProductIdsEntity {
  constructor(
    public readonly productIds: string[],
    public readonly isActive: boolean = true,
    public readonly maxProducts: number = 10,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(data: {
    productIds: string[];
    isActive?: boolean;
    maxProducts?: number;
  }): BannerProductIdsEntity {
    return new BannerProductIdsEntity(
      data.productIds || [],
      data.isActive !== undefined ? data.isActive : true,
      data.maxProducts || 10,
      new Date(),
      new Date(),
    );
  }
}
