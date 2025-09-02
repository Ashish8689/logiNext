import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { BASE_URL, STATUS_FILTER, WEBSOCKET_URL } from "./constant/common.constant";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import VehiclesModal from "./component/VehiclesModal.component";
import FleetTrackerLeftPanel from "./component/FleetTrackerLeftPanel.component";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVehicleId, setActiveVehicleId] = useState(null);
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

  const handleActiveVehicleId = (id) => {
    setActiveVehicleId(id);
  };

  const handleCloseModal = () => {
    setActiveVehicleId(null);
  };

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

  if (isLoading) {
    return <h1>Loader....</h1>;
  }

  return (
    <div className="container">
      <div className="left-container">
        <FleetTrackerLeftPanel handleFilter={onFilterChange} />
      </div>
      <div className="right-container">
        <div>
          <h3>Vehicles {`(${vehicles.length})`}</h3>
          <Button>Live</Button>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vehicle</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Speed</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>ETA</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((vehicle, idx) => (
                <TableRow key={idx}>
                  <TableCell onClick={() => handleActiveVehicleId(vehicle.id)}>
                    {vehicle.vehicleNumber || "-"}
                  </TableCell>
                  <TableCell>{vehicle.driverName || "-"}</TableCell>
                  <TableCell>{vehicle.status || "-"}</TableCell>
                  <TableCell>{`${vehicle.speed ?? 0}mph`}</TableCell>
                  <TableCell>{vehicle.destination || "-"}</TableCell>
                  <TableCell>{vehicle.estimatedArrival || "-"}</TableCell>
                  <TableCell>{vehicle.lastUpdated || "-"}</TableCell>
                  <TableCell>{`${vehicle.currentLocation.lat}-${vehicle.currentLocation.lng}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {activeVehicleId && (
        <VehiclesModal id={activeVehicleId} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
