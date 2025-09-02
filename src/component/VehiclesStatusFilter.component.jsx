import { Button } from "@mui/material";
import { useMemo } from "react";
import { STATUS_FILTER } from "../constant/common.constant";

const VehiclesStatusFilter = ({ statistics, handleFilter }) => {
  const { delivered, en_route, idle, total } = statistics;
  const filterOptions = useMemo(
    () => [
      {
        key: STATUS_FILTER.All,
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

      {filterOptions.map(({ key, title, count }) => {
        return (
          <Button
            key={key}
            onClick={() => handleFilter(key)}
          >{`${title} ${count}`}</Button>
        );
      })}
    </div>
  );
};

export default VehiclesStatusFilter;
