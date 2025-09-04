import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { formatDateTime, formatLatLng } from "../utils/commom";
import { TABLE_COLUMNS } from "../constant/common.constant";
import VehiclesModal from "./VehiclesModal.component";

const FleetTable = ({ data }) => {
  const [activeVehicleId, setActiveVehicleId] = useState(null);

  const handleActiveVehicleId = useCallback((id) => {
    setActiveVehicleId(id);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveVehicleId(null);
  }, []);
  return (
    <>
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
            {data.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell onClick={() => handleActiveVehicleId(vehicle.id)}>
                  <p className="vehicles-item-button">
                    {vehicle.vehicleNumber || "-"}
                  </p>
                </TableCell>
                <TableCell>{vehicle.driverName || "-"}</TableCell>
                <TableCell>
                  <p className={`status-badge-container ${vehicle.status}`}>
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
                <TableCell>{formatDateTime(vehicle.lastUpdated)}</TableCell>
                <TableCell>{`${formatLatLng(
                  vehicle.currentLocation.lat
                )},${formatLatLng(vehicle.currentLocation.lng)}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {activeVehicleId && (
        <VehiclesModal id={activeVehicleId} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default FleetTable;
