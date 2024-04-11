import { ReactElement, useCallback, useState } from "react";
import { Alert, Autocomplete, CircularProgress, InputAdornment, TextField, Typography } from "@mui/material";
import { useMutation, useQuery } from "react-query";
import styled from "@emotion/styled";
import axios from "axios";

import { Card } from "../../../../components/Card/Card";
import { AddBrokerDialog } from "./AddBrokerDialog";
import { useDebounce } from "../../../../hooks/useDebounce";

export interface Broker {
  name: string;
  address: string;
  city: string;
  country: string;
}

export const Parties = (): ReactElement => {
  const [search, setSearch] = useState("");
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [open, setOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  const getBrokers = useCallback(async () => {
    const res = await axios.get(
      process.env.REACT_APP_BROKER_API_HOST + "/brokers" + (search !== "" ? `?search=${search}` : "")
    );
    return res.data;
  }, [search]);

  const { data, isError, isLoading } = useQuery<Broker[]>(["brokers", debouncedSearch], getBrokers);

  const mutation = useMutation({
    mutationFn: (newBroker: Broker) => {
      return axios.post(process.env.REACT_APP_BROKER_API_HOST + "/brokers", newBroker);
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (newBroker: Broker) => {
    mutation.mutate(newBroker);
    setSelectedBroker(newBroker);
    setOpen(false);
  };

  return (
    <Container>
      <Card title="Managing broker" subTitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit">
        <>
          <Autocomplete<Broker | string>
            value={selectedBroker}
            onChange={(event, newValue) => {
              if (typeof newValue === "string") {
                setOpen(true);
                return;
              }
              setSelectedBroker(newValue);
              setSearch(newValue?.name || "");
            }}
            disablePortal
            noOptionsText={null}
            id="parties-broker-selector"
            options={data || []}
            loading={isLoading}
            inputValue={selectedBroker?.name || search}
            onInputChange={(event, value, reason) => {
              if (reason !== "reset") {
                setSearch(value);
              }
            }}
            getOptionLabel={(option) =>
              typeof option === "string"
                ? option
                : `${option.name} - ${option.address} - ${option.city} - ${option.country}`
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Name"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            filterOptions={(options) => {
              if (!(isLoading || isError)) options.push("or Add manually");
              // Filtering is handled on the backend side
              return options;
            }}
          />
          {isError && (
            <Alert severity="error" sx={{ marginTop: "20px" }}>
              Something went wrong while retrieving the brokers
            </Alert>
          )}
          {selectedBroker !== null && (
            <>
              <DataItem>
                <Typography variant="caption" fontFamily="Montserrat" color="secondary">
                  Address
                </Typography>
                <Typography variant="body2" fontFamily="Montserrat">
                  {selectedBroker.address + " - " + selectedBroker.city}
                </Typography>
              </DataItem>
              <DataItem>
                <Typography variant="caption" fontFamily="Montserrat" color="secondary">
                  Country
                </Typography>
                <Typography variant="body2" fontFamily="Montserrat">
                  {selectedBroker.country}
                </Typography>
              </DataItem>
              <DataItem>
                <TextField label="Contact" fullWidth />
              </DataItem>
              <DataItem>
                <TextField
                  label="Commission"
                  fullWidth
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </DataItem>
            </>
          )}
        </>
      </Card>
      <AddBrokerDialog open={open} handleClose={handleClose} handleSubmit={handleSubmit} />
    </Container>
  );
};

const Container = styled.div`
  width: 50%;
  position: absolute;
`;

const DataItem = styled.div`
  margin-top: 24px;
`;