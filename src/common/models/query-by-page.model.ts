import { PaginationMixin } from 'common/mixins';

import { BaseQuery } from './base-query.model';

export class QueryByPage extends PaginationMixin(BaseQuery) {
}
