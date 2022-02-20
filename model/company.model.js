const mongo = require("mongoose");
const { Schema } = mongo;

const companySchema = new Schema({
  company_name: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  mobile: Number,
  emailVerified: {
    type: Boolean,
    default: false
  },
  mobileVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// company name unique validation
companySchema.pre('save',async function(next){
  const query = {
    company_name: this.company_name
  }
  const length = await mongo.model("Company").countDocuments(query);
  if(length > 0)
  {
    throw next("Company name already exists !");
  }
  else{
    next();
  }
});

// company email unique validation
companySchema.pre('save',async function(next){
  const query = {
    email: this.email
  }
  const length = await mongo.model("Company").countDocuments(query);
  if(length > 0)
  {
    throw next("Company email already exists !");
  }
  else{
    next();
  }
});

module.exports = mongo.model("Company",companySchema);
