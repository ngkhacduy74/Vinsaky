export class CreatePostInput {
  title: string;
  description: string;
  category: string;
  condition: string;
  images?: string[];
  videos?: string[];
  address?: string;
  content?: string;
}
