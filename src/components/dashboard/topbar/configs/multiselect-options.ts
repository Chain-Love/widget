import { Scan, Search, Wrench, Database, Globe, Settings } from 'lucide-react';
import { IconConfig } from '@/components/ui/image-with-fallback';

export type OptionMeta = {
  label?: string;
  description?: string;
  icon?: IconConfig;
};

export type OptionsByValue = Record<string, OptionMeta>;
export type OptionsMetaByFilterKey = Record<string, OptionsByValue>;

// Case-insensitive metadata for multiSelect options. Only override where
// design requires icon/description/label; unknown options fall back to text.
export const MULTISELECT_OPTIONS_META: OptionsMetaByFilterKey = {
  plan: {
    dedicated: {
      label: 'Dedicated',
      description:
        'Private, high-performance node access with guaranteed resources.',
      icon: {
        primary: {
          filename: `dedicated.svg`,
        },
        fallback: {
          lucide: Settings,
        },
      },
    },
    enterprise: {
      label: 'Enterprise',
      description:
        'Scalable, secure solutions for large teams and organizations.',
      icon: {
        primary: {
          filename: `database.svg`,
        },
        fallback: {
          lucide: Settings,
        },
      },
    },
    growth: {
      label: 'Growth',
      description: 'Flexible plan for scaling projects with balanced pricing.',
      icon: {
        primary: {
          filename: `database-growth.svg`,
        },
        fallback: {
          lucide: Settings,
        },
      },
    },
    free: {
      label: 'Free',
      description: 'Basic access with limited requests — perfect for testing.',
      icon: {
        primary: {
          filename: `database-free.svg`,
        },
        fallback: {
          lucide: Settings,
        },
      },
    },
    default: {
      icon: {
        primary: {
          lucide: Settings,
        },
      },
      description: 'Service plan with standard features and pricing.',
    },
  },
  nodeType: {
    'fevm archive': {
      label: 'FEVM Archive',
      description:
        'Stores full history plus FVM (Filecoin Virtual Machine) data.',
      icon: {
        primary: {
          filename: `computertower.svg`,
        },
        fallback: {
          lucide: Database,
        },
      },
    },
    'full archive': {
      label: 'Full Archive',
      description: 'Keeps complete blockchain history for deep data queries.',
      icon: {
        primary: {
          filename: `trayarrown.svg`,
        },
        fallback: {
          lucide: Database,
        },
      },
    },
    'recent-state': {
      label: 'Recent State',
      description:
        'Holds only the latest state for faster, lightweight access.',
      icon: {
        primary: {
          filename: `lightning.svg`,
        },
        fallback: {
          lucide: Database,
        },
      },
    },
    default: {
      icon: {
        primary: {
          lucide: Database,
        },
      },
      description: 'Node type with standard data storage configuration.',
    },
  },
  technology: {
    blockscout: {
      label: 'BlockScout',
      description: 'Open-source block explorer framework.',
      icon: {
        primary: {
          lucide: Scan,
        },
      },
    },
    etherscan: {
      label: 'Etherscan',
      description: 'EVM explorer and analytics platform.',
      icon: {
        primary: {
          lucide: Search,
        },
      },
    },
    custom: {
      label: 'Custom',
      description: 'Custom/3rd-party explorer implementation.',
      icon: {
        primary: {
          lucide: Wrench,
        },
      },
    },

    default: {
      icon: {
        primary: {
          lucide: Settings,
        },
      },
      description: 'Technology implementation with standard features.',
    },
  },
  regions: {
    asia: {
      label: 'Asia',
      description:
        'Node providers hosted in Asian data centers for low-latency access.',
      icon: {
        primary: {
          filename: `globe.svg`,
        },
        fallback: {
          lucide: Globe,
        },
      },
    },
    europe: {
      label: 'Europe',
      description:
        'European-based nodes ensuring faster response across EU regions.',
      icon: {
        primary: {
          filename: `globe.svg`,
        },
        fallback: {
          lucide: Globe,
        },
      },
    },
    us: {
      label: 'US',
      description:
        'US-located nodes for reliable and quick blockchain access in America.',
      icon: {
        primary: {
          filename: `globe.svg`,
        },
        fallback: {
          lucide: Globe,
        },
      },
    },
    global: {
      label: 'Global',
      description: 'All countries and regions.',
      icon: {
        primary: {
          filename: `globe.svg`,
        },
        fallback: {
          lucide: Globe,
        },
      },
    },
    default: {
      icon: {
        primary: {
          lucide: Globe,
        },
      },
      description: 'Geographic region with standard node coverage.',
    },
  },
  default: {
    default: {
      icon: {
        primary: {
          lucide: Settings,
        },
      },
      description: 'Description not provided yet.',
    },
  },
};
