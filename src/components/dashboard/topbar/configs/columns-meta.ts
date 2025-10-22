export interface ColumnMeta {
  displayName: string;
  description: string;
  disabled?: boolean;
}

export const COLUMNS_META: Record<string, ColumnMeta> = {
  price: {
    displayName: 'Price',
    description: 'Cost of using the service.',
  },
  plan: {
    displayName: 'Plan',
    description: 'Available subscription plans and pricing tiers.',
  },
  nodeType: {
    displayName: 'Node Type',
    description:
      'Type of blockchain node (Archive, Full Archive, Recent State).',
  },
  technology: {
    displayName: 'Technology',
    description: 'Underlying technology stack used by the service.',
  },
  actionButtons: {
    displayName: 'Action Buttons',
    description: 'Interactive buttons for service actions.',
  },
  provider: {
    displayName: 'Provider',
    description: 'Company or organization providing the service.',
  },
  address: {
    displayName: 'Address',
    description: 'Blockchain address associated with the service.',
  },
  chain: {
    displayName: 'Chain',
    description: 'Specific blockchain network identifier.',
  },
  accessPrice: {
    displayName: 'Access Price',
    description: 'Cost to access the service (subscription or base fee).',
  },
  queryPrice: {
    displayName: 'Query Price',
    description: 'Cost per individual API query or request.',
  },
  trial: {
    displayName: 'Trial',
    description: 'Whether the service offers a free trial period.',
  },
  verifiedUptime: {
    displayName: 'Verified Uptime',
    description: 'Independently verified uptime statistics.',
    disabled: true,
  },
  verifiedBlocksBehindAvg: {
    displayName: 'Verified Blocks Behind Avg',
    description: 'Average verified blocks behind over time.',
    disabled: true,
  },
  limitations: {
    displayName: 'Limitations',
    description: 'Known limitations or restrictions of the service.',
  },
  monitoringAndAnalytics: {
    displayName: 'Monitoring & Analytics',
    description: 'Available monitoring tools and analytics features.',
  },
  securityImprovements: {
    displayName: 'Security Improvements',
    description: 'Recent security enhancements and improvements.',
  },
  availableApis: {
    displayName: 'Available APIs',
    description: 'List of available API endpoints and methods.',
  },
  sdk: {
    displayName: 'SDK',
    description: 'Software development kits and client libraries.',
  },
  searchCapabilities: {
    displayName: 'Search Capabilities',
    description: 'Search and query functionality features.',
  },
  smartContractsVerifications: {
    displayName: 'Smart Contracts Verifications',
    description: 'Support for smart contract verification.',
  },
  fullHistory: {
    displayName: 'Full History',
    description: 'Whether the service stores complete blockchain history.',
  },
  dataTypes: {
    displayName: 'Data Types',
    description: 'Types of data supported by the service.',
  },
  decentralizationModel: {
    displayName: 'Decentralization Model',
    description: 'Level of decentralization in the service architecture.',
  },
  economicalSecurity: {
    displayName: 'Economical Security',
    description: 'Economic security guarantees and mechanisms.',
  },
  auditsPerformed: {
    displayName: 'Audits Performed',
    description: 'Security audits and their results.',
  },
  additionalFeatures: {
    displayName: 'Additional Features',
    description: 'Extra features beyond core functionality.',
  },
  openSource: {
    displayName: 'Open Source',
    description: 'Whether the service codebase is open source.',
  },
  support: {
    displayName: 'Support',
    description: 'Available support channels and documentation.',
  },
  supportedChains: {
    displayName: 'Supported Chains',
    description: 'Blockchain networks supported by the service.',
  },
  assetTypes: {
    displayName: 'Asset Types',
    description: 'Types of digital assets supported.',
  },
  txSpeedSla: {
    displayName: 'TX Speed SLA',
    description: 'Guaranteed transaction processing speed.',
  },
  throughputSla: {
    displayName: 'Throughput SLA',
    description: 'Guaranteed transaction throughput capacity.',
  },
  tag: {
    displayName: 'Tags',
    description: 'Categorization tags for the service.',
  },
  toolType: {
    displayName: 'Tool Type',
    description: 'Category of development tool.',
  },
  requiresLogin: {
    displayName: 'Requires Login',
    description: 'Whether user authentication is required.',
  },
  hasCaptcha: {
    displayName: 'Has Captcha',
    description: 'Whether the service uses CAPTCHA verification.',
  },
  requiredMainnetBalance: {
    displayName: 'Required Mainnet Balance',
    description: 'Minimum mainnet balance required to use the service.',
  },
  dripLimitAmount: {
    displayName: 'Drip Limit Amount',
    description: 'Maximum amount of tokens that can be requested.',
  },
  dripLimitPeriod: {
    displayName: 'Drip Limit Period',
    description: 'Time period between token requests.',
  },
  additionalNotes: {
    displayName: 'Additional Notes',
    description: 'Extra information and special considerations.',
  },
  dataSources: {
    displayName: 'Data Sources',
    description: 'Sources of blockchain data used by the service.',
  },
  hasDashboard: {
    displayName: 'Dashboard',
    description: 'Whether the service provides a web dashboard.',
  },
  supportedPlatforms: {
    displayName: 'Supported Platforms',
    description: 'Operating systems and platforms supported.',
  },
  custodial: {
    displayName: 'Custodial',
    description: 'Whether the service holds user private keys.',
  },
  mfa: {
    displayName: 'MFA',
    description: 'Multi-factor authentication support.',
  },
  msig: {
    displayName: 'MSIG',
    description: 'Multi-signature account support.',
  },
  hardware: {
    displayName: 'Hardware',
    description: 'Hardware wallet support.',
  },
  keyExport: {
    displayName: 'Key Export',
    description: 'Ability to export private keys.',
  },
  native: {
    displayName: 'Native',
    description: 'Whether this is a native wallet for the blockchain.',
  },
  evm: {
    displayName: 'EVM',
    description: 'Ethereum Virtual Machine compatibility.',
  },
  tendermint: {
    displayName: 'Tendermint',
    description: 'Tendermint consensus protocol support.',
  },
  tokensSupport: {
    displayName: 'Tokens Support',
    description: 'Supported token standards and types.',
  },
  staking: {
    displayName: 'Staking',
    description: 'Staking functionality support.',
  },
  languages: {
    displayName: 'Languages',
    description: 'Supported interface languages.',
  },
  supportSla: {
    displayName: 'Support SLA',
    description: 'Service level agreement for customer support.',
  },
  economicalSecurityNote: {
    displayName: 'Economical Security Note',
    description: 'Additional notes about economic security.',
  },
  regions: {
    displayName: 'Regions',
    description: 'Geographic regions where the service is available.',
  },
  description: {
    displayName: 'Description',
    description: 'Detailed description of the service or tool.',
  },
  audit: {
    displayName: 'Audit Info',
    description: 'Information about security audits and certifications.',
  },
  uptimeSla: {
    displayName: 'Uptime SLA',
    description: 'Service level agreement for uptime guarantees.',
    disabled: true,
  },
  bandwidthSla: {
    displayName: 'Bandwidth SLA',
    description: 'Service level agreement for bandwidth guarantees.',
    disabled: true,
  },
  blocksBehindSla: {
    displayName: 'Blocks Behind SLA',
    description: 'Service level agreement for blocks behind guarantees.',
    disabled: true,
  },
  verifiedLatency: {
    displayName: 'Verified Latency',
    description: 'Independently verified latency measurements.',
    disabled: true,
  },
};

export function getColumnMeta(columnId: string): ColumnMeta | undefined {
  if (COLUMNS_META[columnId]) {
    return COLUMNS_META[columnId];
  }

  return {
    displayName: columnId.charAt(0).toUpperCase() + columnId.slice(1),
    description: 'Column description not available.',
  };
}
