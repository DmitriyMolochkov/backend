import { Injectable } from '@nestjs/common';

import { UserViewDto } from '../dtos';
import { UserEntity } from '../entities';

@Injectable()
export class UserMapper {
  public mapToView(ormEntity: UserEntity): UserViewDto {
    return new UserViewDto(ormEntity);
  }
}
