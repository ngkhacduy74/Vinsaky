import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class UserDomainService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async createNewUser(data: {
    fullname: string;
    phone: string;
    email: string;
    password: string;
    gender: string;
    address?: string;
    ava_img_url?: string;
  }): Promise<UserEntity> {
    const hashedPassword = await this.hashPassword(data.password);
    
    return UserEntity.create({
      id: uuidv4(),
      fullname: data.fullname,
      phone: data.phone,
      email: data.email,
      password: hashedPassword,
      gender: data.gender,
      address: data.address,
      ava_img_url: data.ava_img_url,
    });
  }

  static async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
