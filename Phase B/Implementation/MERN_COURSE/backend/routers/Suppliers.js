const {Supplier} = require('../models/Supplier');
const express = require('express');
const router = express.Router();

/**
 * get the supplier by the userId
 * and show the location and the user objects
 */
router.get('/get/:id', async (req, res) =>{
    const supplier = await Supplier.find({'user' : req.params.id})
    .populate({ path: 'location', model: 'Location' })
    .populate({ path: 'user', model: 'flyUser' });
    if(!supplier) {
        res.status(500).json({success: false})
    } 
    res.send(supplier);
})

router.get('/getAllSuppliers', async (req, res) =>{
  const supplier = await Supplier.find();
  if(!supplier) {
      res.status(500).json({success: false})
  } 
  res.send(supplier);
})

/**
 * add a new supplier
 * to the database
 */
router.post('/', async (req,res)=>{

    let supplier = new Supplier({
        status: req.body.status,
        ordersNo: req.body.ordersNo,
        registirationDate: req.body.registirationDate,
        companyName: req.body.companyName,
        user: req.body.user,

    })
    supplier = await supplier.save();

    if(!supplier)
    return res.status(400).send('the supplier cannot be added!')

    res.send(supplier);
})
/**
 * update the location for the first
 * time that the suppleir sign in
 */
router.put("/updateLocation/:id/:location", async (req, res) => {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      {
        location: req.params.location,
      },
      { new: true }
    );
  
    if (!supplier) return res.status(404).send("the location of the supplier cannot be updated");
  
    res.send(supplier);
  });

  router.delete("/deleteSupplier/:id", async (req, res) =>{
    const deleted = await Supplier.findByIdAndRemove(req.params.id)
    if (!deleted) return res.status(404).send("the supplier cannot be deleted");
  
    res.send(deleted);
  })

module.exports = router;