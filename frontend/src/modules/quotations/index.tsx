import { ReactElement } from "react";
import styled from "@emotion/styled";

import { Parties } from "./templates/parties";

export const Quotations = (): ReactElement => {
  return (
    <Container>
      <Parties />
    </Container>
  );
};

const Container = styled.div`
  margin: 20px;
`;
