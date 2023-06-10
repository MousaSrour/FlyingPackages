import React, { useState, useEffect } from "react";
import "./components/style.css";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import "./OrdersTable.css"; // Import CSS file for styling
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  noRequests: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100vh - 200px)",
    fontFamily: "Arial, sans-serif",
    fontSize: "24px",
    color: "#000103",
  },
});
/**
 * this page is accessed by the manager 
 * and he can see if there are any requests 
 * of the suppliers(companies) regestirations
 * @returns 
 */
function SupplierRegister() {
  const classes = useStyles();
  const [users, setUsers] = useState([]);

  // Fetch users with isNew=true from the API
  const fetchUsers = async () => {
    axios
      .get("http://localhost:3000/api/v1/flyUsers/get/newUsers") //get all the new users to show to the manager
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAccept = async (userId) => {
    try {
      // Update user's isNew field to false
      await fetch(
        `http://localhost:3000/api/v1/flyUsers/update/${userId._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isNew: false }),
        }
      );

      try {
        await fetch(`http://localhost:3000/api/v1/Suppliers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ordersNo: 0,
            user: userId._id,
            companyName: userId.company,
          }),
        });
      } catch (error) {
        console.log("Error accepting user:", error);
      }

      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.log("Error accepting user:", error);
    }

    alert("The supplier added");
    window.location.reload(); // Reload the page after showing the alert
  };

  const handleReject = async (userId) => {
    try {
      console.log(userId);
      // Delete the user from the flyUsers database
      await fetch(`http://localhost:3000/api/v1/flyUsers/delete/${userId}`, {
        method: "DELETE",
      });

      // Remove user from the state
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.log("Error rejecting user:", error);
    }

    alert("The user rejected");
    window.location.reload(); // Reload the page after showing the alert
  };

  return (
    <div>
      <h1>Supplier Registeration Requests</h1>
      {users.length === 0 ? (
        <p className={classes.noRequests}>No requests found</p>      ) : (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="orders-table">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.company}</TableCell>
                  <TableCell>
                    <Button color="primary" onClick={() => handleAccept(user)}>
                      Accept
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => handleReject(user._id)}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default SupplierRegister;
