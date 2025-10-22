import { CellContext, SortingFn, VisibilityState } from '@tanstack/react-table';
import { ReactElement } from 'react';
import VerifiedLatency from './fields/rpc/verified-latency';
import VerifiedBlocksBehindAverage from './fields/shared/verified-blocks-behind-average';
import ArrayCellPopover from './fields/shared/array-cell-popover';
import ActionButton from '@/components/ui/buttons/action-button';
import UptimeSla from './fields/shared/uptime-sla';
import BandwidthSla from './fields/shared/bandwidth-sla';
import BlocksBehindSla from './fields/shared/blocks-behind-sla';
import VerifiedUptime from './fields/shared/verified-uptime';
import * as l from 'lucide-react';
import {
  multiSelect,
  priceSort,
  range,
  select,
} from '../ui/data-table/helpers';
import AccountAddress from '../ui/account-address';
import {
  CategoryEntityMap,
  CategoryKey,
} from '@/service/infrastructureProvidersApi/types';
import TagsCellPopover from './fields/shared/tags-cell-popover';
import { IconConfig } from '@/components/ui/image-with-fallback';
import ProviderCell from './fields/shared/provider';
import NumericRangeCell from './fields/shared/numeric-range-cell';

export const filterFns = {
  range: range,
  select: select,
  multiSelect: multiSelect,
};

export interface CellProps<T> {
  ctx: CellContext<T, unknown>;
}

type Column<K extends string, Row> = {
  key: K;
  size?: number;

  header: {
    label: string;
    icon?: IconConfig;
    selectAllRows?: boolean;
    headerTooltip?: string;
    sort?: SortingFn<Row> | 'off';
  };
  cell?: {
    component?: (ctx: CellContext<Row, unknown>) => ReactElement;
    filter?: keyof typeof filterFns;
    tooltip?: string;
  };
};

type CategoryCfg<C extends CategoryKey> = {
  id: C;
  label: string;
  icon?: IconConfig;
  description?: string;
  initialState?: {
    columnVisibility?: VisibilityState;
  };
  getColumns: (
    data?: CategoryEntityMap[C][],
  ) => Column<keyof CategoryEntityMap[C] & string, CategoryEntityMap[C]>[];
};

export function colFor<C extends CategoryKey>() {
  type Row = CategoryEntityMap[C];

  return <K extends keyof Row & string>(
    key: K,
    header: {
      label: string;
      icon?: IconConfig;
      selectAllRows?: boolean;
      headerTooltip?: string;
      sort?: SortingFn<Row> | 'off';
    },
    cell?: {
      component?: (ctx: CellContext<Row, unknown>) => ReactElement;
      filter?: keyof typeof filterFns;
      tooltip?: string;
    },
    state?: {
      size?: number;
    },
  ) => ({
    key,
    header,
    cell,
    size: state?.size,
  });
}

const colRpc = colFor<'rpc'>();
const colIdx = colFor<'indexing'>();
const colExp = colFor<'explorer'>();
const colOra = colFor<'oracle'>();
const colBr = colFor<'bridge'>();
const colDev = colFor<'devTool'>();
const colFau = colFor<'faucet'>();
const colAnl = colFor<'analytic'>();
const colWlt = colFor<'wallet'>();

export const CATEGORIES: { [K in CategoryKey]: CategoryCfg<K> } = {
  rpc: {
    id: 'rpc',
    label: 'Remote Procedure Call (RPC)',
    icon: {
      primary: { filename: `rpc.svg` },
      fallback: { lucide: l.Network },
    },

    description:
      'Servers that connect to blockchain and send transactions fast.',
    initialState: {
      columnVisibility: {},
    },
    getColumns: () => {
      const cols: Column<
        keyof CategoryEntityMap['rpc'] & string,
        CategoryEntityMap['rpc']
      >[] = [
        colRpc(
          'provider',
          {
            label: 'Provider',
            icon: { primary: { lucide: l.Unplug } },
            selectAllRows: true,
            headerTooltip:
              'Service provider (company/organization). Click +/− to expand and see available plans. Use the group checkbox to select all visible plans from this provider; the header checkbox selects/deselects all visible rows on the current page.',
          },
          {
            component: c => <ProviderCell ctx={c} />,
          },
          {
            size: 400,
          },
        ),
        colRpc(
          'actionButtons',
          { label: 'Action', sort: 'off' },
          {
            component: (c: CellContext<CategoryEntityMap['rpc'], unknown>) => (
              <ActionButton
                ctx={c}
                actionButtons={c.row.original.actionButtons}
              />
            ),
          },
          {
            size: 80,
          },
        ),
        colRpc(
          'address',
          {
            label: 'Address',
            icon: { primary: { lucide: l.SquareUserRound } },
          },
          {
            component: (c: CellContext<any, unknown>) => (
              <>
                {c.row.original.address ? (
                  <AccountAddress
                    maxAddressLength={120}
                    accountAddress={c.row.original.address || ''}
                  />
                ) : (
                  '—'
                )}
              </>
            ),
          },
        ),

        colRpc(
          'plan',
          {
            label: 'Plan',
            icon: {
              primary: { filename: `plan.svg` },
              fallback: { lucide: l.NotepadText },
            },
          },
          {
            filter: 'multiSelect',
            tooltip: 'Select one or more available plans for the provider.',
          },
          {
            size: 100,
          },
        ),
        colRpc(
          'nodeType',
          {
            label: 'Node Type',
            icon: {
              primary: { filename: `settings.svg` },
              fallback: { lucide: l.Settings2 },
            },
          },
          {
            filter: 'multiSelect',
            tooltip:
              'Select one or more available node types for the provider.',
          },
          {
            size: 115,
          },
        ),

        colRpc(
          'chain',
          {
            label: 'Chain',
            icon: { primary: { lucide: l.Link } },
          },
          {},
          { size: 85 },
        ),

        colRpc(
          'regions',
          {
            label: 'Regions',
            icon: {
              primary: { filename: `regions.svg` },
              fallback: { lucide: l.Globe },
            },
          },
          {
            filter: 'multiSelect',
            tooltip: 'Filter providers by supported regions of operation.',
            component: (c: CellContext<CategoryEntityMap['rpc'], unknown>) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.regions}
                title='Regions:'
              />
            ),
          },
        ),
        colRpc(
          'accessPrice',
          {
            label: 'Access Price',
            sort: priceSort,
            icon: {
              primary: { filename: `access-price.svg` },
              fallback: { lucide: l.Receipt },
            },
          },
          {
            filter: 'range',
            tooltip:
              'Set a range for the access price (subscription or base fee).',
            component: (c: CellContext<CategoryEntityMap['rpc'], unknown>) => (
              <NumericRangeCell ctx={c} suffix={'$'} />
            ),
          },
        ),
        colRpc(
          'queryPrice',
          {
            label: 'Query Price',
            icon: { primary: { lucide: l.ReceiptCent } },
          },
          {
            filter: undefined,
            tooltip: 'Set a range for the query price (per API call).',
            component: (c: CellContext<CategoryEntityMap['rpc'], unknown>) => (
              <NumericRangeCell ctx={c} suffix={'$'} />
            ),
          },
        ),
        colRpc(
          'trial',

          {
            label: 'Trial',
            icon: {
              primary: { filename: `trial.svg` },
              fallback: { lucide: l.Tag },
            },
          },
          {
            filter: 'select',
            tooltip: 'Filter providers offering a free trial.',
          },
        ),
        colRpc(
          'uptimeSla',
          {
            label: 'Uptime SLA',
            sort: 'off',
            icon: { primary: { lucide: l.Activity } },
          },
          {
            component: (c: CellContext<CategoryEntityMap['rpc'], unknown>) => (
              <UptimeSla ctx={c} />
            ),
            filter: undefined,
            tooltip: 'Minimum guaranteed uptime SLA of the provider.',
          },
        ),
        colRpc(
          'verifiedUptime',
          {
            label: 'Verified Uptime',
            sort: 'off',
            icon: { primary: { lucide: l.AlarmClockCheck } },
          },
          {
            component: (c: CellContext<CategoryEntityMap['rpc'], unknown>) => (
              <VerifiedUptime ctx={c} />
            ),
            filter: undefined,
            tooltip: 'Actual verified uptime recorded for the provider.',
          },
        ),
        colRpc(
          'bandwidthSla',
          {
            label: 'Bandwidth SLA',
            sort: 'off',
            icon: { primary: { lucide: l.SquareActivity } },
          },
          {
            component: (c: CellContext<CategoryEntityMap['rpc'], unknown>) => (
              <BandwidthSla ctx={c} />
            ),
            filter: undefined,
            tooltip: 'Guaranteed bandwidth capacity in SLA terms.',
          },
        ),
        colRpc(
          'blocksBehindSla',
          {
            label: 'Blocks Behind SLA',
            sort: 'off',
            icon: { primary: { lucide: l.DatabaseZap } },
          },
          {
            component: (c: CellContext<CategoryEntityMap['rpc'], unknown>) => (
              <BlocksBehindSla ctx={c} />
            ),
            filter: undefined,
            tooltip:
              'Maximum allowed number of blocks behind the latest block.',
          },
        ),
        colRpc(
          'verifiedBlocksBehindAvg',
          {
            label: 'Verified Blocks Behind Avg.',
            sort: 'off',
            icon: { primary: { lucide: l.ChartBarBig } },
          },
          {
            component: (c: CellContext<CategoryEntityMap['rpc'], unknown>) => (
              <VerifiedBlocksBehindAverage ctx={c} />
            ),
          },
        ),
        colRpc(
          'verifiedLatency',
          {
            label: 'Verified Latency',
            sort: 'off',
            icon: { primary: { lucide: l.Gauge } },
          },
          {
            component: (c: CellContext<CategoryEntityMap['rpc'], unknown>) => (
              <VerifiedLatency ctx={c} />
            ),
          },
        ),
        colRpc(
          'availableApis',
          {
            label: 'Available APIs',
            icon: { primary: { lucide: l.Webhook } },
          },
          {
            component: (c: CellContext<CategoryEntityMap['rpc'], unknown>) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.availableApis}
                title='Available APIs:'
              />
            ),
          },
        ),
        colRpc(
          'securityImprovements',
          {
            label: 'Security Improvements',
            icon: { primary: { lucide: l.Shield } },
          },
          {
            component: (c: CellContext<CategoryEntityMap['rpc'], unknown>) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.securityImprovements}
                title='Security Improvements:'
              />
            ),
          },
        ),
        colRpc(
          'monitoringAndAnalytics',
          {
            label: 'Monitoring & Analytics',
            icon: { primary: { lucide: l.BarChart } },
          },
          {
            component: (c: CellContext<CategoryEntityMap['rpc'], unknown>) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.monitoringAndAnalytics}
                title='Monitoring & Analytics'
              />
            ),
          },
        ),
        colRpc(
          'limitations',
          {
            label: 'Limitations',
            icon: { primary: { lucide: l.ShieldAlert } },
          },
          {
            component: (c: CellContext<CategoryEntityMap['rpc'], unknown>) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.limitations}
                title='Limitations:'
              />
            ),
          },
        ),
      ];

      return cols;
    },
  },

  indexing: {
    id: 'indexing',
    label: 'Indexing',
    icon: {
      primary: { filename: `indexing.svg` },
      fallback: { lucide: l.TextQuote },
    },
    description:
      'Services to search, filter, and access structured blockchain data.',
    initialState: {},
    getColumns: () => {
      const cols: Column<
        keyof CategoryEntityMap['indexing'] & string,
        CategoryEntityMap['indexing']
      >[] = [
        colIdx(
          'provider',
          {
            label: 'Provider',
            icon: { primary: { lucide: l.Unplug } },
            selectAllRows: true,
          },
          {
            component: c => <ProviderCell ctx={c} />,
          },
          {
            size: 200,
          },
        ),
        colIdx(
          'actionButtons',
          { label: 'Actions', sort: 'off' },
          {
            component: (c: CellContext<any, unknown>) => (
              <ActionButton
                ctx={c}
                actionButtons={c.row.original.actionButtons}
              />
            ),
          },
          {
            size: 80,
          },
        ),
        colIdx(
          'address',
          {
            label: 'Address',
            icon: { primary: { lucide: l.SquareUserRound } },
          },
          {
            component: (c: CellContext<any, unknown>) => (
              <>
                {c.row.original.address ? (
                  <AccountAddress
                    maxAddressLength={120}
                    accountAddress={c.row.original.address || ''}
                  />
                ) : (
                  '—'
                )}
              </>
            ),
          },
        ),

        colIdx('chain', {
          label: 'Chain',
          icon: { primary: { lucide: l.Link } },
        }),

        colIdx(
          'regions',
          {
            label: 'Regions',
            icon: {
              primary: { filename: `regions.svg` },
              fallback: { lucide: l.Globe },
            },
          },
          {
            filter: 'multiSelect',
            tooltip: 'Filter providers by supported regions of operation.',
            component: (
              c: CellContext<CategoryEntityMap['indexing'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.regions}
                title='Regions:'
              />
            ),
          },
        ),
        colIdx(
          'technology',
          {
            label: 'Technology',
            icon: { primary: { lucide: l.Cpu } },
          },
          {
            filter: 'multiSelect',
            tooltip: 'Select one or more indexing technologies.',
          },
        ),
        colIdx(
          'plan',
          {
            label: 'Plan',
            icon: {
              primary: { filename: `plan.svg` },
              fallback: { lucide: l.NotepadText },
            },
          },
          {
            filter: 'multiSelect',
            tooltip: 'Select one or more available plans for the provider.',
          },
        ),
        colIdx(
          'accessPrice',
          {
            label: 'Access Price',
            sort: priceSort,
            icon: {
              primary: { filename: `access-price.svg` },
              fallback: { lucide: l.Receipt },
            },
          },
          {
            filter: 'range',
            tooltip:
              'Set a range for the access price (subscription or base fee).',
            component: (
              c: CellContext<CategoryEntityMap['indexing'], unknown>,
            ) => <NumericRangeCell ctx={c} suffix={'$'} />,
          },
        ),
        colIdx(
          'queryPrice',
          {
            label: 'Query Price',
            icon: { primary: { lucide: l.ReceiptCent } },
          },
          {
            filter: undefined,
            tooltip: 'Set a range for the query price (per API call).',
            component: (
              c: CellContext<CategoryEntityMap['indexing'], unknown>,
            ) => <NumericRangeCell ctx={c} suffix={'$'} />,
          },
        ),
        colIdx(
          'trial',

          {
            label: 'Trial',
            icon: {
              primary: { filename: `trial.svg` },
              fallback: { lucide: l.Tag },
            },
          },
          {
            filter: 'select',
            tooltip: 'Filter providers offering a free trial.',
          },
        ),
        colIdx('supportSla', {
          label: 'Support SLA',
          icon: { primary: { lucide: l.CalendarClock } },
        }),
        colIdx(
          'uptimeSla',
          {
            label: 'Uptime SLA',
            sort: 'off',
            icon: { primary: { lucide: l.Activity } },
          },
          {
            component: (c: CellContext<any, unknown>) => <UptimeSla ctx={c} />,
            filter: undefined,
            tooltip: 'Minimum guaranteed uptime SLA for the indexing.',
          },
        ),
        colIdx(
          'verifiedUptime',
          {
            label: 'Verified Uptime',
            sort: 'off',
            icon: { primary: { lucide: l.AlarmClockCheck } },
          },
          {
            component: (c: CellContext<any, unknown>) => (
              <VerifiedUptime ctx={c} />
            ),
            filter: undefined,
            tooltip: 'Actual verified uptime recorded for the provider.',
          },
        ),
        colIdx(
          'bandwidthSla',
          {
            label: 'Bandwidth SLA',
            sort: 'off',
            icon: { primary: { lucide: l.SquareActivity } },
          },
          {
            component: (c: CellContext<any, unknown>) => (
              <BandwidthSla ctx={c} />
            ),
            filter: undefined,
            tooltip: 'Guaranteed bandwidth capacity in SLA terms.',
          },
        ),
        colIdx(
          'blocksBehindSla',
          {
            label: 'Blocks Behind SLA',
            sort: 'off',
            icon: { primary: { lucide: l.DatabaseZap } },
          },
          {
            component: (c: CellContext<any, unknown>) => (
              <BlocksBehindSla ctx={c} />
            ),
            filter: undefined,
            tooltip:
              'Maximum allowed number of blocks behind the latest block.',
          },
        ),
        colIdx(
          'verifiedLatency',
          {
            label: 'Verified Latency',
            sort: 'off',
            icon: { primary: { lucide: l.Gauge } },
          },
          {
            component: (c: CellContext<any, unknown>) => (
              <BlocksBehindSla ctx={c} />
            ),
            filter: undefined,
            tooltip:
              'Maximum allowed number of blocks behind the latest block.',
          },
        ),
        colIdx(
          'verifiedBlocksBehindAvg',
          {
            label: 'Verified Blocks Behind Avg.',
            sort: 'off',
            icon: { primary: { lucide: l.ChartBarBig } },
          },
          {
            component: (c: CellContext<any, unknown>) => (
              <VerifiedBlocksBehindAverage ctx={c} />
            ),
          },
        ),
        colIdx(
          'availableApis',
          {
            label: 'Available APIs',
            icon: { primary: { lucide: l.Webhook } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['indexing'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.availableApis}
                title='Available APIs:'
              />
            ),
          },
        ),
        colIdx(
          'limitations',
          {
            label: 'Limitations',
            icon: { primary: { lucide: l.ShieldAlert } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['indexing'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.limitations}
                title='Limitations:'
              />
            ),
          },
        ),
        colIdx(
          'securityImprovements',
          {
            label: 'Security Improvements',
            icon: { primary: { lucide: l.Shield } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['indexing'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.securityImprovements}
                title='Security Improvements'
              />
            ),
          },
        ),
        colIdx(
          'monitoringAndAnalytics',
          {
            label: 'Monitoring & Analytics',
            icon: { primary: { lucide: l.BarChart } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['indexing'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.monitoringAndAnalytics}
                title='Monitoring & Analytics'
              />
            ),
          },
        ),
        colIdx(
          'additionalFeatures',
          {
            label: 'Additional Features',
            icon: { primary: { lucide: l.Lightbulb } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['indexing'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.additionalFeatures}
                title='Additional Features:'
              />
            ),
          },
        ),
      ];

      return cols;
    },
  },

  explorer: {
    id: 'explorer',
    label: 'Explorers',
    icon: {
      primary: { filename: `explorers.svg` },
      fallback: { lucide: l.Binoculars },
    },
    description:
      'Tools to view transactions, blocks, and addresses in real time.',
    initialState: {
      columnVisibility: {},
    },
    getColumns: () => {
      const cols: Column<
        keyof CategoryEntityMap['explorer'] & string,
        CategoryEntityMap['explorer']
      >[] = [
        colExp(
          'provider',
          {
            label: 'Provider',
            icon: { primary: { lucide: l.Unplug } },
            selectAllRows: true,
          },
          {
            component: c => <ProviderCell ctx={c} />,
          },
          {
            size: 200,
          },
        ),
        colExp(
          'actionButtons',
          {
            label: 'Actions',
            sort: 'off',
            icon: { primary: { lucide: l.Navigation } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['explorer'], unknown>,
            ) => (
              <ActionButton
                ctx={c}
                actionButtons={c.row.original.actionButtons}
              />
            ),
          },
          {
            size: 80,
          },
        ),

        colExp('chain', {
          label: 'Chain',
          icon: { primary: { lucide: l.Link } },
        }),

        colExp(
          'technology',
          {
            label: 'Technology',
            icon: { primary: { lucide: l.Cpu } },
          },
          {
            filter: 'multiSelect',
            tooltip: 'Select one or more explorer technologies.',
          },
        ),
        colExp(
          'availableApis',
          {
            label: 'Available APIs',
            icon: { primary: { lucide: l.Webhook } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['explorer'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.availableApis}
                title='Available APIs:'
              />
            ),
          },
        ),
        colExp(
          'sdk',
          { label: 'SDK', icon: { primary: { lucide: l.Layers } } },
          {
            component: (
              c: CellContext<CategoryEntityMap['explorer'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.sdk}
                title='SDK:'
              />
            ),
          },
        ),
        colExp(
          'searchCapabilities',
          {
            label: 'Search Capabilities',
            icon: { primary: { lucide: l.ScanSearch } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['explorer'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.searchCapabilities}
                title='Search Capabilities:'
              />
            ),
          },
        ),
        colExp(
          'smartContractsVerifications',
          {
            label: 'Smart Contracts Verifications',
            icon: { primary: { lucide: l.ShieldCheck } },
          },
          {
            filter: 'select',
            tooltip:
              'Filter explorers that support smart contract verifications.',
          },
        ),
        colExp(
          'fullHistory',
          {
            label: 'Full History',
            icon: { primary: { lucide: l.History } },
          },
          {
            filter: 'select',
            tooltip:
              'Filter explorers that store full history of blockchain data.',
          },
        ),
        colExp(
          'pricing',
          {
            label: 'Pricing',
            icon: { primary: { lucide: l.BadgeDollarSign } },
          },
          {},
          { size: 120 },
        ),

        colExp(
          'monitoringAndAnalytics',
          {
            label: 'Monitoring & Analytics',
            icon: { primary: { lucide: l.BarChart } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['explorer'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.monitoringAndAnalytics}
                title='Monitoring & Analytics'
              />
            ),
          },
        ),
        colExp(
          'additionalFeatures',
          {
            label: 'Additional Features',
            icon: { primary: { lucide: l.Lightbulb } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['explorer'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.additionalFeatures}
                title='Additional Features:'
              />
            ),
          },
        ),
      ];

      return cols;
    },
  },

  oracle: {
    id: 'oracle',
    label: 'Oracles',
    icon: {
      primary: { filename: `oracles.svg` },
      fallback: { lucide: l.Waypoints },
    },
    description:
      'Services that bring external data into blockchain for smart contracts.',
    initialState: {
      columnVisibility: {},
    },
    getColumns: () => {
      const cols: Column<
        keyof CategoryEntityMap['oracle'] & string,
        CategoryEntityMap['oracle']
      >[] = [
        colOra(
          'provider',
          {
            label: 'Provider',
            icon: { primary: { lucide: l.Unplug } },
            selectAllRows: true,
          },
          {
            component: c => <ProviderCell ctx={c} />,
          },
          {
            size: 200,
          },
        ),
        colOra(
          'actionButtons',
          {
            label: 'Actions',
            sort: 'off',
            icon: { primary: { lucide: l.Navigation } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['oracle'], unknown>,
            ) => (
              <ActionButton
                ctx={c}
                actionButtons={c.row.original.actionButtons}
              />
            ),
          },
          {
            size: 80,
          },
        ),

        colOra('chain', {
          label: 'Chain',
          icon: { primary: { lucide: l.Link } },
        }),

        colOra(
          'technology',
          {
            label: 'Technology',
            icon: { primary: { lucide: l.Cpu } },
          },
          {
            filter: 'multiSelect',
            tooltip: 'Select one or more supported oracle technologies.',
          },
        ),
        colOra(
          'accessPrice',
          {
            label: 'Access Price',
            icon: {
              primary: { filename: `access-price.svg` },
              fallback: { lucide: l.Receipt },
            },
          },
          {
            filter: 'range',
            tooltip: 'Set a range for the access price of the oracle.',
            component: (
              c: CellContext<CategoryEntityMap['oracle'], unknown>,
            ) => <NumericRangeCell ctx={c} />,
          },
        ),
        colOra(
          'queryPrice',
          {
            label: 'Query Price',
            icon: { primary: { lucide: l.ReceiptCent } },
          },
          {
            filter: undefined,
            tooltip:
              'Set a range for the query price of the oracle (per data fetch).',
            component: (
              c: CellContext<CategoryEntityMap['oracle'], unknown>,
            ) => <NumericRangeCell ctx={c} />,
          },
        ),
        colOra(
          'availableApis',
          {
            label: 'Available APIs',
            icon: { primary: { lucide: l.Webhook } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['oracle'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.availableApis}
                title='Available APIs:'
              />
            ),
          },
        ),
        colOra(
          'dataTypes',
          {
            label: 'Data Types',
            icon: {
              primary: { lucide: l.Database },
            },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['oracle'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.dataTypes}
                title='Data Types:'
              />
            ),
          },
        ),
        colOra(
          'sdk',
          { label: 'SDK', icon: { primary: { lucide: l.Layers } } },
          {
            component: (
              c: CellContext<CategoryEntityMap['oracle'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.sdk}
                title='SDK:'
              />
            ),
          },
        ),
        colOra(
          'decentralizationModel',
          {
            label: 'Decentralization',
            icon: { primary: { lucide: l.Shapes } },
          },
          {
            filter: 'multiSelect',
            tooltip: 'Filter oracles by decentralization model.',
          },
        ),
        colOra(
          'economicalSecurity',
          {
            label: 'Economical Security',
            icon: { primary: { lucide: l.ShieldHalf } },
          },
          {
            filter: 'select',
            tooltip:
              'Filter oracles that provide economic security guarantees.',
          },
        ),
        colOra(
          'economicalSecurityNote',
          {
            label: 'Economical Security Note',
            icon: { primary: { lucide: l.ShieldEllipsis } },
          },
          {},
        ),
        colOra(
          'auditsPerformed',
          {
            label: 'Audits Performed',
            icon: { primary: { lucide: l.BookLock } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['oracle'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.auditsPerformed}
                title='Audits Performed:'
              />
            ),
          },
        ),
        colOra(
          'monitoringAndAnalytics',
          {
            label: 'Monitoring & Analytics',
            icon: { primary: { lucide: l.BarChart } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['oracle'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.monitoringAndAnalytics}
                title='Monitoring & Analytics'
              />
            ),
          },
        ),
        colOra(
          'additionalFeatures',
          {
            label: 'Additional Features',
            icon: { primary: { lucide: l.Lightbulb } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['oracle'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.additionalFeatures}
                title='Additional Features:'
              />
            ),
          },
        ),
      ];

      return cols;
    },
  },

  bridge: {
    id: 'bridge',
    label: 'Bridges',
    icon: {
      primary: { filename: `bridges.svg` },
      fallback: { lucide: l.BringToFront },
    },
    description:
      'Tools for transferring tokens and data across different blockchains.',
    initialState: {
      columnVisibility: {},
    },
    getColumns: () => {
      const cols: Column<
        keyof CategoryEntityMap['bridge'] & string,
        CategoryEntityMap['bridge']
      >[] = [
        colBr(
          'provider',
          {
            label: 'Provider',
            icon: { primary: { lucide: l.Unplug } },
            selectAllRows: true,
          },
          {
            component: c => <ProviderCell ctx={c} />,
          },
          {
            size: 200,
          },
        ),
        colBr(
          'actionButtons',
          {
            label: 'Actions',
            sort: 'off',
            icon: { primary: { lucide: l.Navigation } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['bridge'], unknown>,
            ) => (
              <ActionButton
                ctx={c}
                actionButtons={c.row.original.actionButtons}
              />
            ),
          },
          {
            size: 80,
          },
        ),

        colBr('chain', {
          label: 'Chain',
          icon: { primary: { lucide: l.Link } },
        }),

        colBr(
          'technology',
          {
            label: 'Technology',
            icon: { primary: { lucide: l.Cpu } },
          },
          {},
        ),
        colBr(
          'openSource',
          {
            label: 'Open Source',
            icon: { primary: { lucide: l.Code } },
          },
          {
            filter: 'select',
            tooltip:
              'Filter bridges that have open source codebases available to the public.',
          },
        ),
        colBr(
          'support',
          { label: 'Support', icon: { primary: { lucide: l.Handshake } } },
          {
            component: (
              c: CellContext<CategoryEntityMap['bridge'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.support}
                title='Support:'
              />
            ),
          },
        ),
        colBr(
          'supportedChains',
          { label: 'Supported Chains', icon: { primary: { lucide: l.Ratio } } },
          {
            component: (
              c: CellContext<CategoryEntityMap['bridge'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.supportedChains}
                title='Support:'
              />
            ),
          },
        ),
        colBr(
          'price',
          { label: 'Price', icon: { primary: { lucide: l.BadgeDollarSign } } },
          {
            component: (
              c: CellContext<CategoryEntityMap['bridge'], unknown>,
            ) => <NumericRangeCell ctx={c} />,
          },
        ),
        colBr(
          'assetTypes',
          {
            label: 'Asset Types',
            icon: { primary: { lucide: l.SlidersVertical } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['bridge'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.assetTypes}
                title='Asset Types:'
              />
            ),
          },
        ),

        colBr('txSpeedSla', {
          label: 'TX Speed SLA',
          icon: { primary: { lucide: l.Gauge } },
        }),

        colBr(
          'throughputSla',
          {
            label: 'Throughput SLA',
            icon: { primary: { lucide: l.Activity } },
          },
          {
            filter: undefined,
            tooltip: 'Guaranteed transaction throughput SLA.',
          },
        ),
        colBr(
          'availableApis',
          {
            label: 'Available APIs',
            icon: { primary: { lucide: l.Webhook } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['bridge'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.availableApis}
                title='Available APIs:'
              />
            ),
          },
        ),
        colBr(
          'sdk',
          { label: 'SDK', icon: { primary: { lucide: l.Layers } } },
          {
            component: (
              c: CellContext<CategoryEntityMap['bridge'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.sdk}
                title='SDK:'
              />
            ),
          },
        ),
        colBr(
          'monitoringAndAnalytics',
          {
            label: 'Monitoring & Analytics',
            icon: { primary: { lucide: l.BarChart } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['bridge'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.monitoringAndAnalytics}
                title='Monitoring & Analytics'
              />
            ),
          },
        ),
        colBr(
          'additionalFeatures',
          {
            label: 'Additional Features',
            icon: { primary: { lucide: l.Lightbulb } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['bridge'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.additionalFeatures}
                title='Additional Features:'
              />
            ),
          },
        ),
        colBr(
          'decentralizationModel',
          {
            label: 'Decentralization',
            icon: { primary: { lucide: l.Shapes } },
          },
          {
            filter: 'multiSelect',
            tooltip: 'Filter bridges by decentralization model.',
          },
        ),
        colBr(
          'economicalSecurity',
          {
            label: 'Economical Security',
            icon: { primary: { lucide: l.ShieldHalf } },
          },
          {
            filter: 'select',
            tooltip:
              'Filter bridges that provide economic security guarantees.',
          },
        ),
        colBr(
          'economicalSecurityNote',
          {
            label: 'Economical Security Note',
            icon: { primary: { lucide: l.ShieldEllipsis } },
          },
          {},
        ),
        colBr(
          'auditsPerformed',
          {
            label: 'Audits Performed',
            icon: { primary: { lucide: l.BookLock } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['bridge'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.auditsPerformed}
                title='Audits Performed:'
              />
            ),
          },
        ),
      ];

      return cols;
    },
  },

  devTool: {
    id: 'devTool',
    label: 'Dev Tooling',
    icon: {
      primary: { filename: `dev-tool.svg` },
      fallback: { lucide: l.CodeXml },
    },
    description: 'SDKs, APIs, libraries, and utilities for developers.',
    initialState: {
      columnVisibility: {},
    },
    getColumns: () => {
      const cols: Column<
        keyof CategoryEntityMap['devTool'] & string,
        CategoryEntityMap['devTool']
      >[] = [
        colDev(
          'provider',
          {
            label: 'Provider',
            icon: { primary: { lucide: l.Unplug } },
            selectAllRows: true,
          },
          {
            component: c => <ProviderCell ctx={c} />,
          },
          {
            size: 120,
          },
        ),
        colDev(
          'actionButtons',
          {
            label: 'Actions',
            sort: 'off',
            icon: { primary: { lucide: l.Navigation } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['devTool'], unknown>,
            ) => (
              <ActionButton
                ctx={c}
                actionButtons={c.row.original.actionButtons}
              />
            ),
          },
          {
            size: 80,
          },
        ),
        colDev(
          'tag',
          { label: 'Tags', icon: { primary: { lucide: l.Tags } } },
          {
            filter: 'multiSelect',
            tooltip: 'Select one or more tags of developer tools.',
            component: (
              c: CellContext<CategoryEntityMap['devTool'], unknown>,
            ) => <TagsCellPopover value={c.row.original.tag} title='Tags:' />,
          },
        ),
        colDev(
          'toolType',
          { label: 'Tool Type', icon: { primary: { lucide: l.Wrench } } },
          {
            filter: 'multiSelect',
            tooltip: 'Select one or more types of developer tools.',
          },
        ),

        colDev('price', {
          label: 'Price',
          icon: { primary: { lucide: l.BadgeDollarSign } },
        }),
        colDev('description', {
          label: 'Description',
          icon: { primary: { lucide: l.MessageSquareText } },
        }),
      ];

      return cols;
    },
  },

  faucet: {
    id: 'faucet',
    label: 'Faucets',
    icon: {
      primary: {
        filename: `faucets.svg`,
      },
      fallback: {
        lucide: l.Coins,
      },
    },
    description: 'Get free test tokens for development and test networks.',
    initialState: {
      columnVisibility: {},
    },
    getColumns: () => {
      const cols: Column<
        keyof CategoryEntityMap['faucet'] & string,
        CategoryEntityMap['faucet']
      >[] = [
        colFau(
          'provider',
          {
            label: 'Provider',
            icon: { primary: { lucide: l.Unplug } },
            selectAllRows: true,
          },
          {
            component: c => <ProviderCell ctx={c} />,
          },
          {
            size: 200,
          },
        ),
        colFau(
          'actionButtons',
          {
            label: 'Actions',
            sort: 'off',
            icon: { primary: { lucide: l.Navigation } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['faucet'], unknown>,
            ) => (
              <ActionButton
                ctx={c}
                actionButtons={c.row.original.actionButtons}
              />
            ),
          },
          {
            size: 80,
          },
        ),

        colFau('chain', {
          label: 'Chain',
          icon: { primary: { lucide: l.Link } },
        }),

        colFau(
          'requiresLogin',
          {
            label: 'Requires Login',
            icon: { primary: { lucide: l.LogIn } },
          },
          {
            filter: 'select',
            tooltip: 'Filter faucets that require user authentication.',
          },
        ),
        colFau(
          'hasCaptcha',
          {
            label: 'Has Captcha',
            icon: { primary: { lucide: l.Fingerprint } },
          },
          {
            filter: 'select',
            tooltip: 'Filter faucets that use captchas.',
          },
        ),

        colFau('requiredMainnetBalance', {
          label: 'Required Mainnet Balance',
          icon: { primary: { lucide: l.SquareAsterisk } },
        }),
        colFau('dripLimitAmount', {
          label: 'Drip Limit Amount',
          icon: { primary: { lucide: l.Droplet } },
        }),
        colFau('dripLimitAmount', { label: 'Drip Limit Amount' }),
        colFau(
          'dripLimitPeriod',
          {
            label: 'Drip Limit Period',
            icon: { primary: { lucide: l.Clock } },
          },
          {
            filter: 'range',
            tooltip:
              'Select faucets based on how often users can request tokens (e.g., daily, hourly).',
          },
        ),
        colFau(
          'additionalNotes',
          {
            label: 'Additional Notes',
            icon: { primary: { lucide: l.Lightbulb } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['faucet'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.additionalNotes}
                title='Additional Notes:'
              />
            ),
          },
        ),
        colFau(
          'price',
          { label: 'Price', icon: { primary: { lucide: l.BadgeDollarSign } } },
          {
            component: (
              c: CellContext<CategoryEntityMap['faucet'], unknown>,
            ) => <NumericRangeCell ctx={c} />,
          },
        ),
      ];

      return cols;
    },
  },

  analytic: {
    id: 'analytic',
    label: 'Analytics',
    icon: {
      primary: { filename: `analytics.svg` },
      fallback: { lucide: l.ChartNoAxesCombined },
    },
    description: 'Platforms to monitor blockchain data, metrics, and activity.',
    initialState: {
      columnVisibility: {},
    },
    getColumns: () => {
      const cols: Column<
        keyof CategoryEntityMap['analytic'] & string,
        CategoryEntityMap['analytic']
      >[] = [
        colAnl(
          'provider',
          {
            label: 'Provider',
            icon: { primary: { lucide: l.Unplug } },
            selectAllRows: true,
          },
          {
            component: c => <ProviderCell ctx={c} />,
          },
          {
            size: 200,
          },
        ),
        colAnl(
          'actionButtons',
          {
            label: 'Actions',
            sort: 'off',
            icon: { primary: { lucide: l.Navigation } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['analytic'], unknown>,
            ) => (
              <ActionButton
                ctx={c}
                actionButtons={c.row.original.actionButtons}
              />
            ),
          },
          {
            size: 80,
          },
        ),

        colAnl('chain', {
          label: 'Chain',
          icon: { primary: { lucide: l.Link } },
        }),

        colAnl(
          'price',
          { label: 'Price', icon: { primary: { lucide: l.BadgeDollarSign } } },
          {
            component: (
              c: CellContext<CategoryEntityMap['analytic'], unknown>,
            ) => <NumericRangeCell ctx={c} />,
          },
        ),
        colAnl(
          'dataSources',
          {
            label: 'Data Sources',
            icon: { primary: { lucide: l.Database } },
          },
          {
            filter: 'multiSelect',
            tooltip:
              'Filter by supported data sources (e.g., subgraphs, APIs).',
            component: (
              c: CellContext<CategoryEntityMap['analytic'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.dataSources}
                title='Data Sources'
              />
            ),
          },
        ),
        colAnl(
          'hasDashboard',
          {
            label: 'Dashboard',
            icon: { primary: { lucide: l.LayoutDashboard } },
          },
          {
            filter: 'select',
            tooltip: 'Filter analytics tools with dashboards.',
          },
        ),
        colAnl(
          'availableApis',
          {
            label: 'Available APIs',
            icon: { primary: { lucide: l.Webhook } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['analytic'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.availableApis}
                title='Available APIs:'
              />
            ),
          },
        ),
      ];

      return cols;
    },
  },

  wallet: {
    id: 'wallet',
    label: 'Wallets',
    icon: {
      primary: { filename: `wallets.svg` },
      fallback: { lucide: l.WalletMinimal },
    },
    description: 'Apps to store, send, and interact with tokens and DApps.',
    initialState: {
      columnVisibility: {},
    },
    getColumns: () => {
      const cols: Column<
        keyof CategoryEntityMap['wallet'] & string,
        CategoryEntityMap['wallet']
      >[] = [
        colWlt(
          'provider',
          {
            label: 'Provider',
            icon: { primary: { lucide: l.Unplug } },
            selectAllRows: true,
          },
          {
            component: c => <ProviderCell ctx={c} />,
          },
          {
            size: 200,
          },
        ),
        colWlt(
          'actionButtons',
          {
            label: 'Actions',
            sort: 'off',
            icon: { primary: { lucide: l.Navigation } },
          },
          {
            component: (
              c: CellContext<CategoryEntityMap['wallet'], unknown>,
            ) => (
              <ActionButton
                ctx={c}
                actionButtons={c.row.original.actionButtons}
              />
            ),
          },
          {
            size: 80,
          },
        ),
        colWlt(
          'openSource',
          {
            label: 'Open Source',
            icon: { primary: { lucide: l.Code } },
          },
          {
            filter: 'select',
            tooltip: 'Whether the wallet is open source.',
          },
        ),
        colWlt(
          'supportedPlatforms',
          {
            label: 'Supported Platforms',
            icon: { primary: { lucide: l.Airplay } },
          },
          {
            filter: undefined,
            tooltip: 'Platforms where the wallet is available.',
            component: (
              c: CellContext<CategoryEntityMap['wallet'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.supportedPlatforms}
                title='Supported Platforms:'
              />
            ),
          },
        ),
        colWlt(
          'custodial',
          { label: 'Custodial', icon: { primary: { lucide: l.FolderKey } } },
          {
            filter: undefined,
            tooltip: 'Whether the wallet holds user keys (custodial).',
          },
        ),
        colWlt(
          'mfa',
          { label: 'MFA', icon: { primary: { lucide: l.Key } } },
          {
            filter: undefined,
            tooltip: 'Supports multi-factor authentication.',
          },
        ),
        colWlt(
          'msig',
          { label: 'MSIG', icon: { primary: { lucide: l.ScanQrCode } } },
          {
            filter: undefined,
            tooltip: 'Supports multi-signature accounts.',
          },
        ),
        colWlt(
          'hardware',
          { label: 'Hardware', icon: { primary: { lucide: l.Inbox } } },
          {
            filter: undefined,
            tooltip: 'Supports hardware wallets.',
          },
        ),
        colWlt(
          'keyExport',
          {
            label: 'Key Export',
            icon: { primary: { lucide: l.FolderOutput } },
          },
          {
            filter: undefined,
            tooltip: 'Supports exporting private keys.',
          },
        ),
        colWlt(
          'native',
          {
            label: 'Native',
            icon: { primary: { lucide: l.Waypoints } },
          },
          {
            filter: 'select',
            tooltip: 'Is this a native wallet for the blockchain?',
          },
        ),
        colWlt(
          'evm',
          { label: 'EVM', icon: { primary: { lucide: l.Zap } } },
          {
            filter: 'select',
            tooltip: 'Supports Ethereum Virtual Machine.',
          },
        ),
        colWlt(
          'tendermint',
          { label: 'Tendermint', icon: { primary: { lucide: l.DatabaseZap } } },
          {
            filter: undefined,
            tooltip: 'Supports Tendermint protocol.',
          },
        ),
        colWlt(
          'tokensSupport',
          {
            label: 'Tokens Support',
            icon: { primary: { lucide: l.Coins } },
          },
          {
            filter: 'multiSelect',
            tooltip: 'Supported token standards.',
            component: (
              c: CellContext<CategoryEntityMap['wallet'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.tokensSupport}
                title='Tokens Support:'
              />
            ),
          },
        ),
        colWlt(
          'staking',
          {
            label: 'Staking',
            icon: { primary: { lucide: l.ChartBarStacked } },
          },
          {
            filter: undefined,
            tooltip: 'Supports staking operations.',
          },
        ),
        colWlt(
          'price',
          { label: 'Price', icon: { primary: { lucide: l.BadgeDollarSign } } },
          {
            component: (
              c: CellContext<CategoryEntityMap['wallet'], unknown>,
            ) => <NumericRangeCell ctx={c} />,
          },
        ),
        colWlt(
          'support',
          { label: 'Support', icon: { primary: { lucide: l.Handshake } } },
          {
            filter: undefined,
            tooltip: 'Support channels provided by the wallet.',
            component: (
              c: CellContext<CategoryEntityMap['wallet'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.support}
                title='Support:'
              />
            ),
          },
        ),
        colWlt(
          'audit',
          {
            label: 'Audit Info',
            icon: { primary: { lucide: l.AudioWaveform } },
          },
          {
            filter: undefined,
            tooltip: 'Audit reports or sources.',
            component: (
              c: CellContext<CategoryEntityMap['wallet'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.audit}
                title='Audit Info:'
              />
            ),
          },
        ),
        colWlt(
          'languages',
          {
            label: 'Languages',
            icon: { primary: { lucide: l.Earth } },
          },
          {
            filter: 'multiSelect',
            tooltip: 'Supported interface languages.',
            component: (
              c: CellContext<CategoryEntityMap['wallet'], unknown>,
            ) => (
              <ArrayCellPopover
                ctx={c}
                value={c.row.original.languages}
                title='Languages:'
              />
            ),
          },
        ),
      ];

      return cols;
    },
  },
};
