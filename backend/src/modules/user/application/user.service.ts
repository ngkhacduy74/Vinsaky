import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { UserRepoAbstract } from 'src/modules/user/domain/repositories/user.abstract.repo';
import { UserAbstract } from 'src/modules/user/application/user.abstract';

import { UrlService } from 'src/services/url.service';
import { GetAllUserQueryDto } from 'src/modules/user/presentation/dto/req/get-all-user-query.dto';
import { PaginationResponse } from 'src/common/dto/pagination.dto';
import {
  DeleteUserDto,
  PublicUserDto,
  UpdateUserResponseDto,
} from 'src/modules/user/presentation/dto/res/user.dto';
import { UpdateUserDto } from 'src/modules/user/presentation/dto/req/update-user.dto';
import { UserQueryService } from 'src/modules/user/domain/services/user-query.service';
import { PaginationUtil } from 'src/utils/pagination.util';
import { ResponseBuilderUtil } from 'src/utils/response-builder.util';
import { UserResponseMapper } from '../infrastructure/mappers/user-response.mapper';

@Injectable()
export class UserService extends UserAbstract {
  constructor(
    private readonly userRepository: UserRepoAbstract,
    private readonly urlService: UrlService,
  ) {
    super();
  }

  async getAllUser(
    query: GetAllUserQueryDto,
  ): Promise<BaseResponseDto<PaginationResponse<PublicUserDto>>> {
    const searchQuery = UserQueryService.buildSearchQuery({
      searchTerm: query.searchTerm,
      statusFilter: query.statusFilter,
      roleFilter: query.roleFilter,
    });

    const sortQuery = UserQueryService.buildSortQuery();
    const { skip, limit } = PaginationUtil.calculateSkipLimit(
      query.skip,
      query.limit,
    );

    const [filteredUsers, total] = await Promise.all([
      this.userRepository.findWithFilters(searchQuery, skip, limit, sortQuery),
      this.userRepository.count(searchQuery),
    ]);

    const paginationData = PaginationUtil.createPaginationResponse(
      filteredUsers.map((user) => UserResponseMapper.toPublicDto(user)),
      total,
      skip,
      limit,
    );

    return ResponseBuilderUtil.successWithPagination(
      'Lấy danh sách người dùng thành công',
      paginationData,
    );
  }

  async getUserById(id: string): Promise<BaseResponseDto<PublicUserDto>> {
    const user = await this.userRepository.findByUserId(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return ResponseBuilderUtil.success(
      'Lấy thông tin người dùng thành công',
      UserResponseMapper.toPublicDto(user),
    );
  }

  async updateUser(
    id: string,
    data: UpdateUserDto,
  ): Promise<BaseResponseDto<UpdateUserResponseDto>> {
    const existingUser = await this.userRepository.findByUserId(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = existingUser.update({
      fullname: data.fullname,
      phone: data.phone,
      email: data.email,
      gender: data.gender,
      role: data.role,
      address: data.address,
      ava_img_url: data.ava_img_url,
      is_active: data.is_active,
      isPremium: data.isPremium,
      lastActivityAt: new Date(),
    });

    const savedUser = await this.userRepository.updateByUserId(id, updatedUser);
    if (!savedUser) {
      throw new InternalServerErrorException('Failed to update user');
    }

    return ResponseBuilderUtil.success(
      'Cập nhật thông tin người dùng thành công',
      UserResponseMapper.toUpdateResponseDto(savedUser),
    );
  }

  async deleteUser(id: string): Promise<BaseResponseDto<DeleteUserDto>> {
    const user = await this.userRepository.findByUserId(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const deletedUser = user.softDelete();
    const savedUser = await this.userRepository.updateByUserId(id, deletedUser);

    if (!savedUser) {
      throw new InternalServerErrorException('Failed to delete user');
    }

    return ResponseBuilderUtil.success('Xóa người dùng thành công', {
      deleted: true,
      user: UserResponseMapper.toPublicDto(savedUser),
    });
  }

  async getUserByEmail(email: string): Promise<BaseResponseDto<PublicUserDto>> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return ResponseBuilderUtil.success(
      'Lấy thông tin người dùng thành công',
      UserResponseMapper.toPublicDto(user),
    );
  }

  async upgradeInit(userId: string): Promise<BaseResponseDto<any>> {
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.canUpgradeToPremium()) {
      throw new ConflictException('User cannot upgrade to premium');
    }

    const upgradedUser = user.upgradeToPremium();
    const savedUser = await this.userRepository.updateByUserId(
      userId,
      upgradedUser,
    );

    if (!savedUser) {
      throw new InternalServerErrorException('Failed to update user');
    }

    return ResponseBuilderUtil.success(
      'Khởi tạo nâng cấp tài khoản thành công',
      {
        user: UserResponseMapper.toPublicDto(savedUser),
        upgradeUrl: this.urlService.generateUpgradeUrl(userId),
      },
    );
  }
}
