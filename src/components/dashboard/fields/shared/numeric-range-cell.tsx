'use client';

// Removed MarkdownCell to avoid markdown parsing issues
import { CellContext } from '@tanstack/react-table';

interface NumericRangeCellProps {
  ctx?: CellContext<any, unknown>;
  value?: number | string | Array<number | string> | null;
  prefix?: string;
  suffix?: string;
  precision?: number;
}

function extractAllNumbers(s: string): number[] {
  // Normalize different types of spaces to regular spaces for consistent parsing
  const normalized = s.replace(/[\u00A0\u202F\u2009]/g, ' ');

  // First, look for ranges like "50-200" or "$50-200" using global search
  const rangeMatches = normalized.match(
    /\$?(\d+(?:[.,]\d+)?)\s*-\s*\$?(\d+(?:[.,]\d+)?)/g,
  );

  if (rangeMatches) {
    const rangeNumbers: number[] = [];
    // Process each found range individually
    for (const range of rangeMatches) {
      // Extract individual numbers from each range using non-global search
      const parts = range.match(
        /\$?(\d+(?:[.,]\d+)?)\s*-\s*\$?(\d+(?:[.,]\d+)?)/,
      );
      if (parts) {
        // Parse both numbers from the range
        const num1 = parseNumber(parts[1]);
        const num2 = parseNumber(parts[2]);
        // Add valid numbers to the result array
        if (Number.isFinite(num1)) rangeNumbers.push(num1);
        if (Number.isFinite(num2)) rangeNumbers.push(num2);
      }
    }
    // Return range numbers if any were found
    if (rangeNumbers.length > 0) {
      return rangeNumbers;
    }
  }

  // If no ranges found, look for individual numbers
  const matches = normalized.match(/-?[\d\s\.,]+/g);
  if (!matches) return [];
  const nums: number[] = [];
  // Process each found number token
  for (let token of matches) {
    // Clean up the token by removing extra spaces
    token = token.trim().replace(/\s+/g, '');
    const n = parseNumber(token);
    // Add valid numbers to the result array
    if (Number.isFinite(n)) nums.push(n);
  }
  return nums;
}

function parseNumber(token: string): number {
  const hasComma = token.includes(',');
  const hasDot = token.includes('.');

  if (hasComma && hasDot) {
    if (token.lastIndexOf(',') > token.lastIndexOf('.')) {
      token = token.replace(/\./g, '').replace(/,/g, '.');
    } else {
      token = token.replace(/,/g, '');
    }
  } else if (hasComma) {
    if (/^\d{1,3}(?:,\d{3})+$/.test(token)) {
      token = token.replace(/,/g, '');
    } else {
      token = token.replace(/,/g, '.');
    }
  } else if (hasDot) {
    if (/^\d{1,3}(?:\.\d{3})+$/.test(token)) {
      token = token.replace(/\./g, '');
    }
  }

  return Number(token);
}

function numbersFromUnknown(v: unknown): number[] {
  if (typeof v === 'number' && Number.isFinite(v)) return [v];
  if (typeof v === 'string') return extractAllNumbers(v);
  return [];
}

function format(n: number, precision = 6): string {
  if (Number.isInteger(n)) return n.toString();
  return n
    .toFixed(precision)
    .replace(/\.0+$/, '')
    .replace(/(\.\d*?)0+$/, '$1');
}

export default function NumericRangeCell({
  ctx,
  value: propValue,
  prefix,
  suffix,
  precision = 6,
}: NumericRangeCellProps) {
  const rowAny: any = ctx?.row?.original;
  const id = ctx?.column?.id as string | undefined;
  const col: any = ctx?.column as any;
  const colDef: any = col?.columnDef;
  const isGroup = !!rowAny?.__isGroup;

  const pre = prefix ?? '';
  const suf = suffix ?? '';

  const baseCellClass =
    'grid h-12 w-max max-w-40 items-center overflow-auto text-wrap text-sm leading-none';

  const resolveFromOriginal = (original: any): unknown => {
    try {
      if (colDef?.accessorFn && typeof colDef.accessorFn === 'function') {
        return colDef.accessorFn(original, 0);
      }
      if (typeof colDef?.accessorKey === 'string') {
        const key = colDef.accessorKey as string;
        if (key.includes('.')) {
          return key
            .split('.')
            .reduce(
              (acc: any, k) => (acc == null ? undefined : acc[k]),
              original,
            );
        }
        return original?.[key];
      }
      if (id) {
        if (id.includes('.')) {
          return id
            .split('.')
            .reduce(
              (acc: any, k) => (acc == null ? undefined : acc[k]),
              original,
            );
        }
        return original?.[id];
      }
    } catch {}
    return undefined;
  };

  // Collect values for this column from a custom __children tree (recursively)
  const collectFromChildren = (node: any, acc: unknown[]) => {
    if (!node) return;
    const children = node.__children;
    if (Array.isArray(children) && children.length > 0) {
      for (const ch of children) collectFromChildren(ch, acc);
      return;
    }
    // Leaf-like node
    const v = resolveFromOriginal(node);
    if (v !== undefined) acc.push(v);
  };

  // Helper to pull values for this column from group children
  const getGroupChildValues = (): unknown[] => {
    const values: unknown[] = [];
    if (!ctx || !id) return values;

    // Prefer TanStack API if present
    const rowAnyObj: any = ctx.row as any;
    if (typeof rowAnyObj?.getLeafRows === 'function') {
      try {
        const leafRows = rowAnyObj.getLeafRows();
        if (Array.isArray(leafRows) && leafRows.length > 0) {
          for (const r of leafRows as any[]) {
            try {
              const orig = (r as any).original;
              const fromAccessor = resolveFromOriginal(orig);
              values.push(
                fromAccessor !== undefined
                  ? fromAccessor
                  : (r as any).getValue(id),
              );
            } catch {}
          }
          return values;
        }
      } catch {}
    }

    // Fallback to recursively traverse custom children
    collectFromChildren(rowAny, values);
    return values;
  };

  if (isGroup && id) {
    const agg: number[] = [];
    const childValues = getGroupChildValues();
    for (const v of childValues) {
      if (Array.isArray(v)) {
        for (const item of v as unknown[]) {
          agg.push(...numbersFromUnknown(item));
        }
      } else {
        agg.push(...numbersFromUnknown(v));
      }
    }

    const numbers = Array.from(new Set(agg));
    if (numbers.length === 0) return <span>—</span>;

    const min = Math.min(...numbers);
    const max = Math.max(...numbers);

    if (min === max) {
      return <span>{`${pre}${format(min, precision)}${suf}`}</span>;
    }

    return (
      <span>{`${pre}${format(min, precision)}-${format(max, precision)}${suf}`}</span>
    );
  }

  // Leaf row: show original string as-is or a formatted pure number, no Markdown
  const raw = propValue !== undefined ? propValue : ctx?.getValue?.();

  if (raw == null) return <span>—</span>;

  if (Array.isArray(raw)) {
    for (const v of raw as unknown[]) {
      if (typeof v === 'string' && v.trim().length > 0) {
        return <span className={baseCellClass}>{v}</span>;
      }
    }
    for (const v of raw as unknown[]) {
      if (typeof v === 'number' && Number.isFinite(v)) {
        return (
          <span
            className={baseCellClass}
          >{`${pre}${format(v, precision)}${suf}`}</span>
        );
      }
    }
    return (
      <span className={baseCellClass}>
        {String((raw as unknown[])[0] ?? '')}
      </span>
    );
  }

  if (typeof raw === 'string') {
    return <span className={baseCellClass}>{raw}</span>;
  }

  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return (
      <span
        className={baseCellClass}
      >{`${pre}${format(raw, precision)}${suf}`}</span>
    );
  }

  return <span className={baseCellClass}>{String(raw)}</span>;
}
