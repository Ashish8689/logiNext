import {
  Box,
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  linearProgressClasses,
  Modal,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "../constant/common.constant";
import "../modal.css";
import { formatDateTime, formatLatLng } from "../utils/commom";
import styled from "@emotion/styled";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
};

const BorderLinearProgress = styled(LinearProgress)(() => ({
  marginTop: "10px",
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#dee1ec",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
  },
}));

const VehiclesModal = ({ id, onClose }) => {
  const [vehicle, setVehicle] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchVehicle = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}api/vehicles/${id}`);
      const resData = await res.json();
      setVehicle(resData.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVehicle();
  }, [fetchVehicle]);

  return (
    <Modal
      open
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {isLoading ? (
          <div className="loader">
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div className="modal-header-content">
                {" "}
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  <h1>{vehicle.vehicleNumber}</h1>
                  <div>
                    {" "}
                    <h6>
                      {vehicle.driverName} : <span>{vehicle.status}</span>
                    </h6>
                  </div>
                </Typography>
              </div>

              <div>
                <Button onClick={onClose}>X</Button>
              </div>
            </div>

            <Grid container spacing={2} className="modal-content">
              <Grid size={6} className="modal-item-container">
                <h3>Status</h3>
                <p
                  className={`status-badge-container modal-status ${vehicle.status}`}
                >
                  {vehicle.status}
                </p>
              </Grid>

              <Grid size={6} className="modal-item-container">
                <h3>Current Speed</h3>
                <h4>{`${vehicle.speed} mph`}</h4>
              </Grid>

              <Grid size={6} className="modal-item-container">
                <h3>Driver</h3>
                <h4>{vehicle.driverName}</h4>
              </Grid>

              <Grid size={6} className="modal-item-container">
                <h3>Phone</h3>
                <h4>{vehicle.driverPhone}</h4>
              </Grid>

              <Grid size={6} className="modal-item-container">
                <h3>Destination</h3>
                <h4>{vehicle.destination}</h4>
              </Grid>

              <Grid size={6} className="modal-item-container">
                <h3>Location</h3>
                <h4>{formatLatLng(vehicle.currentLocation.lat)}</h4>
                <h4>{formatLatLng(vehicle.currentLocation.lng)}</h4>
              </Grid>

              <Grid size={6} className="modal-item-container">
                <h3>Battery Level</h3>
                <h4>{`${vehicle.batteryLevel}%`}</h4>
                <BorderLinearProgress
                  variant="determinate"
                  value={vehicle.batteryLevel}
                />
              </Grid>

              <Grid size={6} className="modal-item-container">
                <h3>Fuel Level</h3>
                <h4>{`${vehicle.fuelLevel}%`}</h4>
                <BorderLinearProgress
                  variant="determinate"
                  value={vehicle.fuelLevel}
                />
              </Grid>

              <Grid size={6} className="modal-item-container">
                <h3>Last Updated</h3>
                <h4>{formatDateTime(vehicle.lastUpdated)}</h4>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default VehiclesModal;
