const {Bill} = require('../models/Bill');
const express = require('express');
const router = express.Router();


const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

/**
 * get the bill by the supplierId and the specific month
 */
router.get('/get/:id/:month', async (req, res) =>{
    const bill = await Bill.find({'supplier' : req.params.id}).find({'month' : req.params.month})
    if(!bill) {
        res.status(500).json({success: false})
    } 
    res.send(bill);
})

/**
 * add a new bill
 * ot if there is existed bill increase the ordersPerMonth
 */
router.post('/', async (req,res)=>{
    const supplier = req.body.supplier
    const month = req.body.month
    let existingBill = await Bill.findOne({ supplier, month });
    if (existingBill) {
        // If a bill exists, increase the ordersPerMonth by one
        existingBill.ordersPerMonth += 1;
        await existingBill.save();
        res.send(existingBill);
      }
      else{
    let bill = new Bill({
        supplier: req.body.supplier,
        month: monthNames[(new Date).getMonth()],
        year: (new Date).getFullYear(),
        status: "Pending",
        amount: 50,
        ordersPerMonth: 1

    })
    bill = await bill.save();

    if(!bill)
    return res.status(400).send('the bill cannot be added!')
      
    res.send(bill);
}
})



module.exports = router;