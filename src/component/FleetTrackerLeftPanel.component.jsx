import { useEffect, useState } from "react";
import FleetStatistics from "./FleetStatistics.component";
import VehiclesStatusFilter from "./VehiclesStatusFilter.component";
import { BASE_URL } from "../constant/common.constant";
import { CircularProgress } from "@mui/material";

const FleetTrackerLeftPanel = ({ activeFilter, handleFilter }) => {
  const [statistics, setStatistics] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`${BASE_URL}api/statistics`);
      const resData = await res.json();
      setStatistics(resData.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (isLoading) {
    return (
      <div className="loader">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <div className="live-update-active-button">
        <p>Live Updates Active</p>
      </div>
      <VehiclesStatusFilter
        activeFilter={activeFilter}
        handleFilter={handleFilter}
        statistics={statistics}
      />
      <FleetStatistics statistics={statistics} />

      <div className="last-update-status-container">
        <p>Updated 3s ago. Next updated in ~3 minutes</p>
      </div>
    </div>
  );
};

export default FleetTrackerLeftPanel;
