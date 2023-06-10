import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./tableManager.css";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { Create, MonetizationOn, PermIdentity } from "@material-ui/icons";
/**
 * this is the manager form he can see all the orderrs by the suppliers 
 * and which courier take the order and also see the status of the order
 * he have 3 buttons to go to another pages
 * @returns 
 */
function ManagerForm() {
  const [orders, setOrders] = useState([]);
  const [showMore, setShowMore] = useState(false);

  let userObj;
  let user = localStorage.getItem("managerUser");
  if (user !== null) {
    userObj = JSON.parse(user); // to get the JSON syntax
  }

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/flyOrders/get/allOrders")
      .then((response) => {
        setOrders(response.data.reverse()); // Reverse the order of orders
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleShowMore = () => {
    setShowMore(true);
  };

  const displayedOrders = showMore ? orders : orders.slice(0, 4);
  const remainingOrders = showMore ? [] : orders.slice(4);

  return (
<div className={styles['table-container']}>
      <div style={{ textAlign: "right" }}>
        <Button component={Link} to="/" color="primary" variant="contained">
          Logout
        </Button>
      </div>
      <h1 style={{ textAlign: "center" }}>
        Welcome, Manager {userObj.userName}!
      </h1>
      <h2 style={{ textAlign: "center" }}>Last Orders</h2>
      <div className="buttons-section">
        <Button
          component={Link}
          to="/ManagerForm/manageCouriers"
          color="primary"
          variant="contained"
          style={{ backgroundColor: "rgb(66, 139, 202)" }}
        >
          <PermIdentity />
          Manage Couriers
        </Button>
        <Button
          component={Link}
          to="/supplierRegister"
          color="primary"
          variant="contained"
          style={{ backgroundColor: "rgb(69, 182, 175)" }}
        >
          <Create />
          Registration Requests
        </Button>
        <Button
          component={Link}
          to="/ManagerForm/paymentsReports"
          color="primary"
          variant="contained"
          style={{ backgroundColor: "rgb(137, 196, 244)" }}
        >
          <MonetizationOn />
          Payments Reports
        </Button>
      </div>
      <div className={styles["table-wrapper"]}>
        <table className={styles["fl-table"]}>
          <thead>
            <tr>
              <th>Order Num</th>
              <th>Supplier</th>
              <th>Courier</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.supplier.user.userName}</td>
                <td>{order.courier.user.userName}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!showMore && orders.length > 4 && (
          <Button variant="contained" color="primary" onClick={handleShowMore}>
            Show More
          </Button>
        )}
        {showMore && remainingOrders.length > 0 && (
          <table>
            <tbody>
              {remainingOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.supplier.user.userName}</td>
                  <td>{order.courier.user.userName}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManagerForm;
