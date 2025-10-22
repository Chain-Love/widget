'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table';

type RowSelection = Record<string, boolean>;

type ProviderSelectionState = {
  rowSelection: RowSelection;
  setRowSelection: (
    next: RowSelection | ((prev: RowSelection) => RowSelection),
  ) => void;
  unselectSlugs: (slugs: string[]) => void;

  columnFilters: ColumnFiltersState;
  setColumnFilters: (
    next:
      | ColumnFiltersState
      | ((prev: ColumnFiltersState) => ColumnFiltersState),
  ) => void;

  columnVisibility: VisibilityState;
  setColumnVisibility: (
    next: VisibilityState | ((prev: VisibilityState) => VisibilityState),
  ) => void;

  resetAll: () => void;
};

export const useProviderSelectionStore = create<ProviderSelectionState>()(
  persist(
    set => ({
      rowSelection: {},
      setRowSelection: next =>
        set(state => ({
          rowSelection:
            typeof next === 'function' ? next(state.rowSelection) : next,
        })),
      unselectSlugs: slugs =>
        set(state => {
          const next = { ...state.rowSelection };
          slugs.forEach(id => delete next[id]);
          return { rowSelection: next };
        }),

      columnFilters: [],
      setColumnFilters: next =>
        set(state => ({
          columnFilters:
            typeof next === 'function' ? next(state.columnFilters) : next,
        })),

      columnVisibility: {},
      setColumnVisibility: next =>
        set(state => ({
          columnVisibility:
            typeof next === 'function' ? next(state.columnVisibility) : next,
        })),

      resetAll: () =>
        set({
          rowSelection: {},
          columnFilters: [],
          columnVisibility: {},
        }),
    }),
    {
      name: 'provider-selection',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
