import { CursorBasedMetaDto } from 'src/common/dtos/cursor-based-meta.dto';
import { CursorBasedQueryDto } from 'src/common/dtos/cursor-based-query.dto';
import { OffsetBasedMetaDto } from 'src/common/dtos/offset-based-meta.dto';
import { OffsetBasedQueryDto } from 'src/common/dtos/offset-based-query.dto';
import { Direction } from 'src/common/enums/direction.enum';
import { SelectQueryBuilder } from 'typeorm';

export async function paginateOffset<T, K>(
  source: SelectQueryBuilder<T>,
  { page, take }: OffsetBasedQueryDto,
  adapterFunction?: (data: T[]) => K[],
) {
  const countQuery = source.getCount();
  //sửa lại đếm = 0 => ko cần query items
  const itemsQuery = source
    // .orderBy(orderBy ? `${orderBy}` : 'createdDate', order)
    .skip((page - 1) * take)
    .take(take)
    .getMany();
  const [count, items] = await Promise.all([countQuery, itemsQuery]);

  if (adapterFunction) {
    const adaptedItems = adapterFunction(items);
    return new OffsetBasedMetaDto<K>(adaptedItems, count, page, take);
  }

  return new OffsetBasedMetaDto<T>(items, count, page, take);
}

export async function paginateCursor<T, K>(
  source: SelectQueryBuilder<T>,
  field: string,
  { cursor, take, direction }: CursorBasedQueryDto,
  adapterFunction?: (data: T[]) => K[],
) {
  let items = await source
    .orderBy(field, (direction === Direction.NEXT ? 'ASC' : 'DESC'))
    // .take(take + 1)
    .take(take)
    .where(`${field} ${direction === Direction.NEXT ? '>' : '<'} :cursor`, { cursor })
    .getMany();
  
  // const hasMore = items.length > take;
  // if(hasMore){
  //   items.pop();
  // }

  if(direction === Direction.PREV){
    items = items.reverse();
  }
  
  if (adapterFunction) {
    const adaptedItems = adapterFunction(items);
    return new CursorBasedMetaDto<K>(adaptedItems, take);
  }

  return new CursorBasedMetaDto<T>(items, take);
}
