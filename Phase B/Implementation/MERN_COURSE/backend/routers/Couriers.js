const {Courier} = require('../models/Courier');
const express = require('express');
const router = express.Router();

/**
 * post a new Courier to the database
 */

router.post('/', async (req,res)=>{

    let courier = new Courier({
        birthDate: req.body.birthDate,
        hoursPerMonth: req.body.hoursPerMonth,
        deliveriesPerMonth: req.body.deliveriesPerMonth,
        availablityStatus: req.body.availablityStatus,
        status: req.body.status,
        user: req.body.user,
        location: req.body.location
    })
    courier = await courier.save();

    if(!courier)
    return res.status(400).send('the courier cannot be added!')

    res.send(courier);
})
/**
 * getting all the Couriers and showing the location and the user objects
 */
router.get(`/`, async (req, res) =>{
    
    const courierList = await Courier.find()
    .populate({ path: 'location', model: 'Location' })
    .populate({ path: 'user', model: 'flyUser' });

    if(!courierList) {
        res.status(500).json({success: false})
    } 
    res.send(courierList);
})

/**
 * getting the available couriers
 */
router.get('/Available', async (req, res) => {
    try {
      const courierList = await Courier.find({ availablityStatus: "Available" })
        .populate({ path: 'location', model: 'Location' })
        .populate({ path: 'user', model: 'flyUser' });
  
      if (courierList.length === 0) {
        return res.status(404).json({ success: false, message: 'No available couriers found.' });
      }
  
      res.send(courierList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while retrieving available couriers.' });
    }
  });
  
  

/**
 * get the courier by the userId
 */
router.get('/get/:id', async (req, res) =>{
    const supplier = await Courier.find({'user' : req.params.id})
    .populate({ path: 'location', model: 'Location' })
    .populate({ path: 'user', model: 'flyUser' });
    if(!supplier) {
        res.status(500).json({success: false})
    } 
    res.send(supplier);
})
/**
 * update the availability status of the courier
 */
router.put("/updateStatus/:id", async (req, res) => {
    const courier = await Courier.findByIdAndUpdate(
      req.params.id,
      {
        availablityStatus: req.body.availablityStatus,
      },
      { new: true }
    );
  
    if (!courier) return res.status(404).send("the Availability status of the courier cannot be updated");
  
    res.send(courier);
  });
/**
 * update the status of the courier OK,WARNING
 */
  router.put("/updateStatusOfTheCourier/:id", async (req, res) => {
    const courier = await Courier.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );
  
    if (!courier) return res.status(404).send("the status of the courier cannot be updated");
  
    res.send(courier);
  });
/**
 * update the location of the courier
 */
  router.put("/updateLocation/:id/:location", async (req, res) => {
    const courier = await Courier.findByIdAndUpdate(
      req.params.id,
      {
        location: req.params.location,
      },
      { new: true }
    );
  
    if (!courier) return res.status(404).send("the location of the courier cannot be updated");
  
    res.send(courier);
  });


module.exports = router;