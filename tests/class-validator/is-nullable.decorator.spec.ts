import { IS_EMAIL, Validator } from 'class-validator';

import { UserCreateModel, UserSex } from './models';

const validator = new Validator();

describe('IsNullable decorator', () => {
  it('should allow a defined field if it is valid for other rules', async () => {
    const userCreateModel = new UserCreateModel(
      'Miki',
      'gravipushka!2D',
      UserSex.female,
      'check@mail.ru',
    );

    const errors = await validator.validate(userCreateModel);
    expect(errors.length).toEqual(0);
  });

  it('should allow a defined field if it is null', async () => {
    const userCreateModel = new UserCreateModel(
      'Miki',
      'gravipushka!2D',
      UserSex.female,
      null,
    );

    const errors = await validator.validate(userCreateModel);
    expect(errors.length).toEqual(0);
  });

  it('should disallow a defined field if it is not valid for other rules', async () => {
    const userCreateModel = new UserCreateModel(
      'Miki',
      'gravipushka!2D',
      UserSex.female,
      'not_valid_email@',
    );

    const errors = await validator.validate(userCreateModel);
    expect(errors[0]?.target).toEqual(userCreateModel);
    expect(errors[0]?.value).toEqual('not_valid_email@');
    expect(errors[0]?.property).toEqual('email');
    expect(errors[0]?.constraints).toEqual({ [IS_EMAIL]: 'email must be an email' });
  });

  it('should disallow an undefined field if it is not valid for other rules', async () => {
    const userCreateModel = new UserCreateModel(
      'Miki',
      'gravipushka!2D',
      UserSex.female,
      undefined as unknown as string,
    );

    const errors = await validator.validate(userCreateModel);
    expect(errors[0]?.target).toEqual(userCreateModel);
    expect(errors[0]?.value).toBeUndefined();
    expect(errors[0]?.property).toEqual('email');
    expect(errors[0]?.constraints).toEqual({ [IS_EMAIL]: 'email must be an email' });
  });
});
