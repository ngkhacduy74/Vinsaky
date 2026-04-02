import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/infrastructure/repositories/user.repositories';

@Injectable()
export class UserDomainPostService {
  constructor(private readonly userRepository: UserRepository) {}

  async incrementPostCountAtomically(userId: string): Promise<boolean> {
    // Atomic operation: only increment if postCount < 3 and user is not premium
    const result = await (this.userRepository as any).updateOne(
      { 
        _id: userId, 
        postCount: { $lt: 3 },
        $or: [
          { isPremium: { $ne: true } },
          { role: { $ne: 'Admin' } }
        ]
      },
      { $inc: { postCount: 1 } }
    );

    return result.modifiedCount > 0;
  }

  async canCreatePost(userId: string): Promise<boolean> {
    const user = await this.userRepository.findByUserId(userId);
    if (!user) return false;

    if (user.role === 'Admin' || user.isPremium) return true;
    
    return user.postCount < 3;
  }
}
