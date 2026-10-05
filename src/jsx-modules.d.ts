declare module "*.jsx" {
  import type { ReactNode } from "react";
  const Component: (props: any) => ReactNode;
  export default Component;
  export const LanguageProvider: (props: { children?: ReactNode }) => ReactNode;
  export const ThemeProvider: (props: { children?: ReactNode }) => ReactNode;
  export function useLanguage(): any;
}
