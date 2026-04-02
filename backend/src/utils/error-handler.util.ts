import { ConflictException, InternalServerErrorException } from '@nestjs/common';

export class ErrorHandlerUtil {
  static handleMongoDuplicateError(err: any, entityName: string): never {
    if (err?.code === 11000) {
      const duplicateField =
        (err?.keyPattern && Object.keys(err.keyPattern)[0]) ||
        (err?.keyValue && Object.keys(err.keyValue)[0]) ||
        'unknown';

      throw new ConflictException({
        message: `${entityName} đã tồn tại`,
        errors: { [duplicateField]: 'DUPLICATE_KEY' },
      });
    }

    throw new InternalServerErrorException({
      message: `Thao tác với ${entityName} thất bại`,
      errors: err?.message,
    });
  }

  static handleServiceError(err: any, entityName: string): never {
    throw new InternalServerErrorException({
      message: `${entityName} thất bại`,
      errors: err?.message,
    });
  }
}
