import { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { Quotations } from "../quotations";

const queryClient = new QueryClient();

export const App = (): ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <Quotations />
    </QueryClientProvider>
  );
};
