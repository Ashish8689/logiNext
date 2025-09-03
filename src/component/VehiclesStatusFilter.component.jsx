import { Button, Grid } from "@mui/material";
import { useMemo } from "react";
import { STATUS_FILTER } from "../constant/common.constant";

const VehiclesStatusFilter = ({ activeFilter,statistics, handleFilter }) => {
  const { delivered, en_route, idle, total } = statistics;
  const filterOptions = useMemo(
    () => [
      {
        key: STATUS_FILTER.ALL,
        title: "All",
        count: total,
      },
      {
        key: STATUS_FILTER.IDLE,
        title: "Idle",
        count: idle,
      },
      {
        key: STATUS_FILTER.EN_ROUTE,
        title: "En Route",
        count: en_route,
      },
      {
        key: STATUS_FILTER.DELIVERED,
        title: "Delivered",
        count: delivered,
      },
    ],
    [delivered, en_route, idle, total]
  );

  return (
    <div className="filter-container">
      <h3>Filter by Status</h3>

      <Grid container spacing={2} className="filter-button-container">
        {filterOptions.map(({ key, title, count }) => {
          return (
            <Grid size={6} key={key}>
              <Button
                className={`filter-button ${activeFilter === key ? 'active-filer' : ''}`}
                variant="outlined"
                onClick={() => handleFilter(key)}
              >{`${title} (${count})`}</Button>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default VehiclesStatusFilter;
