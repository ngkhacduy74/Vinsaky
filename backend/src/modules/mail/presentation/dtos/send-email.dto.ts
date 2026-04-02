import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MailType } from '../../domain/entities/mail.entity';

export class SendEmailDto {
  @IsEmail()
  receiver: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(MailType)
  type: MailType;
}
