import React, { useState, setState, useEffect } from "react";
import "./components/style.css";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import "./OrdersTable.css"; // Import CSS file for styling
//require('dotenv/config');
import "react-dotenv";
import { ArrowBack, Backup } from "@material-ui/icons";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { TextField } from "@material-ui/core";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { makeStyles } from "@material-ui/core/styles";
import { createTheme } from "@mui/material/styles";

const shadow_theme = createTheme({
  shadows: "none",
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const useStyles = makeStyles((theme) => ({
  new_order_input: {
    marginLeft: 30,
    marginRight: 30,
  },
}));
export default function NewOrder() {
  const classes = useStyles();
  const [courier, setCourier] = useState(null);
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState(null);
  const [destination, setDestination] = useState(null);
  const [submitHour, setSubmitHour] = useState(null);
  const [submitDate, setSubmitDate] = useState(null);
  let longitudeGo = 0;
  let latitudeGo = 0;
  const courierDistances = [];
  const [couriers, setCouriers] = useState([]);
  let supplierObj = localStorage.getItem("supplier");
  let thisSupplier = JSON.parse(supplierObj);
  console.log(thisSupplier);
  const supplierLocation = {
    latitude: thisSupplier.location.latitude,
    longitude: thisSupplier.location.longitude,
  };

  useEffect(() => {
    // here we chain multiple requests
    let dataJson = {};

    let supplierObj;
    let userObj;
    let user = localStorage.getItem("user");
    if (user !== null) {
      userObj = JSON.parse(user); // to get the json syntax
    }
    axios
      .get("http://localhost:3000/api/v1/Couriers/Available") //get the couriers
      .then((response) => {
        setCouriers(response.data); // update the state with the fetched data
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    console.log(courier);
    const key = process.env.REACT_APP_API_KEY;
    const address = destination;
    let finalLocation;
    //The destination that typed by the supplier converted to latitude and longitude using the google cloud API
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${key}`;
    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const location = data.results[0].geometry.location;
        latitudeGo = location.lat;
        longitudeGo = location.lng;
        axios
          .post(
            "http://localhost:3000/api/v1/Locations",
            {
              latitude: latitudeGo,
              longitude: longitudeGo,
              name: destination,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            finalLocation = response.data;
            console.log(finalLocation);
            let thisCourier = couriers.find((c) => c.user.userName === courier);
            // Create a new order object
            const newOrder = {
              supplier: thisSupplier._id,
              courier: thisCourier._id,
              customerPhoneNumber: customerPhoneNumber,
              destination: finalLocation.id,
              submitHour: submitHour,
              submitDate: submitDate,
              orderNumber: Math.floor(Math.random() * 100000) + 5,
              origin: thisSupplier.location._id,
              completedDate: "",
            };
            // Send a POST request to the server to add the new order to the database
            axios
              .post("http://localhost:3000/api/v1/flyOrders/", newOrder)
              .then((response) => {
                console.log(response.data);
                // axios.post("http://localhost:3000/api/v1/bills")
                alert("The order created, wait for approve from " + courier);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => console.log(error));

    console.log(latitudeGo);
    console.log(longitudeGo);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "courier") {
      setCourier(value);
    }
    if (id === "customerPhoneNumber") {
      setCustomerPhoneNumber(value);
    }
    if (id === "destination") {
      setDestination(value);
    }
    if (id === "submitHour") {
      setSubmitHour(value);
    }
    if (id === "submitDate") {
      setSubmitDate(value);
    }
  };

  // console.log(couriers[0].location.latitude)
  console.log(couriers[0]);
  // Loop through each courier and calculate the distance using the Haversine formula
  couriers.forEach((courier) => {
    const { latitude: lat1, longitude: lon1 } = supplierLocation;
    if (courier.location.latitude && courier.location.longitude) {
      const lat2 = courier.location.latitude;
      const lon2 = courier.location.longitude;
      const R = 6371e3; // Earth's radius in meters
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = (R * c) / 1000; // Distance in km
      if (distance <= 10) {
        courierDistances.push({
          courier,
          distance,
        });
      }
    }
  });
  console.log(couriers);

  // Sort the courierDistances array by distance in ascending order
  courierDistances.sort((a, b) => a.distance - b.distance);
  console.log(courierDistances);

  return (
    <div className="order-form">
      <h1 style={{ textAlign: "center" }}>New Order</h1>
      <p>*The order's cost is: 40 ILS</p>
      <div className="buttons-section">
        <Button
          component={Link}
          to="/supplierForm"
          variant="contained"
          style={{
            backgroundColor: "rgb(69, 182, 175)",
            marginRight: "10px",
          }}
        >
          <ArrowBack />
          Back
        </Button>

        <Button
          style={{
            backgroundColor: "rgb(66, 139, 202)",
            color: "white",
          }}
          variant="contained"
          onClick={handleSubmit}
        >
          <Backup />
          Submit
        </Button>
      </div>
      <div className="new-order-form">
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <TextField
            className={classes.new_order_input}
            id="destination"
            label="Destination"
            value={destination}
            variant="outlined"
            size={"small"}
            onChange={(e) => handleInputChange(e)}
          />
          <TextField
            className={classes.new_order_input}
            id="submitDate"
            label="Submit Date"
            value={submitDate}
            variant="outlined"
            size={"small"}
            onChange={(e) => handleInputChange(e)}
          />
          <TextField
            className={classes.new_order_input}
            id="submitHour"
            label="Submit Hour"
            value={submitHour}
            variant="outlined"
            size={"small"}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <TextField
            className={classes.new_order_input}
            id="customerPhoneNumber"
            label="Phone Number"
            value={customerPhoneNumber}
            variant="outlined"
            size={"small"}
            onChange={(e) => handleInputChange(e)}
          />
          <FormControl
            sx={{ minWidth: 200 }}
            className={classes.new_order_input}
            size="small"
          >
            <InputLabel id="demo-select-small-label">Courier</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="courier-dropdown"
              value={courier}
              label="Courier"
              onChange={(e) => setCourier(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {courierDistances.map((courierDistance) => (
                <MenuItem value={courierDistance.courier.user.userName}>
                  {courierDistance.courier.user.userName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="form-body">
        <div className="new-order-form">
          <div>
            <h2>Pick Courier</h2>
            {courierDistances.length > 0 ? (
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Distance</th>
                    <th>Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                  {courierDistances
                    .slice(0, 4) // Limit the array to the first four elements
                    .map((courierDistance) => (
                      <tr key={courierDistance.courier.user.userName}>
                        <td>{courierDistance.courier.user.userName}</td>
                        <td>{courierDistance.distance.toFixed(2) + " Km"}</td>
                        <td>{courierDistance.courier.user.phone}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p>No nearby couriers available at this time.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
