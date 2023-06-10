const {CreditCard} = require('../models/CreditCard');
const express = require('express');
const router = express.Router();


/**
 * insert a new credit card to the database
 */
router.post('/', async (req,res)=>{
    const credit = await CreditCard.findOne({creditCardNumber: req.body.creditCardNumber})
    if(!credit){
        let creditcard = new CreditCard({
            creditCardNumber: req.body.creditCardNumber,
            creditCardExpDate: req.body.creditCardExpDate,
            creditCardCVV: req.body.creditCardCVV,
        })
        creditcard = await creditcard.save();

        if(!creditcard)
        return res.status(400).send('the credit card cannot be added!') // 400 for error in creating the object

    res.send(creditcard);
}
else{
    res.status(400).send('the credit card existed')
}

})


module.exports = router;
