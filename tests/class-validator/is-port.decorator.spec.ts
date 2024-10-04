import {
  IS_INT,
  MAX,
  MIN,
  Validator,
} from 'class-validator';

import { IsPort } from 'common/class-validator';

const validator = new Validator();

describe('IsPort decorator', () => {
  class PortContainer {
    @IsPort()
    public port: number;

    public constructor(port: number) {
      this.port = port;
    }
  }

  it('should allow a number 8080', async () => {
    const portContainer = new PortContainer(8080);

    const errors = await validator.validate(portContainer);
    expect(errors.length).toEqual(0);
  });

  it('should disallow a string \'8080\'', async () => {
    const portContainer = new PortContainer('8080' as unknown as number);

    const errors = await validator.validate(portContainer);
    expect(errors[0]?.target).toEqual(portContainer);
    expect(errors[0]?.value).toEqual('8080');
    expect(errors[0]?.property).toEqual('port');
    expect(errors[0]?.constraints).toEqual({
      [IS_INT]: 'port must be an integer number',
      [MAX]: 'port must not be greater than 65535',
      [MIN]: 'port must not be less than 0',
    });
  });

  it('should disallow numbers greater than 65535', async () => {
    const portContainer = new PortContainer(65536);

    const errors = await validator.validate(portContainer);
    expect(errors[0]?.target).toEqual(portContainer);
    expect(errors[0]?.value).toEqual(65536);
    expect(errors[0]?.property).toEqual('port');
    expect(errors[0]?.constraints).toEqual({
      [MAX]: 'port must not be greater than 65535',
    });
  });

  it('should disallow numbers less than 0', async () => {
    const portContainer = new PortContainer(-1);

    const errors = await validator.validate(portContainer);
    expect(errors[0]?.target).toEqual(portContainer);
    expect(errors[0]?.value).toEqual(-1);
    expect(errors[0]?.property).toEqual('port');
    expect(errors[0]?.constraints).toEqual({
      [MIN]: 'port must not be less than 0',
    });
  });

  it('should disallow Infinity', async () => {
    const portContainer = new PortContainer(Infinity);

    const errors = await validator.validate(portContainer);
    expect(errors[0]?.target).toEqual(portContainer);
    expect(errors[0]?.value).toEqual(Infinity);
    expect(errors[0]?.property).toEqual('port');
    expect(errors[0]?.constraints).toEqual({
      [IS_INT]: 'port must be an integer number',
      [MAX]: 'port must not be greater than 65535',
    });
  });

  it('should disallow NaN', async () => {
    const portContainer = new PortContainer(NaN);

    const errors = await validator.validate(portContainer);
    expect(errors[0]?.target).toEqual(portContainer);
    expect(errors[0]?.value).toEqual(NaN);
    expect(errors[0]?.property).toEqual('port');
    expect(errors[0]?.constraints).toEqual({
      [IS_INT]: 'port must be an integer number',
      [MAX]: 'port must not be greater than 65535',
      [MIN]: 'port must not be less than 0',
    });
  });
});
