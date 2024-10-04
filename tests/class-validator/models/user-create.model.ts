import {
  IsEmail,
  IsEnum,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { IsNullable, IsTrimmedString } from 'common/class-validator';

import UserSex from './user-sex.enum';
import {
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  PASSWORD_REG_EXP,
  TITLE_REG_EXP,
} from '../constants';

export default class UserCreateModel {
  @IsTrimmedString()
  @Matches(TITLE_REG_EXP)
  @Length(MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH)
  public readonly userName: string;

  @IsString()
  @Matches(PASSWORD_REG_EXP)
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH)
  public readonly password: string;

  @IsEnum(UserSex)
  public readonly sex: UserSex;

  @IsEmail()
  @IsNullable()
  public readonly email: string | null;

  public constructor(
    userName: string,
    password: string,
    sex: UserSex,
    email: string | null,
  ) {
    this.userName = userName;
    this.password = password;
    this.sex = sex;
    this.email = email;
  }
}
