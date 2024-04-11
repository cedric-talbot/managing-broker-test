import styled from "@emotion/styled";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { ReactElement } from "react";
import { Broker } from ".";

interface AddBrokerDialogProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (newBroker: Broker) => void;
}

export const AddBrokerDialog = ({ open, handleClose, handleSubmit }: AddBrokerDialogProps): ReactElement => {
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
      <DialogTitle>Add manually</DialogTitle>

      <DialogContent>
        <TextFieldContainer>
          <TextField fullWidth required label="Legal name" name="name" />
        </TextFieldContainer>
        <TextFieldContainer>
          <TextField fullWidth required label="Address" name="address" />
        </TextFieldContainer>
        <TextFieldContainer>
          <TextField fullWidth required label="City" name="city" />
        </TextFieldContainer>
        <TextFieldContainer>
          <TextField fullWidth required label="Country" name="country" />
        </TextFieldContainer>
      </DialogContent>
      <DialogActions sx={{ padding: "8px 24px 24px" }}>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button variant="contained" type="submit" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TextFieldContainer = styled.div`
  padding: 4px 0;
`;
