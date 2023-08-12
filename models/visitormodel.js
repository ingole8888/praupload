const mongoose=require("mongoose")

const visitorSchema= new mongoose.Schema({
   complainantName:{type:String},
   complainantNumber:{type:Number},
   problem:{type:String},
   orderbyadgp:{type:String},
   markto:{type:String},
   FirNumber:{type:String},
   complainClerk:{type:String},
   PhoneNumber:{type:String},
   complainType:{type:String},
   address:{type:String},
   //area:{type:String},
   details:{type:String},
   gender:{type:String},
   image:[{type:String}],
   district:{type:String}
},
{ timestamps: true }
)

const visitorModel=mongoose.model("visitor",visitorSchema)

module.exports=visitorModel