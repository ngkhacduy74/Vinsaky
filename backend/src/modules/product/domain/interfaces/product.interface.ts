export enum ProductStatus {
  New = 'New',
  SecondHand = 'SecondHand',
}

export interface IOtherFeatures {
  id: string;
  title: string;
  description: string;
}

export interface ICreatorInfo {
  id: string;
  fullname: string;
  phone: string;
  email: string;
}

export interface IProduct {
  id: string;

  image: string[];
  video: string[];

  name: string;
  brand: string;
  category: string;

  price: number;
  description: string;

  size?: string;
  weight?: number;

  status: ProductStatus;

  warranty_period: number;
  business_phone: string;

  voltage?: string;

  features?: IOtherFeatures[];

  quantity: number;

  creator: ICreatorInfo;

  createdAt?: Date;
  updatedAt?: Date;
}