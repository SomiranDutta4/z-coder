const mongoose = require('mongoose');

const url= "mongodb://localhost:27017/zcoder";

module.exports.connect = () => {
    mongoose.connect(url).then((res) => {
        console.log("MongoDB connected Successfully")
    }).catch((error) => {
        console.log(error)
    })
}