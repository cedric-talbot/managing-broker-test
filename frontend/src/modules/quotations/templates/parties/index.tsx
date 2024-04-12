import React, { ReactElement, useCallback, useEffect, useState } from "react";
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
import { Search } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import useInfiniteScroll from "react-infinite-scroll-hook";

import { Card } from "../../../../components/Card/Card";
import { AddBrokerDialog } from "./AddBrokerDialog";
import { useDebounce } from "../../../../hooks/useDebounce";

export interface Broker {
  name: string;
  address: string;
  city: string;
  country: string;
}

interface BrokersResponse {
  brokers: Broker[];
  hasNext: boolean;
}

// This value is set deliberately low to allow demonstrating the infinite scroll
const limit = 12;

export const Parties = (): ReactElement => {
  const [search, setSearch] = useState("");
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [autocompleteFocus, setAutocompleteFocus] = useState(false);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  // We want to reset the page whenever we change our search
  const debouncedSearch = useDebounce(search, 400, () => {
    setPage(1);
  });

  const { t } = useTranslation("partiesPage");

  const getBrokers = useCallback(async () => {
    const res = await axios.get(
      process.env.REACT_APP_BROKER_API_HOST +
        "/brokers" +
        (search !== "" ? `?search=${search}&page=${page}&limit=${limit}` : "")
    );
    return { brokers: res.data.data.brokers, hasNext: res.data.next !== undefined };
  }, [search, page]);

  const { data, isError, isLoading } = useQuery<BrokersResponse>({
    queryKey: ["brokers", debouncedSearch, page],
    queryFn: getBrokers,
    enabled: !!debouncedSearch,
  });

  useEffect(() => {
    if (data === undefined) return;
    if (page === 1) {
      setBrokers(data.brokers);
    } else {
      setBrokers((currentBrokers) => currentBrokers.concat(data.brokers));
    }
  }, [data?.brokers]);

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

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: !!data?.hasNext,
    onLoadMore: () => setPage((prev) => prev + 1),
    disabled: !!isError,
  });

  return (
    <Container>
      <Card title={t("MANAGING_BROKER_CARD_TITLE")} subTitle={t("MANAGING_BROKER_CARD_SUBTITLE")}>
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
            popupIcon={selectedBroker === null ? <Search /> : null}
            sx={{
              "& .MuiAutocomplete-popupIndicator": { transform: "none" },
            }}
            disablePortal
            id="parties-broker-selector"
            options={brokers}
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
                label={t("MANAGING_BROKER_AUTOCOMPLETE_LABEL")}
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
                <li {...props} ref={typeof option === "string" ? sentryRef : undefined}>
                  <Box sx={{ width: "100%" }}>
                    {typeof option === "string" ? (
                      <>
                        {t("MANAGING_BROKER_AUTOCOMPLETE_ADD_TEXT") + " "}
                        <u>{t("MANAGING_BROKER_AUTOCOMPLETE_ADD_TEXT_UNDERLINED")}</u>
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
              {t("MANAGING_BROKER_RETRIEVING_ERROR_MESSAGE")}
            </Alert>
          )}
          {selectedBroker !== null && (
            <>
              <DataItem id="managing-broker-address">
                <Typography variant="caption" fontFamily="Montserrat" color="secondary">
                  {t("MANAGING_BROKER_ADDRESS")}
                </Typography>
                <Typography variant="body2" fontFamily="Montserrat">
                  {selectedBroker.address + " - " + selectedBroker.city}
                </Typography>
              </DataItem>
              <DataItem id="managing-broker-country">
                <Typography variant="caption" fontFamily="Montserrat" color="secondary">
                  {t("MANAGING_BROKER_COUNTRY")}
                </Typography>
                <Typography variant="body2" fontFamily="Montserrat">
                  {selectedBroker.country}
                </Typography>
              </DataItem>
              <DataItem id="managing-broker-contact">
                <TextField label={t("MANAGING_BROKER_CONTACT")} fullWidth />
              </DataItem>
              <DataItem id="managing-broker-commission">
                <TextField
                  label={t("MANAGING_BROKER_COMMISSION")}
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
