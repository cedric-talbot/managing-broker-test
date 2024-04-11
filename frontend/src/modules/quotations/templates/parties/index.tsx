import { ReactElement, useCallback, useState } from "react";
import { Autocomplete, InputAdornment, TextField, Typography } from "@mui/material";
import { useQuery } from "react-query";
import styled from "@emotion/styled";

import { Card } from "../../../../components/Card/Card";

export interface Broker {
  name: string;
  address: string;
  city: string;
  country: string;
  contact?: {
    name: string;
    email: string;
  };
  commission?: number;
}

export const Parties = (): ReactElement => {
  const [search, setSearch] = useState("");
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);

  const getBrokers = useCallback(async () => {
    const res = await fetch("http://localhost:4242/brokers" + (search !== "" ? `?search=${search}` : ""));
    return res.json();
  }, [search]);

  const { data, error, isLoading } = useQuery<Broker[]>(["brokers", search], getBrokers);

  return (
    <Container>
      <Card title="Managing broker" subTitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit">
        <>
          <Autocomplete
            value={selectedBroker}
            onChange={(event, newValue) => {
              setSelectedBroker(newValue);
              setSearch(newValue?.name || "");
            }}
            disablePortal
            noOptionsText={null}
            id="parties-broker-selector"
            options={data || []}
            inputValue={selectedBroker?.name || search}
            onInputChange={(event, value, reason) => {
              if (reason !== "reset") {
                setSearch(value);
              }
            }}
            getOptionLabel={(option) => `${option.name} - ${option.address} - ${option.city} - ${option.country}`}
            renderInput={(params) => <TextField {...params} label="Name" />}
            filterOptions={(options) => {
              // Filtering is handled on the backend side
              return options;
            }}
          />
          {selectedBroker !== null && (
            <>
              <DataItem>
                <Typography variant="caption" fontFamily="Montserrat">
                  Address
                </Typography>
                <Typography variant="body2" fontFamily="Montserrat">
                  {selectedBroker.address + " - " + selectedBroker.city}
                </Typography>
              </DataItem>
              <DataItem>
                <Typography variant="caption" fontFamily="Montserrat">
                  Country
                </Typography>
                <Typography variant="body2" fontFamily="Montserrat">
                  {selectedBroker.country}
                </Typography>
              </DataItem>
              <DataItem>
                <TextField defaultValue={selectedBroker.contact?.name} label="Contact" fullWidth />
              </DataItem>
              <DataItem>
                <TextField
                  defaultValue={selectedBroker.commission}
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
