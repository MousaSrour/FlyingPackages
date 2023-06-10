const { flyOrder } = require("../models/flyOrder");
const { flyUser } = require("../models/flyUser");
const { Location } = require("../models/Location");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/**
 * handling the get request for getting the list of the orders from the database:
 *  * http://localhost:3000/api/v1/flyOrder ||| GET
 * await for find the order list in the database
 * then send the orderList
 */
router.get("/", async (req, res) => {
  const orderList = await flyOrder.find().populate([
    {
      path: "supplier",
      populate: {
        path: "user",
        model: flyUser,
      },
    },
    {
      path: "courier",
      populate: {
        path: "user",
        model: flyUser,
      },
    },
    {
      path: "origin",
      populate: {
        path: "name",
      },
    },
    {
      path: "destination",
      populate: {
        path: "name",
      },
    },
  ]);
  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

/**
 * handling the get request for getting the specific order by id from the database:
 *  * http://localhost:3000/api/v1/flyOrder/643536c2d6d7b323c99fb1e5 ||| GET
 * await for find the order list in the database
 * I add the .populate to expand the info of the flyOrder.origin and flyOrder.destination
 * then send the flyorder
 */
router.get(`/:id`, async (req, res) => {
  const flyorder = await flyOrder
    .findById(req.params.id)
    .populate("origin")
    .populate("destination");

  if (!flyorder) {
    res.status(500).json({ success: false });
  }
  res.send(flyorder);
});

router.get(`/get/count`, async (req, res) => {
  const orderCount = await flyOrder.countDocuments({}).exec(); //counting how many objects in the flyOrder schema

  if (!orderCount) {
    res.status(500).json({ succes: false });
  }
  res.send({
    orderCount: orderCount,
  });
});

/**
 * handling the post request of adding a new order:
 *  * http://localhost:3000/api/v1/flyOrder ||| POST
 * defining an object (flyOrder) by taking the info from the req.body
 * await for saving the new order in the database
 * then send the res
 */
router.post("/", async (req, res) => {
  let flyorder = new flyOrder({
    orderNumber: req.body.orderNumber,
    supplier: req.body.supplier,
    courier: req.body.courier,
    submitDate: req.body.submitDate,
    submitHour: req.body.submitHour,
    completedDate: req.body.completedDate,
    customerPhoneNumber: req.body.customerPhoneNumber,
    origin: req.body.origin,
    destination: req.body.destination,
  });
  flyorder = await flyorder.save();

  if (!flyorder) return res.status(400).send("the order cannot be created!");

  res.send(flyorder);
});
/**
 * getting all the orders and show every information
 * about the orders
 */
router.get("/get/allOrders", async (req, res) => {
  const orderList = await flyOrder.find().populate([
    {
      path: "supplier",
      populate: {
        path: "user",
        model: flyUser,
      },
    },
    {
      path: "courier",
      populate: {
        path: "user",
        model: flyUser,
      },
    },
    {
      path: "origin",
      populate: {
        path: "name",
      },
    },
    {
      path: "destination",
      populate: {
        path: "name",
      },
    },
  ]);
  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

/**
 * getting all the orders that made by a
 * specefic supplier and show every information
 * about the orders
 */
router.get("/get/:id", async (req, res) => {
  const orderList = await flyOrder.find({ supplier: req.params.id }).populate([
    {
      path: "supplier",
      populate: {
        path: "user",
        model: flyUser,
      },
    },
    {
      path: "courier",
      populate: {
        path: "user",
        model: flyUser,
      },
    },
    {
      path: "origin",
      populate: {
        path: "name",
      },
    },
    {
      path: "destination",
      populate: {
        path: "name",
      },
    },
  ]);
  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});
/**
 * getting all the orders that made by a
 * specefic courier and the 
 * status of the 
 * order is pending and show every information
 * about the orders
 */
router.get("/get/courierOrders/:id", async (req, res) => {
  const orderList = await flyOrder.find({ courier: req.params.id, status:"PENDING" }).populate([
    {
      path: "supplier",
      populate: {
        path: "user",
        model: flyUser,
      },
    },
    {
      path: "courier",
      populate: {
        path: "user",
        model: flyUser,
      },
    },
    {
      path: "origin",
      populate: {
        path: "name",
      },
    },
    {
      path: "destination",
      populate: {
        path: "name",
      },
    },
    {
      path: "submitDate",
      populate: {
        path: "name",
      },
    },
    {
      path: "submitHour",
      populate: {
        path: "name",
      },
    },
  ]);
  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});
/**
 * getting all the orders that made by a
 * specefic coureir and show every information
 * about the orders
 */
router.get("/get/courierOrders/all/:id", async (req, res) => {
  const orderList = await flyOrder.find({ courier: req.params.id }).populate([
    {
      path: "supplier",
      populate: {
        path: "user",
        model: flyUser,
      },
    },
    {
      path: "courier",
      populate: {
        path: "user",
        model: flyUser,
      },
    },
    {
      path: "origin",
      populate: {
        path: "name",
      },
    },
    {
      path: "destination",
      populate: {
        path: "name",
      },
    },
    {
      path: "submitDate",
      populate: {
        path: "name",
      },
    },
    {
      path: "submitHour",
      populate: {
        path: "name",
      },
    },
  ]);
  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

/**
 * count the pending orders of the specefic coureir from the database 
 */
router.get('/get/countThePending/:id', async (req, res) => {
  try {
    const orderCount = await flyOrder.countDocuments({
      courier: req.params.id,
      status: 'PENDING'
    });

    res.send({ orderCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});
/**
 * count the orders of the specefic coureir from the database 
 */
router.get('/get/countTheOrders/:id', async (req, res) => {
  try {
    const orderCount = await flyOrder.countDocuments({
      courier: req.params.id,
    });

    res.send({ orderCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

/**
 * update the hour and the date of the order
 */
router.put("/update/:id", async (req, res) => {
  const order = await flyOrder.findByIdAndUpdate(
    req.params.id,
    {
      submitDate: req.body.submitDate,
      submitHour: req.body.submitHour,
    },
    { new: true }
  );

  if (!order) return res.status(404).send("the order cannot be updated");

  res.send(order);
});

/**
 * updating the status of the order
 * from pending to in delivery or rejected
 * and from in delivery to delivered
 */
router.put("/updateStatus/:status/:id", async (req, res) => {
  const { status, id } = req.params;

  if (status === "IN DELIVERY") {
    const order = await flyOrder.findById(id);

    if (!order) return res.status(404).send("The order was not found.");

    if (order.status === "IN DELIVERY") {
      return res.status(400).send("The order is already in delivery.");
    }

    order.startDeliveryTime = new Date(); // Store the start time

    await order.save();
  }

  if (status === "DELIVERED") {
    const order = await flyOrder.findById(id);

    if (!order) return res.status(404).send("The order was not found.");

    if (order.status !== "IN DELIVERY") {
      return res.status(400).send("The order is not in delivery.");
    }

    const startDeliveryTime = order.startDeliveryTime;
    const endDeliveryTime = new Date();

    const deliveryTime = Math.floor(
      (endDeliveryTime - startDeliveryTime) / 1000 / 60 // Calculate the delivery time in minutes
    );

    order.deliveryTime = deliveryTime; // Store the delivery time

    await order.save();
  }

  const order = await flyOrder.findByIdAndUpdate(
    id,
    {
      status: status,
    },
    { new: true }
  );

  if (!order) return res.status(404).send("The order status cannot be updated.");

  res.send(order);
});

module.exports = router;

/**
 * creating a new flyOrder this is the body of the request
 * that have all the information that required to create a new order :-
 *     { 
        "orderNumber": "1",
        "supplier": "643532889bd1e427f79a59c9",
        "courier": "643531ee268c2dd8b39f32ef",
        "completedDate": "",
        "customerPhoneNumber": "0548756987",
        "origin": "Nazareth",
        "destination": "Afula"
       }
 */
