import React, {useState, setState} from 'react';
import './components/style.css'
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import {makeStyles, TextField} from "@material-ui/core";


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
 * in this page we can fill the info of the courier and save him to the database
 * 
 * @returns 
 */
function CourierRegister() {

    const [birthDate, setbirthDate] = useState(null);
    const classes = useStyles();

    const [creditCard, setCreditCard] = useState(null);
    const [expirationDate, setExpirationDate] = useState(null);
    const [cvv, setCvv] = useState(null);

    const handleInputChange = (e) => {
        const {id, value} = e.target;
        if (id === "birthDate") {
            setbirthDate(value);
        }

        if (id === "creditCard") {
            setCreditCard(value);
        }
        if (id === "expirationDate") {
            setExpirationDate(value);
        }
        if (id === "cvv") {
            setCvv(value);
        }

    }


    const handleSubmit = async () => {
        let dataJson = {};
        let userObj;
        let user = localStorage.getItem("user");
        if (user !== null) {
            userObj = JSON.parse(user); // to get the json syntax
        }
        console.log("fetching")
        const response = await fetch('http://localhost:3000/api/v1/Couriers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "birthDate": birthDate,
                "hoursPerMonth": 0,
                "deliveriesPerMonth": 0,
                "user": userObj,
            }),
        }).then(response => response.json())
            .then(json => {
                alert('courier registration done')
            })
            .catch(function (error) {
                alert('registration failed')
            })
    };

    const handleSubmit2 = async () => {
        let dataJson = {};
        console.log("fetching")
        const response = await fetch('http://localhost:3000/api/v1/creditCards', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "creditCardNumber": creditCard,
                "creditCardExpDate": expirationDate,
                "creditCardCVV": cvv,
            }),
        }).then(response => response.json())
            .then(json => {
                alert('credit card saved ')
            })
            .catch(function (error) {
                alert('registration failed')
            })
    };

    return (
        <div className={classes.root}>
            <h1>Continue Registiration</h1>
            <div className="">
                <p>Fisrt fill the fields then hit the register button, after that hit supplier or courier</p>
                <TextField className={classes.text_field} label="birthDate" variant="outlined" value={birthDate}
                           onChange={(e) => handleInputChange(e)} id="birthDate" size="small"/>
                <TextField className={classes.text_field} label="Credit Card" variant="outlined" value={creditCard}
                           onChange={(e) => handleInputChange(e)} id="creditCard" size="small"/>
                <TextField className={classes.text_field} label="Expiration Date" variant="outlined"
                           value={expirationDate}
                           onChange={(e) => handleInputChange(e)} id="expirationDate" size="small"/>
                <TextField className={classes.text_field} label="cvv" variant="outlined" value={cvv}
                           onChange={(e) => handleInputChange(e)} id="cvv" size="small"/>
            </div>
            <div className="footer" style={{marginBottom: 50}}>
                <Button onClick={() => handleSubmit()} type="submit" className="btn"
                        style={{background: 'rgb(68, 182, 174)', float: 'left'}}>Register1</Button>
                <Button onClick={() => handleSubmit2()} type="submit" className="btn"
                        style={{background: 'rgb(68, 182, 174)', float: 'right'}}>Register2</Button>
            </div>
        </div>
    )

}

export default CourierRegister