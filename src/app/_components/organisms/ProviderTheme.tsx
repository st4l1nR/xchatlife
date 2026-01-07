"use client";

import { ThemeProvider } from "next-themes";

type ProviderThemeProps = {
  children: React.ReactNode;
};

const ProviderTheme: React.FC<ProviderThemeProps> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default ProviderTheme;
