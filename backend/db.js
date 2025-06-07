const mongoose = require('mongoose');
const url = process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost:27017/zcoder';

// const url= "mongodb://localhost:27017/zcoder";
console.log(process.env.MONGO_URL)

module.exports.connect = () => {
    mongoose.connect(url).then((res) => {
        console.log("MongoDB connected Successfully")
    }).catch((error) => {
        console.log(error)
    })
}