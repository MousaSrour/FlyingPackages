const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const path = require('path');
const router = express.Router();

app.use(cors());
app.options('*', cors());

//middleware
app.use(bodyParser.json());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
app.use(errorHandler);


const supplierRouter = require('./routers/Suppliers');
const courierRouter = require('./routers/Couriers');
const flyOrdersRouter = require('./routers/flyOrders');
const flyUsersRouter = require('./routers/flyUsers');
const locationsRouter = require('./routers/Locations');
const creditCardRouter = require('./routers/creditCards');
const billRouter = require('./routers/bills');



const api = process.env.API_URL;


app.use(`${api}/Suppliers`, supplierRouter)
app.use(`${api}/Couriers`, courierRouter)
app.use(`${api}/flyOrders`, flyOrdersRouter)
app.use(`${api}/flyUsers`, flyUsersRouter)
app.use(`${api}/Locations`, locationsRouter)
app.use(`${api}/creditCards`, creditCardRouter)
app.use(`${api}/bills`, billRouter)







///
app.use(express.static(path.join(__dirname, "..", "frontend", "build")));
app.use(express.static(path.join(__dirname, "..", "frontend", "public"),{maxAge:'30d'}))



// connection to the database
mongoose.connect(process.env.ConnectionString)
.then( ()=>{
    console.log('The Database Connection is ready...')
})
.catch((err)=>{
    console.log(err);
})


app.listen(3000, ()=>{
    console.log(api);
    console.log('server is running http://localhost:3000');
})