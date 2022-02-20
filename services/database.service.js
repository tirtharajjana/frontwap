const mongo = require("mongoose");
const companySchema = require("../model/company.model");
const userSchema = require("../model/user.model");

const schemaList = {
  company: companySchema,
  user: userSchema
}

const url = "mongodb://localhost:27017/test";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};
mongo.connect(url,options);

const createRecord = async (data,schema)=>{
  const currentSchema = schemaList[schema];
  const collection = new currentSchema(data);
  const dataRes = await collection.save();
  return dataRes;
}

module.exports = {
  createRecord: createRecord
}
