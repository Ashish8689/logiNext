import { Box, Button, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BASE_URL } from "../constant/common.constant";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const VehiclesModal = ({ id, onClose }) => {
  const [vehicle, setVehicle] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchVehicle = async () => {
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
  };

  useEffect(() => {
    fetchVehicle();
  }, []);

  return (
    <Modal
      open
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {isLoading ? (
          <h1>Loader.....</h1>
        ) : (
          <>
          <div className="modal-header">
            <div> <Typography id="modal-modal-title" variant="h6" component="h2">
              {vehicle.vehicleNumber}
              {vehicle.driverName}
            </Typography>
           </div>

            <div>
              <Button onClick={onClose}>X</Button>
            </div>
          </div>

          <div className="modal-content">
            <div>
               <h3>Status</h3>
                <h3>{vehicle.status}</h3>
            </div>

            <div>
               <h3>Current Speed</h3>
                <h3>{vehicle.speed}</h3>
            </div>

            <div>
               <h3>Driver</h3>
                <h3>{vehicle.driverName}</h3>
            </div>

            <div>
               <h3>Phone</h3>
                <h3>{vehicle.driverPhone}</h3>
            </div>

            <div>
               <h3>Destination</h3>
                <h3>{vehicle.destination}</h3>
            </div>

            <div>
               <h3>Location</h3>
                <h3>{vehicle.currentLocation.lat}</h3>
                <h3>{vehicle.currentLocation.lng}</h3>
            </div>

            <div>
               <h3>Battery Level</h3>
                <h3>{vehicle.batteryLevel}</h3>
            </div>

            <div>
               <h3>Fuel Level</h3>
                <h3>{vehicle.fuelLevel}</h3>
            </div>

             <div>
               <h3>Last Updated</h3>
                <h3>{vehicle.lastUpdated}</h3>
            </div>

          </div>
          </>
          
        )}
      </Box>
    </Modal>
  );
};

export default VehiclesModal;
