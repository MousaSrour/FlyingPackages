import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { blue } from "@material-ui/core/colors";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import Select from "@mui/material/Select/Select";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import FormControl from "@mui/material/FormControl/FormControl";

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
 * this page each suppleir can access and see in the
 * selected month the number of the orders that he made
 * and the total payment 
 * @returns 
 */
export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const classes = useStyles();
  let supplierObj;
  const [list, setList] = useState([]);
  let userObj;
  let user = localStorage.getItem("supplierUser");
  if (user !== null) {
    userObj = JSON.parse(user); // to get the json syntax
  }

  useEffect(() => {
    // here we chain multiple requests
    axios
      .get("http://localhost:3000/api/v1/Suppliers/get/" + userObj._id) //get the supplier
      .then((response) => {
        return axios.get(
          "http://localhost:3000/api/v1/bills/get/" +
            response.data[0]._id +
            "/" +
            selectedMonth
        ); //get the bill of the selected month
      })
      .then((response) => {
        setList(response.data);
        console.log(list);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedMonth]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} style={{ textAlign: "center" }}>
          <FormControl
            sx={{ width: "100%", backgroundColor: "rgb(66, 139, 202)" }}
          >
            <InputLabel id="demo-select-small-label">Month</InputLabel>
            <Select
              labelId="demo-select-small-label"
              value={selectedMonth}
              label="Month"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {months.map((month) => (
                <MenuItem value={month}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
      </Grid>
    </div>
  );
}
