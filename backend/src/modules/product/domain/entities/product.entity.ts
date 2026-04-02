import { IProduct, ProductStatus } from '../interfaces/product.interface';

// Pure Domain Entity - Không phụ thuộc database
export class ProductEntity implements IProduct {
  constructor(
    public readonly id: string,
    public readonly image: string[],
    public readonly video: string[],
    public readonly name: string,
    public readonly brand: string,
    public readonly category: string,
    public readonly price: number,
    public readonly description: string,
    public readonly warranty_period: number,
    public readonly business_phone: string,
    public readonly quantity: number,
    public readonly status: ProductStatus,
    public readonly creator: {
      id: string;
      fullname: string;
      phone: string;
      email: string;
    },
    public readonly size?: string,
    public readonly weight?: number,
    public readonly voltage?: string,
    public readonly features?: any[],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  // Factory methods
  static create(data: {
    id?: string;
    image: string[];
    video: string[];
    name: string;
    brand: string;
    category: string;
    price: number;
    description: string;
    size?: string;
    weight?: number;
    status?: ProductStatus;
    warranty_period?: number;
    business_phone: string;
    voltage?: string;
    features?: any[];
    quantity?: number;
    creator: {
      id: string;
      fullname: string;
      phone: string;
      email: string;
    };
  }): ProductEntity {
    const creator = data.creator || {
      id: '',
      fullname: '',
      phone: '',
      email: '',
    };
    
    return new ProductEntity(
      data.id || '',
      data.image,
      data.video,
      data.name,
      data.brand,
      data.category,
      data.price,
      data.description,
      data.warranty_period || 12,
      data.business_phone,
      data.quantity || 0,
      data.status || ProductStatus.New,
      creator,
      data.size,
      data.weight,
      data.voltage,
      data.features,
      new Date(),
      new Date(),
    );
  }

  // Business methods
  update(data: Partial<ProductEntity>): ProductEntity {
    const creator = data.creator ?? this.creator;
    
    return new ProductEntity(
      data.id ?? this.id,
      data.image ?? this.image,
      data.video ?? this.video,
      data.name ?? this.name,
      data.brand ?? this.brand,
      data.category ?? this.category,
      data.price ?? this.price,
      data.description ?? this.description,
      data.warranty_period ?? this.warranty_period,
      data.business_phone ?? this.business_phone,
      data.quantity ?? this.quantity,
      data.status ?? this.status,
      creator,
      data.size ?? this.size,
      data.weight ?? this.weight,
      data.voltage ?? this.voltage,
      data.features ?? this.features,
      this.createdAt,
      new Date(),
    );
  }

  // Business validation
  isActive(): boolean {
    return this.status === ProductStatus.New;
  }

  isInStock(): boolean {
    return this.quantity > 0;
  }

  canBePurchased(requestedQuantity: number = 1): boolean {
    return this.isActive() && this.isInStock() && this.quantity >= requestedQuantity;
  }

  decreaseStock(requestedQuantity: number): ProductEntity {
    if (requestedQuantity > this.quantity) {
      throw new Error('Insufficient stock');
    }
    return this.update({ quantity: this.quantity - requestedQuantity });
  }

  increaseStock(additionalQuantity: number): ProductEntity {
    return this.update({ quantity: this.quantity + additionalQuantity });
  }

  // Price validation
  isValidPrice(): boolean {
    return this.price > 0;
  }

  // Search relevance
  matchesSearchTerm(searchTerm: string): boolean {
    const term = searchTerm.toLowerCase();
    return (
      this.name.toLowerCase().includes(term) ||
      this.brand.toLowerCase().includes(term) ||
      this.description.toLowerCase().includes(term)
    );
  }
}
