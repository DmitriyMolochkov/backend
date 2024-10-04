/* eslint @typescript-eslint/prefer-literal-enum-member: off */
import { IS_LOWERCASE, IS_PORT } from 'class-validator';

enum CustomDecoratorName {
  isNullable = 'isNullable',
  isTrimmedString = 'isTrimmedString',
  isLowercase = IS_LOWERCASE,
  isPort = IS_PORT,
}

export default CustomDecoratorName;
