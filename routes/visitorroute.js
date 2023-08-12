const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');

const visitorModel = require("../models/visitormodel");

const visitorController = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
   
    cb(null, './public/uploads');
  },
  filename: function (req, file, cb) {
   
    // Generate a unique filename by appending a timestamp to the original filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
    
  }
  
});
const upload = multer({ storage: storage });

visitorController.post("/addvisitor",upload.single('image'), async (req, res) => {
  const { complainantName, complainantNumber,
    problem, orderbyadgp, markto, FirNumber,
    complainClerk, PhoneNumber, complainType,
    address, details, gender, district } = req.body;
    console.log(req.file.filename)

  try {
    const visitor = new visitorModel({
      complainantName,
      complainantNumber,
      image:req.file?.filename,
      problem,
      orderbyadgp,
      markto,
      FirNumber,
      complainClerk,
      PhoneNumber,
      complainType,
      address,
      // area,
      details,
      gender,
      district
    });

    await visitor.save();
    
    return res
      .status(201)
      .send({ status: 201, message: "visitor register successfull", visitor });
  } catch (error) {
    return res.send(error.message)
  }
});

visitorController.get("/getvisitor", async (req, res) => {
  try {
    const visitor = await visitorModel.find();
    res.send(visitor);
  } catch (error) {
    res.send(error)
  }
});

//update district by id
visitorController.put("/update/:id", async (req, res) => {
  const id = req.params.id
  //const {id} = req.body;
  try {
    const rag = await visitorModel.findByIdAndUpdate(id,
      {
        $set: req.body,
      },
      { new: true })
    res.status(200).send(rag)
  } catch (error) {
    res.send(error)
  }
})

//delete visitor by id 

visitorController.delete("/delete/:id", async (req, res) => {
  const id = req.params.id
  //const {id} = req.body;
  try {
    const visitor = await visitorModel.findByIdAndRemove(id)
    res.send(visitor)
  } catch (error) {
    res.send(error)
  }
})

module.exports = visitorController;
