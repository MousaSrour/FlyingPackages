import React, {useState, setState} from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import {Link} from "react-router-dom";
import {makeStyles, TextField} from "@material-ui/core";
import {ArrowBack, ArrowForward} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: 'white',
        width: 350,
        padding: 30,
        paddingTop: 30,
        marginTop: 50,
        margin: 'auto'
    },

    text_field: {
        width: '100%',
        marginBottom: 10,
    },

}));
/**
 * this function is to add a new courier 
 * by the manager, the manager full the data of the courier 
 * and submit it as new coureir and saving it in the database
 * @returns 
 */
function AddNewCourier() {
    const classes = useStyles();
    const [idNum, setIdNum] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [phone, setPhone] = useState(null);
    const [birth, setBirth] = useState(null);
    const handleInputChange = (e) => {
        const {id, value} = e.target;
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
        if (id === "birth") {
            setBirth(value);
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
            !phone ||
            !birth
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
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                id: idNum,
                email: email,
                userName: firstName,
                password: password,
                phone: phone,
                isAdmin: "false",
                role: "C",
            }),
        })
            .then((response) => response.json())
            .then(async (json) => {
                let userObj = json
                // Make the callback function async
                const response = await fetch("http://localhost:3000/api/v1/Couriers", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        birthDate: birth,
                        hoursPerMonth: 0,
                        deliveriesPerMonth: 0,
                        user: userObj,
                        location: null
                    }),
                });

                if (response.ok) {
                    alert("Courier registration done");
                } else {
                    alert("Registration of the courier failed");
                }
            })
            .catch(function (error) {
                alert("Registration failed");
            });
    };

    return (
        <div className={classes.root}>
            <h1>Add new courier</h1>
            <div className="">
                <TextField className={classes.text_field} id="idNum" label="ID number" variant="outlined" value={idNum}
                           onChange={(e) => handleInputChange(e)} size="small"/>
                <TextField className={classes.text_field} id="firstName" label={'First Name'} variant="outlined"
                           value={firstName} onChange={(e) => handleInputChange(e)} size="small"/>
                <TextField className={classes.text_field} id="lastName" label={'Last Name'} variant="outlined"
                           value={lastName} onChange={(e) => handleInputChange(e)} size="small"/>
                <TextField className={classes.text_field} id="email" label={'Email'} variant="outlined"
                           value={email} onChange={(e) => handleInputChange(e)} size="small" type={"email"}/>
                <TextField className={classes.text_field} label="birth" variant="outlined" value={birth}
                           onChange={(e) => handleInputChange(e)} id="birth" size="small"/>
                <TextField className={classes.text_field} id="password" label={'Password'} variant="outlined"
                           value={password} onChange={(e) => handleInputChange(e)} size="small" type={"password"}/>
                <TextField className={classes.text_field} id="confirmPassword" label={'Re-type your password'}
                           variant="outlined" value={confirmPassword} onChange={(e) => handleInputChange(e)}
                           size="small" type={"password"}/>
                <TextField className={classes.text_field} id="phone" label={'Phone'} variant="outlined"
                           value={phone} onChange={(e) => handleInputChange(e)} size="small"/>



            </div>
            <div className="footer" style={{marginBottom: 30}}>
                <Button component={Link} to="/ManagerForm/manageCouriers" color="default"
                        style={{background: 'rgb(233, 233, 237)', float: 'left'}}>
                    <ArrowBack/>Back
                </Button>
                <Button onClick={() => handleSubmit()} color="success" variant="contained"
                        style={{background: 'rgb(68, 182, 174)', float: 'right', color: '#FFFFFF'}}>
                    Submit<ArrowForward/></Button>
            </div>

        </div>

    );
}

export default AddNewCourier;
