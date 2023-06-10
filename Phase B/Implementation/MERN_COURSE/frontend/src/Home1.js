import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Email, Phone } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import "./components/style.css";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  MenuItem,
  Menu,
  ListItemIcon,
  IconButton,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    margin: 0,
    color: "#222222",
    fontStyle: "italic",
    // paddingBottom: theme.spacing(4),
    // backgroundColor: theme.palette.background.default,
    fontFamily: "'Roboto', sans-serif",
  },
  menuButton: {
    zIndex: 9999,
    marginRight: theme.spacing(0.5),
    color: "red",
  },
  listItem: {
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
      "& .MuiListItemIcon-root": {
        color: theme.palette.primary.main,
      },
    },
  },
  card: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    margin: "auto",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9 aspect ratio
  },
  cardContent: {
    flexGrow: 1,
  },
  button: {
    marginTop: theme.spacing(4),
  },
  courierGrid: {
    position: "relative",
    textAlign: "center",
  },
  icon: {
    color: "rgb(10,248,255)",
  },
  signBtn: {
    backgroundColor: "#FFFFFF",
    boxShadow: "none",
    color: "#111111",
    marginTop: "8px",
    hover: "#0000FF",
    float: "right",
    fontSize: "15px",
    fontFamily: "'Roboto', sans-serif",
    marginLeft: theme.spacing(2),
  },
  welcomeTitle: {
    fontWeight: "bold",
    fontFamily: "'Roboto', sans-serif",
    marginBottom: theme.spacing(2),
    fontSize: "2rem",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Add text shadow
  },
  subtitle: {
    fontFamily: "'Roboto', sans-serif",
    marginBottom: theme.spacing(2),
    fontSize: "1.2rem",
  },
  aboutTitle: {
    fontWeight: "bold",
    fontFamily: "'Roboto', sans-serif",
    marginBottom: theme.spacing(2),
  },
  aboutText: {
    fontFamily: "'Roboto', sans-serif",
    marginBottom: theme.spacing(2),
  },
  contactTitle: {
    fontWeight: "bold",
    fontFamily: "'Roboto', sans-serif",
    marginBottom: theme.spacing(2),
  },
  contactText: {
    fontFamily: "'Roboto', sans-serif",
    marginBottom: theme.spacing(2),
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "50px",
    backgroundColor: "#FFAE42",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    //padding: theme.spacing(2),
  },
  logo: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: "1.2rem",
    textDecoration: "none",
  },
}));
/**
 * the Home Page with the log in button sign up button
 * also about us
 * and the contact information
 * @returns
 */
function Home() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const open = Boolean(anchorEl);

  return (
    <div className={classes.root}>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%" }}>
        <div className={classes.container}>
          <Container maxWidth="lg">
            <Grid container alignItems="center">
              <Grid item xs={4}>
                <Link to="/" className={classes.logo}>
                  FLY PACKAGES
                </Link>
              </Grid>
              <Grid item xs={4} container justify="center">
                <span></span>
              </Grid>
              <Grid item xs={4} className={classes.buttonContainer}>
                <Button
                  className={classes.signBtn}
                  component={Link}
                  to="/registrationForm"
                  color="primary"
                  variant="contained"
                >
                  Sign Up
                </Button>
                <Button
                  className={classes.signBtn}
                  component={Link}
                  to="/login"
                  color="primary"
                  variant="contained"
                >
                  Log In
                </Button>
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>

      <Container maxWidth="lg" style={{ paddingTop: "50px" }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography
              variant="h3"
              align="center"
              className={classes.welcomeTitle}
            >
              Welcome to the Fly Packages Site
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              paragraph
              className={classes.subtitle}
            >
              Here you can find the nearest available courier to take your
              orders to your customers.
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <CardActionArea
                component={Link}
                to="/registrationForm"
                className={classes.cardContent}
              >
                <CardMedia
                  className={classes.cardMedia}
                  image="/supplier-relationships.jpg"
                  title="Supplier Image"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Supplier? Join Us
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Enhance your delivery process with our asset-assisted
                    management solutions, Join Now!
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <CardActionArea className={classes.cardContent}>
                <CardMedia
                  className={classes.cardMedia}
                  image="/pre-delivery-inspections.jpeg"
                  title="Courier Image"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Courier? Join Us
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    If you are a good courier PLEASE CALL US TO JOIN
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <section ref={aboutRef} style={{ marginTop: 30 }}>
        <div id="aboutUsSection" className={classes.root}>
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              className={classes.aboutTitle}
            >
              About Us
            </Typography>
            <Typography
              variant="h6"
              align="justify"
              gutterBottom
              className={classes.aboutText}
            >
              Fly Package is an innovative and reliable shipping service that
              aims to provide efficient and cost-effective solutions for your
              delivery needs. Our platform connects you with a vast network of
              couriers and suppliers to ensure that your packages reach their
              destination on time and in perfect condition. Whether you are a
              supplier looking for a delivery partner or a courier seeking
              flexible work, Fly Package has got you covered.
            </Typography>
          </Container>
        </div>
      </section>
      <section ref={contactRef} style={{ marginTop: 30 }}>
        <div id="contactUsSection" className={classes.root}>
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              className={classes.contactTitle}
            >
              Contact Us
            </Typography>
            <Typography
              variant="h6"
              align="justify"
              gutterBottom
              className={classes.contactText}
            >
              We would love to hear from you! If you have any questions,
              feedback, or concerns, please feel free to contact us at &nbsp;
              <a
                href="mailto:wesamghrayeeb1@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                flypackages1@gmail.com
              </a>
              &nbsp;
              <Phone />
              <a href="tel:1-800-712-555">1-800-712-555</a>
            </Typography>
          </Container>
        </div>
      </section>
    </div>
  );
}

export default Home;
