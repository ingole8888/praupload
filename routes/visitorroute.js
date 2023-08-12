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
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  // fileFilter: function (req, file, cb) {
  //   const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
  //   if (allowedMimeTypes.includes(file.mimetype)) {
  //     cb(null, true); 
  //   } else {
  //     cb(new Error("Invalid file type. Only images (JPEG, PNG) and PDFs are allowed."));
  //   }
  // }
 });

visitorController.post("/addvisitor",upload.fields([
  { name: "image", maxCount: 5 }
]), async (req, res) => {
  const { complainantName, complainantNumber,
    problem, orderbyadgp, markto, FirNumber,
    complainClerk, PhoneNumber, complainType,
    address, details, gender, district } = req.body;


  try {
    const visitor = new visitorModel({
      complainantName,
      complainantNumber,
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

    if(req.files.length != 0 ){
      if (req.files["image"]) {
        visitor.image = req.files["image"].map(file => file.filename);
      }
    }

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
