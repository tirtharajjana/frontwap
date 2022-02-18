const mongo = require("mongoose");
const companySchema = require('../modal/company.modal');
const url = "mongodb://localhost:27017/test";
const option = {

}

mongo.connect(url);

const createRecord = async (data) => {
    const collection = new companySchema(data);
    const dataRes = await collection.save();
    return dataRes
}

module.exports = {
    createRecord
}