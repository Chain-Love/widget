import { BreakpointKey } from "@/hooks/useBreakpoint";
import { IconConfig } from "@/components/ui/image-with-fallback";
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    displayName?: string;
    selectAllRows?: boolean;
    headerTooltip?: string;
    icon?: IconConfig;
  }
}
