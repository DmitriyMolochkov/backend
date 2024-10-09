import { ValueTransformer } from 'typeorm';

export const BigIntTransformer: ValueTransformer = {
  to(value: bigint) {
    return value;
  },
  from(value: string): bigint {
    return BigInt(value);
  },
};
