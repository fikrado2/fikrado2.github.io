declare module "*.jsx" {
  import type { ReactNode } from "react";
  const Component: (props: Record<string, unknown>) => ReactNode;
  export default Component;
  export const LanguageProvider: (props: { children?: ReactNode }) => ReactNode;
  export const ThemeProvider: (props: { children?: ReactNode }) => ReactNode;
  export function useLanguage(): Record<string, unknown>;
}
