import { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@mui/material";

import { Quotations } from "../quotations";
import { theme } from "./theme";

const queryClient = new QueryClient();

export const App = (): ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Quotations />
      </ThemeProvider>
    </QueryClientProvider>
  );
};
