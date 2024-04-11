import styled from "@emotion/styled";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { ReactElement } from "react";

import { Broker } from ".";
import { useTranslation } from "react-i18next";

interface AddBrokerDialogProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (newBroker: Broker) => void;
}

export const AddBrokerDialog = ({ open, handleClose, handleSubmit }: AddBrokerDialogProps): ReactElement => {
  const { t } = useTranslation("partiesPage");

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          handleSubmit(formJson as Broker);
        },
      }}
    >
      <DialogTitle>{t("MANAGING_BROKER_ADD_BROKER_DIALOG_TITLE")}</DialogTitle>

      <DialogContent>
        <TextFieldContainer>
          <TextField fullWidth required label={t("MANAGING_BROKER_ADD_BROKER_DIALOG_NAME")} name="name" />
        </TextFieldContainer>
        <TextFieldContainer>
          <TextField fullWidth required label={t("MANAGING_BROKER_ADD_BROKER_DIALOG_ADDRESS")} name="address" />
        </TextFieldContainer>
        <TextFieldContainer>
          <TextField fullWidth required label={t("MANAGING_BROKER_ADD_BROKER_DIALOG_CITY")} name="city" />
        </TextFieldContainer>
        <TextFieldContainer>
          <TextField fullWidth required label={t("MANAGING_BROKER_ADD_BROKER_DIALOG_COUNTRY")} name="country" />
        </TextFieldContainer>
      </DialogContent>
      <DialogActions sx={{ padding: "8px 24px 24px" }}>
        <Button onClick={handleClose} color="secondary">
          {t("MANAGING_BROKER_ADD_BROKER_DIALOG_CANCEL_BUTTON")}
        </Button>
        <Button variant="contained" type="submit" color="primary">
          {t("MANAGING_BROKER_ADD_BROKER_DIALOG_SUBMIT_BUTTON")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TextFieldContainer = styled.div`
  padding: 4px 0;
`;
