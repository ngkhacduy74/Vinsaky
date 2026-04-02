export interface PostDocument {
  _id: string;
  seller: {
    id: string;
    fullname: string;
    email: string;
  };
  title: string;
  description: string;
  category: string;
  condition: string;
  price: number;
  images: string[];
  status: string;
  likes: string[];
  favorites: string[];
  comments: Array<{
    user_id: string;
    content: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  
  // Add toObject method for Mongoose documents
  toObject(): PostDocument;
}
