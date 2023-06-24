import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrdersTable.css"; // Import CSS file for styling
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { Add, Edit, MonetizationOn, Room } from "@material-ui/icons"; // Import CSS file for styling

function SupplierForm() {
  let supplierObj;
  const [orders, setOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState(5); // Number of orders to display
  const [hasLocation, setHasLocation] = useState(false); // Flag to check if the supplier has a location
  let userObj;
  let user = localStorage.getItem("supplierUser");
  if (user !== null) {
    userObj = JSON.parse(user); // to get the JSON syntax
  }

  useEffect(() => {
    // here we chain multiple requests
    axios
      .get("http://localhost:3000/api/v1/Suppliers/get/" + userObj._id) //get the supplier
      .then((response) => {
        localStorage.setItem("supplier", JSON.stringify(response.data[0]));
        return axios.get(
          "http://localhost:3000/api/v1/flyOrders/get/" + response.data[0]._id
        ); //get the orders
      })
      .then((response) => {
        setOrders(response.data.reverse()); // Reverse the order of orders array
      })
      .catch((error) => {
        console.log(error);
      });
    let su = localStorage.getItem("supplier");
    if (su !== null) {
      supplierObj = JSON.parse(su); // to get the JSON syntax
    }
    if (supplierObj && supplierObj.location) {
      setHasLocation(true);
    } else {
      setHasLocation(false);
    }
  }, []);

  const handleShowMore = () => {
    setDisplayedOrders(orders.length); // Display all orders
  };

  const handleUpdateLocation = () => {
    const key = process.env.REACT_APP_API_KEY;
    let supplier = localStorage.getItem("supplier");
    let thisSupplier = JSON.parse(supplier);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          // document.getElementById("latitude").textContent =
          //   "Latitude: " + latitude;
          // document.getElementById("longitude").textContent =
          //   "Longitude: " + longitude;

          // Geocoding API call to get the name based on the coordinates
          axios
            .get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${key}&language=en`
            )
            .then((response) => {
              const results = response.data.results;
              if (results.length > 0) {
                const name = results[0].formatted_address;
                console.log("Name:", name);
                // Use the retrieved name as needed (e.g., send it in the POST request)
                axios
                  .post(
                    "http://localhost:3000/api/v1/Locations",
                    {
                      latitude: latitude,
                      longitude: longitude,
                      name: name,
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  )
                  .then((response) => {
                    setTimeout(() => {
                      let Location = response.data;
                      console.log(thisSupplier._id + " " + Location._id);
                      axios
                        .put(
                          "http://localhost:3000/api/v1/Suppliers/updateLocation/" +
                            thisSupplier._id +
                            "/" +
                            Location.id
                        )
                        .then((response) => {
                          console.log(response.data);
                          alert("The location has been updated");
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }, 1000);
                  });
              } else {
                console.log("No results found");
              }
            })
            .catch((error) => {
              console.log("Error geocoding:", error);
            });
        },
        function (error) {
          console.log("Error getting location:", error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported");
    }
  };

  return (
    <div className="supplier-form">
      <div style={{ textAlign: "right", width: "100%" }}>
        <Button component={Link} to="/" color="primary" variant="contained">
          Logout
        </Button>
      </div>
      <div>
        <h1 style={{ textAlign: "center" }}>
          Welcome, Supplier {userObj.userName}!
        </h1>
        <h2 style={{ textAlign: "center" }}>Last Orders</h2>
        <div className="buttons-section">
          <Button
            component={Link}
            to="/supplierForm/newOrder"
            style={{ backgroundColor: "rgb(66, 139, 202)" }}
            variant="contained"
          >
            <Add />
            New Order
          </Button>
          <Button
            component={Link}
            to="/supplierForm/editOrder"
            variant="contained"
            style={{ backgroundColor: "rgb(69, 182, 175)" }}
          >
            <Edit />
            Edit Order
          </Button>
          <Button
            component={Link}
            to="/supplierForm/payments"
            style={{ backgroundColor: "rgb(137, 196, 244)" }}
            variant="contained"
          >
            <MonetizationOn />
            Monthly Bill Payments
          </Button>
        </div>
        {orders.length > 0 ? (
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order Num</th>
                  <th>Courier</th>
                  <th>Destination</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, displayedOrders).map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.courier.user.userName}</td>
                    <td>
                      {order.destination ? order.destination.name : "not found"}
                    </td>
                    <td>{order.status}</td>{" "}
                  </tr>
                ))}
              </tbody>
            </table>
            {displayedOrders < orders.length && (
              <Button onClick={handleShowMore}>Show More</Button>
            )}
          </div>
        ) : (
          <p>No orders available.</p>
        )}
        {!hasLocation && (
          <Button
            onClick={handleUpdateLocation}
            style={{ marginTop: "20px" }}
            variant="contained"
            color="primary"
            startIcon={<Room />}
          >
            Update Location
          </Button>
        )}
      </div>
    </div>
  );
}

export default SupplierForm;
