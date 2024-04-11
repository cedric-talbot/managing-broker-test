import React, { ReactElement, useCallback, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  CircularProgress,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
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
  const [autocompleteFocus, setAutocompleteFocus] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  const getBrokers = useCallback(async () => {
    const res = await axios.get(
      process.env.REACT_APP_BROKER_API_HOST + "/brokers" + (search !== "" ? `?search=${search}` : "")
    );
    return res.data;
  }, [search]);

  const { data, isError, isLoading } = useQuery<Broker[]>({
    queryKey: ["brokers", debouncedSearch],
    queryFn: getBrokers,
    enabled: !!debouncedSearch,
  });

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
              if (!(isLoading || isError)) options.push("Add");
              // Filtering is handled on the backend side
              return options;
            }}
            renderOption={(props, option) => (
              <React.Fragment key={typeof option === "string" ? option : option.name}>
                <li {...props}>
                  <Box sx={{ width: "100%" }}>
                    {typeof option === "string" ? (
                      <>
                        Or <u>Add manually</u>
                      </>
                    ) : (
                      `${option.name} - ${option.address} - ${option.city} - ${option.country}`
                    )}
                  </Box>
                </li>
                {typeof option !== "string" && <Divider />}
              </React.Fragment>
            )}
            onFocus={() => setAutocompleteFocus(true)}
            onBlur={() => setAutocompleteFocus(false)}
            open={!!debouncedSearch && !!search && selectedBroker === null && autocompleteFocus}
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
