import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { blue } from "@material-ui/core/colors";
import axios from "axios";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import Select from "@mui/material/Select/Select";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import FormControl from "@mui/material/FormControl";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "60%",
    margin: "auto",
    marginTop: 50,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  avatar: {
    backgroundColor: blue[500],
    margin: "0 auto",
    marginBottom: theme.spacing(2),
  },
}));

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
/**
 * this page is accessed by the managers and they can
 * pick a company that in the system and select a month
 * and see how much orders made by the specefic company
 * and see the total payments
 * @returns
 */
export default function PaymentReports() {
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const classes = useStyles();
  const [list, setList] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    // Fetch suppliers from the API
    axios
      .get("http://localhost:3000/api/v1/Suppliers/getAllSuppliers")
      .then((response) => {
        setSuppliers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (selectedSupplier) {
      axios
        .get("http://localhost:3000/api/v1/Suppliers/get/" + selectedSupplier)
        .then((response) => {
          return axios.get(
            "http://localhost:3000/api/v1/bills/get/" +
              selectedSupplier +
              "/" +
              selectedMonth
          );
        })
        .then((response) => {
          setList(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedSupplier, selectedMonth]);

  const deleteSupplier = async (supplierId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/Suppliers/deleteSupplier/${supplierId}`
      );
      alert("The supplier deleted succesfully")
      console.log("Supplier deleted:", response.data);
    } catch (error) {
      // Handle the error here
      console.log(error);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} style={{ textAlign: "center" }}>
          <FormControl
            sx={{ width: "100%", backgroundColor: "rgb(66, 139, 202)" }}
          >
            <InputLabel id="supplier-select-label">Supplier</InputLabel>
            <Select
              labelId="supplier-select-label"
              value={selectedSupplier}
              label="Supplier"
              onChange={(e) => setSelectedSupplier(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {suppliers.map((supplier) => (
                <MenuItem key={supplier._id} value={supplier._id}>
                  {supplier.companyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={12} style={{ textAlign: "center" }}>
          <FormControl
            sx={{ width: "100%", backgroundColor: "rgb(66, 139, 202)" }}
          >
            <InputLabel id="month-select-label">Month</InputLabel>
            <Select
              labelId="month-select-label"
              value={selectedMonth}
              label="Month"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {selectedSupplier && (
          <>
            <Grid item xs={12} md={12} style={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  const confirmed = window.confirm(
                    "Are you sure you want to delete this supplier?"
                  );
                  if (confirmed) {
                    deleteSupplier(selectedSupplier);
                  }
                }}
              >
                Delete Supplier
              </Button>
            </Grid>
            <Grid item xs={12} md={12}>
              <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>O</Avatar>
                <Typography variant="h6">Orders Done</Typography>
                {list.length > 0 && (
                  <Typography variant="h4">{list[0].ordersPerMonth}</Typography>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={12}>
              <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>P</Avatar>
                <Typography variant="h6">Price Per Order</Typography>
                <Typography variant="h4">40 ILS</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={12}>
              <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>T</Avatar>
                <Typography variant="h6">Total Price</Typography>
                {list.length > 0 && (
                  <Typography variant="h4">
                    {list[0].ordersPerMonth * 40 + " ILS"}
                  </Typography>
                )}
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
}
