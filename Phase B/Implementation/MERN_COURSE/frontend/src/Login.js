import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Home} from "@material-ui/icons";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: 'white',
        width: 350,
        padding: 30,
        paddingTop: 30,
        marginTop: 30,
        borderRadius: 5,
    },

    login_input: {
        width: '100%',
        marginBottom: 40,
    },

    login_btn: {
        backgroundColor: 'rgb(68, 182, 174)',
        float: 'left',
    },
    register_btn: {
        backgroundColor: 'rgb(68, 182, 174)',
        float: 'right',
    },
    go_to_div: {
        paddingTop: 50,
    },
    go_to_link: {
        float: 'right'
    },
}));

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const classes = useStyles();
    const history = useHistory();

    const handleLogin = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/api/v1/flyUsers/login",
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({email, password}),
                }
            );

            if (response.ok) {
                const {token, user} = await response.json();
                console.log(token, user);
                localStorage.setItem("token", JSON.stringify(token));

                // Redirect the user based on their role
                if (user.role === "S") {
                    if(!user.isNew){
                        localStorage.setItem("supplierUser", JSON.stringify(user));
                        history.push("/supplierForm");
                    }else{
                        alert("Wait for the approve from the manager!");
                    }
                } else if (user.role === "C") {
                    localStorage.setItem("courierUser", JSON.stringify(user));
                    history.push("/courierForm");
                } else if (user.role === "M") {
                    localStorage.setItem("managerUser", JSON.stringify(user));
                    history.push("/managerForm");
                }
            } else {
                alert("Login failed!");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed!");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "50vh",
                width: "100%",
                height: "100vh",
                backgroundImage: "url(./image/login_img.png)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "bottom",
                backgroundSize: "contain",
            }}
        >
            <form className={classes.root} noValidate autoComplete="off">
                <h1>Login to your account</h1>
                <div>
                    <TextField
                        id="email"
                        label="Email"
                        className={classes.login_input}
                        value={email}
                        variant="outlined" size={'small'}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <TextField
                        className={classes.login_input}
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        variant="outlined" size={'small'}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div>
                    <Button className={classes.login_btn}
                            color="primary" variant="contained" onClick={handleLogin}>
                        Login
                    </Button>
                    <Button className={classes.register_btn}
                            color="primary" component={Link} to="/registrationForm" variant="contained">
                        SignUp
                    </Button>
                </div>
                <div className={classes.go_to_div}>
                    <Link to={'/'} className={classes.go_to_link}>
                        <Home style={{'margin-bottom': -6}}/>
                        <span> Go to Home</span></Link>
                </div>
            </form>
        </div>
    );
}

export default Login;
