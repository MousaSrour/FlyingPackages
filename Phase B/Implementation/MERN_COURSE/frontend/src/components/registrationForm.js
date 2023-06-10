import React, { useState, setState } from "react";
import "./style.css";
import { Button, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { ArrowBack, ArrowForward, Home } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "white",
    width: 350,
    padding: 30,
    paddingTop: 30,
    marginTop: 50,
    margin: "auto",
  },

  text_field: {
    width: "100%",
    marginBottom: 10,
  },
}));
/**
 * the Registiration form, in this page
 * the user full the fields in the require 
 * data and submit it
 * @returns 
 */
function RegistrationForm() {
  const classes = useStyles();
  const [idNum, setIdNum] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [phone, setPhone] = useState(null);
  const [company, setCompany] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "idNum") {
      setIdNum(value);
    }
    if (id === "firstName") {
      setFirstName(value);
    }
    if (id === "lastName") {
      setLastName(value);
    }
    if (id === "email") {
      setEmail(value);
    }
    if (id === "password") {
      setPassword(value);
    }
    if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
    if (id === "phone") {
      setPhone(value);
    }
    if (id === "company") {
      setCompany(value);
    }
  };

  const handleSubmit = async () => {
    let dataJson = {};
    if (
      !idNum ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone
    ) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Invalid email address.");
      return;
    }
    console.log("fetching");
    const response = await fetch("http://localhost:3000/api/v1/flyUsers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: idNum,
        email: email,
        userName: firstName,
        password: password,
        phone: phone,
        isAdmin: "false",
        isNew: "true",
        role: "S",
        company : company,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        dataJson = json;
        const userRole = dataJson.role;
        localStorage.setItem("user", JSON.stringify(dataJson));
        alert("registration done press to continue");
      })
      .catch(function (error) {
        alert("registration failed");
      });
  };

  return (
    <div className={classes.root}>
      <h1>Sign Up</h1>
      <div className="">
        <p>First fill the fields then hit the register button.</p>
        <TextField
          className={classes.text_field}
          id="idNum"
          label="ID number"
          variant="outlined"
          value={idNum}
          onChange={(e) => handleInputChange(e)}
          size="small"
        />
        <TextField
          className={classes.text_field}
          id="firstName"
          label={"First Name"}
          variant="outlined"
          value={firstName}
          onChange={(e) => handleInputChange(e)}
          size="small"
        />
        <TextField
          className={classes.text_field}
          id="lastName"
          label={"Last Name"}
          variant="outlined"
          value={lastName}
          onChange={(e) => handleInputChange(e)}
          size="small"
        />
        <TextField
          className={classes.text_field}
          id="email"
          label={"Email"}
          variant="outlined"
          value={email}
          onChange={(e) => handleInputChange(e)}
          size="small"
          type={"email"}
        />
        <TextField
          className={classes.text_field}
          id="password"
          label={"Password"}
          variant="outlined"
          value={password}
          onChange={(e) => handleInputChange(e)}
          size="small"
          type={"password"}
        />
        <TextField
          className={classes.text_field}
          id="confirmPassword"
          label={"Re-type your password"}
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => handleInputChange(e)}
          size="small"
          type={"password"}
        />
        <TextField
          className={classes.text_field}
          id="phone"
          label={"Phone"}
          variant="outlined"
          value={phone}
          onChange={(e) => handleInputChange(e)}
          size="small"
        />
        <TextField
          className={classes.text_field}
          id="company"
          label={"Company name"}
          variant="outlined"
          value={company}
          onChange={(e) => handleInputChange(e)}
          size="small"
        />
      </div>
      <div className="footer">
        <Button
          component={Link}
          to="/login"
          color="default"
          style={{ background: "rgb(233, 233, 237)", float: "left" }}
        >
          <ArrowBack />
          LogIn
        </Button>
        <Button
          onClick={() => handleSubmit()}
          color="success"
          variant="contained"
          style={{
            background: "rgb(68, 182, 174)",
            float: "right",
            color: "#FFFFFF",
          }}
        >
          Register
          <ArrowForward />
        </Button>
      </div>
    </div>
  );
}

export default RegistrationForm;
