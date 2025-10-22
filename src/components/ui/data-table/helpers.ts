import { FilterFn, SortingFn, Row } from '@tanstack/react-table';
import { TableRow, isGroupRow } from '@/components/dashboard/group-by-provider';
import {
  CategoryKey,
  CategoryEntityMap,
} from '@/service/infrastructureProvidersApi/types';

export const multiSelect: FilterFn<any> = (
  row,
  columnId,
  selected: string[],
) => {
  const values = String(row.getValue(columnId))
    .split(',')
    .map(v => v.trim());
  return selected.some(sel => values.includes(sel));
};

export const select: FilterFn<any> = (row, columnId, value) => {
  const raw = row.getValue(columnId);
  return typeof raw === 'boolean'
    ? raw === (value === 'Yes')
    : String(raw) === String(value);
};

export const range: FilterFn<any> = (row, columnId, filterValue) => {
  const raw = row.getValue(columnId);

  let num: number | undefined;

  if (typeof raw === 'number') {
    num = raw;
  } else if (typeof raw === 'string') {
    const match = raw.match(/[\d.]+/);
    num = match ? parseFloat(match[0]) : undefined;
  }

  if (typeof num !== 'number' || isNaN(num)) return false;

  return num >= filterValue;
};

const smartStep = (min: number, max: number, desired = 100): number => {
  const raw = (max - min) / desired;
  if (raw > 1000) return 500;
  if (raw > 100) return 100;
  if (raw > 10) return 10;
  if (raw > 1) return 1;
  return Number(raw.toFixed(6));
};

export const buildSelectOptions = (data: any[], key: string) => {
  const raw = data.map(r => r[key]).filter(v => Boolean(v));
  if (raw.every(v => typeof v === 'boolean')) return ['Yes', 'No'];
  return Array.from(
    new Set(
      raw.flatMap(v =>
        String(v)
          .split(',')
          .map((s: string) => s.trim()),
      ),
    ),
  ).sort();
};

export const buildRangeMeta = (data: any[], key: string) => {
  const nums = data
    .map(r => {
      const raw = r[key];
      if (typeof raw === 'number') return raw;
      if (typeof raw === 'string') {
        const match = raw.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : NaN;
      }
      return NaN;
    })
    .filter(n => !isNaN(n));

  if (!nums.length) return { min: 0, max: 100, step: 1 };

  const min = Math.min(...nums);
  const max = Math.max(...nums);
  return { min, max, step: smartStep(min, max) };
};

export const priceSort: SortingFn<any> = (a, b, columnId) => {
  const toNum = (v: unknown) =>
    typeof v === 'number'
      ? v
      : isNaN(Number(v))
        ? Number.MAX_SAFE_INTEGER
        : Number(v);

  const av = toNum(a.getValue(columnId));
  const bv = toNum(b.getValue(columnId));

  return av - bv;
};

/**
 * Determines whether to show starred state for a table row
 * @param row - table row
 * @returns true if starred state should be shown, false otherwise
 */
export const shouldShowStarred = <T>(row: Row<T>): boolean => {
  const rowAny: any = row.original;
  const isGroup = !!rowAny?.__isGroup;
  const isChild = row.depth > 0;

  if (isChild) {
    // Don't show starred for child rows
    return false;
  }

  if (isGroup) {
    // For groups, show if group is starred or has starred children
    const leafs = (row.getLeafRows?.() ?? []).filter(
      r => !(r.getCanExpand?.() ?? false),
    );
    const hasStarredChildren = leafs.some(l => (l.original as any)?.starred);
    return rowAny.starred || hasStarredChildren;
  }

  // For regular rows, show as usual
  return rowAny.starred;
};

/**
 * Determines whether to show starred/sponsored state for grouped provider data
 * @param data - TableRow<CategoryKey> from group-by-provider
 * @returns true if starred state should be shown, false otherwise
 */
export const shouldShowStarredInGroupedData = <K extends CategoryKey>(
  data: TableRow<K>,
): boolean => {
  if (isGroupRow(data)) {
    // For groups, show if has starred children (groups themselves can't be starred)
    const hasStarredChildren = data.__children.some(
      (child: CategoryEntityMap[K]) => child.starred,
    );
    return hasStarredChildren;
  } else {
    // For regular rows, show if starred
    return data.starred;
  }
};
