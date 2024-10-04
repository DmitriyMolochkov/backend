import { plainToClass } from 'class-transformer';
import { IsString, Validator } from 'class-validator';

import { CustomDecoratorName, IsLowercase } from 'common/class-validator';

const validator = new Validator();

describe('IsLowerCase decorator', () => {
  class StringContainer {
    @IsString()
    @IsLowercase()
    public name: string;

    public constructor(name: string) {
      this.name = name;
    }
  }

  it('should allow a lowercase string', async () => {
    const stringContainer = new StringContainer('some lowercase string');

    const errors = await validator.validate(stringContainer);
    expect(errors.length).toEqual(0);
  });

  it('should disallow a string with capital letters', async () => {
    const stringContainer = new StringContainer('Some string with Capital Letters');

    const errors = await validator.validate(stringContainer);
    expect(errors[0]?.target).toEqual(stringContainer);
    expect(errors[0]?.value).toEqual('Some string with Capital Letters');
    expect(errors[0]?.property).toEqual('name');
    expect(errors[0]?.constraints).toEqual({
      [CustomDecoratorName.isLowercase]: 'name must be a lowercase string',
    });
  });

  it('should allow a string with capital letters after transform', async () => {
    const stringContainer = plainToClass(
      StringContainer,
      new StringContainer('Some string with Capital Letters'),
    );

    const errors = await validator.validate(stringContainer);
    expect(errors.length).toEqual(0);
  });
});
