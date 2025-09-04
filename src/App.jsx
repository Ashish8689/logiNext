import { useCallback, useEffect, useState } from "react";
import "./App.css";
import {
  BASE_URL,
  STATUS_FILTER,
  WEBSOCKET_URL,
} from "./constant/common.constant";
import { Button, CircularProgress } from "@mui/material";
import FleetTrackerLeftPanel from "./component/FleetTrackerLeftPanel.component";
import FleetTable from "./component/FleetTable.component";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(STATUS_FILTER.ALL);

  const fetchVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      let url = `${BASE_URL}api/vehicles`;
      if (activeFilter && activeFilter !== "all") {
        url += `?status=${activeFilter}`;
      }
      const res = await fetch(url);
      const resData = await res.json();
      setVehicles(resData.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter]);

  const onFilterChange = useCallback((key) => {
    setActiveFilter(key);
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // WebSocket integration
  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setVehicles(data.data);
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="container">
      <div className="left-container">
        <FleetTrackerLeftPanel
          activeFilter={activeFilter}
          handleFilter={onFilterChange}
        />
      </div>
      <div className="right-container">
        {isLoading ? (
          <div className="loader">
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className="right-header">
              <h3>Vehicles {`(${vehicles.length})`}</h3>
              <Button>Live</Button>
            </div>
            <FleetTable data={vehicles} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
