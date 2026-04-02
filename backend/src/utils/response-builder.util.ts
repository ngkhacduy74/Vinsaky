import { BaseResponseDto } from 'src/common/dto/base-response.dto';

export class ResponseBuilderUtil {
  static success<T>(message: string, data: T): BaseResponseDto<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static successWithPagination<T>(
    message: string,
    paginationData: T,
  ): BaseResponseDto<T> {
    return {
      success: true,
      message,
      data: paginationData,
    };
  }

  static error(message: string): BaseResponseDto<null> {
    return {
      success: false,
      message,
      data: null,
    };
  }
}
