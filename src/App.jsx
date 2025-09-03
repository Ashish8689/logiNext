import { useCallback, useEffect, useState } from "react";
import "./App.css";
import {
  BASE_URL,
  STATUS_FILTER,
  TABLE_COLUMNS,
  WEBSOCKET_URL,
} from "./constant/common.constant";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import VehiclesModal from "./component/VehiclesModal.component";
import FleetTrackerLeftPanel from "./component/FleetTrackerLeftPanel.component";
import { formatDateTime, formatLatLng } from "./utils/commom";

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
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {TABLE_COLUMNS.map((item) => (
                      <TableCell key={item}>{item}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicles.map((vehicle, idx) => (
                    <TableRow key={idx}>
                      <TableCell
                        onClick={() => handleActiveVehicleId(vehicle.id)}
                      >
                        <p className="vehicles-item-button">
                          {vehicle.vehicleNumber || "-"}
                        </p>
                      </TableCell>
                      <TableCell>{vehicle.driverName || "-"}</TableCell>
                      <TableCell>
                        <p
                          className={`status-badge-container ${vehicle.status}`}
                        >
                          {vehicle.status || "-"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="speed-badge-container">
                          {`${vehicle.speed ?? 0}mph`}
                        </p>
                      </TableCell>
                      <TableCell>{vehicle.destination || "-"}</TableCell>
                      <TableCell>{vehicle.estimatedArrival || "-"}</TableCell>
                      <TableCell>
                        {formatDateTime(vehicle.lastUpdated)}
                      </TableCell>
                      <TableCell>{`${formatLatLng(
                        vehicle.currentLocation.lat
                      )},${formatLatLng(
                        vehicle.currentLocation.lng
                      )}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </div>

      {activeVehicleId && (
        <VehiclesModal id={activeVehicleId} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
