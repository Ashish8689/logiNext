import { useEffect, useState } from "react";
import FleetStatistics from "./FleetStatistics.component";
import VehiclesStatusFilter from "./VehiclesStatusFilter.component";
import { BASE_URL } from "../constant/common.constant";

const FleetTrackerLeftPanel = ({ handleFilter }) => {
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
    return <h1>Loader...</h1>;
  }

  return (
    <div>
      <VehiclesStatusFilter
        handleFilter={handleFilter}
        statistics={statistics}
      />
      <FleetStatistics statistics={statistics} />
    </div>
  );
};

export default FleetTrackerLeftPanel;
