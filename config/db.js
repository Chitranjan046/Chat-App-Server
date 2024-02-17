// const mongoose = require("mongoose");
// require('dotenv').config();
// const connectDB = async function () {
//   try {
//       await mongoose.connect(process.env.MONGODBURI);
//       console.log('db connection success')
//   } catch (error) {
//       throw new Error(error.message)
//   }
// }

// module.exports =  connectDB;


const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

const connectDB = mongoose.connection;

connectDB.on('error', console.error.bind(console, 'connection error:'));
connectDB.once('open', function () {
  console.log('Connected to the local MongoDB database successfully');
});

module.exports = connectDB;
