import { Module } from '@nestjs/common';
import { UploadsController } from './presentation/upload.controller';
import { UploadsService } from './application/upload.service';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}

