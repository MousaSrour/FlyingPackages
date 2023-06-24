import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrdersTable.css"; // Import CSS file for styling
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { ArrowBack, Save } from "@material-ui/icons";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { TextField } from "@material-ui/core";
/**
 * this page is accessed to the supplier after clicking in the supplier form
 * edit orders button, here we show to the supplier the pending orders
 * so he can edit the desired hour and date to update the courier
 * @returns
 */
function EditOrder() {
  let supplierObj;
  const [orders, setOrders] = useState([]);
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
        return axios.get(
          "http://localhost:3000/api/v1/flyOrders/get/" + response.data[0]._id
        ); //get the orders
      })
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleHourChange = (event, orderId) => {
    const newOrders = orders.map((order) => {
      if (order.id === orderId && order.status === "pending") {
        return {
          ...order,
          submitHour: event.target.value,
        };
      }
      return order;
    });
    setOrders(newOrders);
  };

  const handleDateChange = (event, orderId) => {
    const newOrders = orders.map((order) => {
      if (order.id === orderId && order.status === "pending") {
        return {
          ...order,
          submitDate: event.target.value,
        };
      }
      return order;
    });
    setOrders(newOrders);
  };

  const handleEdit = (orderId) => {
    const orderToUpdate = orders.find((order) => order.id === orderId);
    axios
      .put(
        `http://localhost:3000/api/v1/flyOrders/update/${orderId}`,
        orderToUpdate
      )
      .then((response) => {
        console.log(response);
        alert("The changes saved successfully");
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };
  const handleCancel = (orderId) => {
    const orderToUpdate = orders.find((order) => order.id === orderId);
    axios
      .delete(
        `http://localhost:3000/api/v1/flyOrders/delete/${orderId}`
      )
      .then((response) => {
        console.log(response);
        alert("The order canceled");
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };
  // Filter the orders to display only those with the 'pending' status
  const pendingOrders = orders.filter((order) => order.status === "PENDING");

  return (
    <div className="supplier-form">
      <h1 style={{ textAlign: "center" }}>
        Welcome, Supplier {userObj.userName} !{" "}
      </h1>
      <h2 style={{ textAlign: "center" }}>Last Orders</h2>
      <div className="buttons-section">
        <Button
          component={Link}
          to="/supplierForm"
          style={{ backgroundColor: "rgb(69, 182, 175)" }}
          variant="contained"
        >
          <ArrowBack />
          Back
        </Button>
      </div>
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order Num</th>
              <th>Hour</th>
              <th>Date</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Cancel</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders
            .slice()
            .reverse()
            .map((order) => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>
                  <TextField
                    value={order.submitHour}
                    onChange={(event) => handleHourChange(event, order.id)}
                    size="small"
                    label="Time"
                    variant="outlined"
                  />
                </td>
                <td>
                  <TextField
                    value={order.submitDate}
                    onChange={(event) => handleDateChange(event, order.id)}
                    size="small"
                    label="Date"
                    variant="outlined"
                  />
                </td>
                <td>{order.status}</td>
                <td>
                  <Button onClick={() => handleEdit(order.id)}>
                    <Save />
                    Save
                  </Button>
                </td>
                <td>
                  <Button onClick={() => handleCancel(order.id)}>
                    <Save />
                    Cancel
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EditOrder;
