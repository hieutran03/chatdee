import { SelectQueryBuilder } from 'typeorm';
import { Direction } from 'src/shared/common/enums/direction.enum';
import { TCursorPaginationResult } from 'src/shared/common/types/cursor-pagination-result.type';
import { TCursor } from 'src/shared/common/types/cursor.type';

/**
 * Cursor Pagination util
 */
export async function cursorPaginate<T>(
  qb: SelectQueryBuilder<T>,
  limit: number,
  cursor: TCursor,
  cursorField: string = 'createdAt',
  direction: Direction = Direction.NEXT,
): Promise<TCursorPaginationResult<T>> {
  const take = limit;

  // 1. Apply cursor condition
  applyCursorCondition(qb, cursor, cursorField, direction);

  // 2. Get data
  qb.take(take + 1);
  let items = await qb.getMany();

  // 3. Slice excess items
  const { items: slicedItems, hasMore } = sliceItems(items, take);
  items = slicedItems;

  // 4. If direction is PREV, reverse the items to maintain chronological order
  if (direction === Direction.PREV) {
    items.reverse();
  }

  // 5. Calculate cursors
  const { nextCursor, previousCursor } = resolveCursors(items, cursorField, hasMore, direction);

  return {
    data: items,
    limit: take,
    nextCursor,
    previousCursor,
  };
}

/**
 * Áp điều kiện cursor vào query
 */
function applyCursorCondition<T>(
  qb: SelectQueryBuilder<T>,
  cursor: TCursor,
  cursorField: string,
  direction: Direction,
): void {
  if (!cursor) {
    qb.orderBy(`${qb.alias}.${cursorField}`, direction === Direction.NEXT ? 'ASC' : 'DESC');
    return;
  }

  if (direction === Direction.NEXT) {
    qb.andWhere(`${qb.alias}.${cursorField} > :cursor`, { cursor });
    qb.orderBy(`${qb.alias}.${cursorField}`, 'ASC');
  } else {
    qb.andWhere(`${qb.alias}.${cursorField} < :cursor`, { cursor });
    qb.orderBy(`${qb.alias}.${cursorField}`, 'DESC');
  }
}

/**
 * Slice excess items
 */
function sliceItems<T>(items: T[], take: number): { items: T[]; hasMore: boolean } {
  const hasMore = items.length > take;
  return {
    items: hasMore ? items.slice(0, take) : items,
    hasMore,
  };
}

/**
 * Calculate nextCursor and previousCursor
 */
function resolveCursors<T>(
  items: T[],
  cursorField: string,
  hasMore: boolean,
  direction: Direction,
): { nextCursor: TCursor; previousCursor: TCursor } {
  if (items.length === 0) {
    return { nextCursor: null, previousCursor: null };
  }

  const nextCursor = hasMore ? (items[items.length - 1] as any)[cursorField] : null;
  const prevCursor = (items[0] as any)[cursorField];

  return {
    nextCursor: direction === Direction.NEXT ? nextCursor : null,
    previousCursor: direction === Direction.PREV ? prevCursor : null,
  };
}