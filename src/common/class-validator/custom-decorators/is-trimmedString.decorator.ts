import { Transform, TransformFnParams, TransformOptions } from 'class-transformer';
import {
  ValidateBy,
  ValidationOptions,
  buildMessage,
  isString,
} from 'class-validator';

import CustomDecoratorName from './custom-decorator-name.enum';

export function IsTrimmedString(
  validationOptions?: ValidationOptions,
  transformOptions?: TransformOptions,
) {
  const trim = Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'string') {
      return value.trim();
    }

    return value as unknown;
  }, transformOptions);

  const isTrimmedString = ValidateBy(
    {
      name: CustomDecoratorName.isTrimmedString,
      validator: {
        validate: (value): boolean => isString(value) && !value.match(/^\s|\s$/),
        defaultMessage: buildMessage(
          (eachPrefix: string) => `${eachPrefix}$property must be a trimmed string`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  );

  return (target: object, key: string) => {
    trim(target, key);
    isTrimmedString(target, key);
  };
}
