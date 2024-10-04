import {
  AccessException,
  DuplicationException,
  NotFoundException,
} from 'common/exceptions/business-exceptions';

import { UserEntity } from '../../entities';

export * from './insufficient-funds.exception';

const UserAccessException = AccessException.bind(undefined, UserEntity.name);
const UserDuplicationException = (DuplicationException<UserEntity>)
  .bind(undefined, UserEntity.name);
const UserNotFoundException = NotFoundException.bind(undefined, UserEntity.name);

export {
  UserAccessException,
  UserDuplicationException,
  UserNotFoundException,
};
