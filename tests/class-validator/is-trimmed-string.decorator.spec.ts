import { plainToClass } from 'class-transformer';
import { Validator } from 'class-validator';

import { CustomDecoratorName, IsTrimmedString } from 'common/class-validator';

const validator = new Validator();

describe('IsTrimmedString decorator', () => {
  class StringContainer {
    @IsTrimmedString()
    public name: string;

    public constructor(name: string) {
      this.name = name;
    }
  }

  it('should allow a trimmed string', async () => {
    const stringContainer = new StringContainer('Some trimmed string');

    const errors = await validator.validate(stringContainer);
    expect(errors.length).toEqual(0);
  });

  it('should disallow a string with spaces at the ends', async () => {
    const stringContainer = new StringContainer(' Some untrimmed string ');

    const errors = await validator.validate(stringContainer);
    expect(errors[0]?.target).toEqual(stringContainer);
    expect(errors[0]?.value).toEqual(' Some untrimmed string ');
    expect(errors[0]?.property).toEqual('name');
    expect(errors[0]?.constraints).toEqual({
      [CustomDecoratorName.isTrimmedString]: 'name must be a trimmed string',
    });
  });

  it('should allow an untrimmed string after transform', async () => {
    const stringContainer = plainToClass(
      StringContainer,
      new StringContainer(' Some untrimmed string '),
    );

    const errors = await validator.validate(stringContainer);
    expect(errors.length).toEqual(0);
  });

  it('should disallow a string with a space at the start', async () => {
    const stringContainer = new StringContainer(' Some untrimmed string');

    const errors = await validator.validate(stringContainer);
    expect(errors[0]?.target).toEqual(stringContainer);
    expect(errors[0]?.value).toEqual(' Some untrimmed string');
    expect(errors[0]?.property).toEqual('name');
    expect(errors[0]?.constraints).toEqual({
      [CustomDecoratorName.isTrimmedString]: 'name must be a trimmed string',
    });
  });

  it('should disallow a string with a space at the end', async () => {
    const stringContainer = new StringContainer('Some untrimmed string ');

    const errors = await validator.validate(stringContainer);
    expect(errors[0]?.target).toEqual(stringContainer);
    expect(errors[0]?.value).toEqual('Some untrimmed string ');
    expect(errors[0]?.property).toEqual('name');
    expect(errors[0]?.constraints).toEqual({
      [CustomDecoratorName.isTrimmedString]: 'name must be a trimmed string',
    });
  });

  it('should disallow a string with a \\n symbol at the end', async () => {
    const stringContainer = new StringContainer('Some untrimmed string\n');

    const errors = await validator.validate(stringContainer);
    expect(errors[0]?.target).toEqual(stringContainer);
    expect(errors[0]?.value).toEqual('Some untrimmed string\n');
    expect(errors[0]?.property).toEqual('name');
    expect(errors[0]?.constraints).toEqual({
      [CustomDecoratorName.isTrimmedString]: 'name must be a trimmed string',
    });
  });

  it('should disallow a string with a   symbol at the end', async () => {
    const stringContainer = new StringContainer('Some untrimmed string ');

    const errors = await validator.validate(stringContainer);
    expect(errors[0]?.target).toEqual(stringContainer);
    expect(errors[0]?.value).toEqual('Some untrimmed string ');
    expect(errors[0]?.property).toEqual('name');
    expect(errors[0]?.constraints).toEqual({
      [CustomDecoratorName.isTrimmedString]: 'name must be a trimmed string',
    });
  });

  it('should allow a empty string value', async () => {
    const stringContainer = new StringContainer('');

    const errors = await validator.validate(stringContainer);
    expect(errors.length).toEqual(0);
  });

  it('should disallow a non-string value', async () => {
    const stringContainer = new StringContainer(101010 as unknown as string);

    const errors = await validator.validate(stringContainer);
    expect(errors[0]?.target).toEqual(stringContainer);
    expect(errors[0]?.value).toEqual(101010);
    expect(errors[0]?.property).toEqual('name');
    expect(errors[0]?.constraints).toEqual({
      [CustomDecoratorName.isTrimmedString]: 'name must be a trimmed string',
    });
  });
});
