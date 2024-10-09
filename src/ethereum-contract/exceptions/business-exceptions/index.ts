import { NotFoundException } from 'common/exceptions/business-exceptions';

const TransactionNotFoundException = NotFoundException.bind(undefined, 'Transaction');

export {
  TransactionNotFoundException,
};
