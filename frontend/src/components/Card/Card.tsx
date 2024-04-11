import styled from "@emotion/styled";
import { Paper, Typography } from "@mui/material";
import { ReactElement } from "react";

interface CardProps {
  title: string;
  subTitle: string;
  children: JSX.Element;
}

export const Card = ({ title, subTitle, children }: CardProps): ReactElement => {
  return (
    <Paper>
      <Header>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body2">{subTitle}</Typography>
      </Header>
      <Content>{children}</Content>
    </Paper>
  );
};

const Header = styled.div`
  padding: 16px;
`;

const Content = styled.div`
  padding: 16px;
`;
