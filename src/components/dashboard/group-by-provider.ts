import {
  CategoryEntityMap,
  CategoryKey,
} from '@/service/infrastructureProvidersApi/types';

export type GroupRow<T> = {
  provider: string;
  __isGroup: true;
  __children: T[];
  __count: number;
};

export type TableRow<K extends CategoryKey> =
  | CategoryEntityMap[K]
  | GroupRow<CategoryEntityMap[K]>;

export function groupByProvider<K extends CategoryKey>(
  rows: CategoryEntityMap[K][],
): TableRow<K>[] {
  const byProv = new Map<string, CategoryEntityMap[K][]>();

  for (const r of rows) {
    const key = (r as any).provider || 'Unknown';
    if (!byProv.has(key)) byProv.set(key, []);
    byProv.get(key)!.push(r);
  }

  const out: TableRow<K>[] = [];
  for (const [prov, items] of byProv) {
    if (items.length > 1) {
      const children = [...items].sort(
        (a, b) => Number(b.starred) - Number(a.starred),
      );

      out.push({
        provider: prov,
        __isGroup: true,
        __children: children,
        __count: children.length,
      } as GroupRow<CategoryEntityMap[K]>);
    } else {
      out.push(items[0]);
    }
  }

  return out.sort((a: any, b: any) => {
    const ag = !!a.__isGroup;
    const bg = !!b.__isGroup;

    // Helper function to check if a group has starred children
    const hasStarredChildren = (item: any) => {
      if (!item.__isGroup) return item.starred;
      return item.__children?.some((child: any) => child.starred) ?? false;
    };

    const aStarred = hasStarredChildren(a);
    const bStarred = hasStarredChildren(b);

    // First, sort by starred status (starred items first)
    const starredDiff = Number(bStarred) - Number(aStarred);
    if (starredDiff !== 0) return starredDiff;

    // Then, sort groups before individual items (if same starred status)
    if (ag !== bg) return ag ? -1 : 1;

    return 0;
  });
}

export function isGroupRow<K extends CategoryKey>(
  row: TableRow<K>,
): row is GroupRow<CategoryEntityMap[K]> {
  return (row as any)?.__isGroup === true;
}
