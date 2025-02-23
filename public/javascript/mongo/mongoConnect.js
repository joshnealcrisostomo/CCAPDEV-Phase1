const mongoose = require("mongoose")
const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";
const User = require('./UserSchema.js');

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB Connected...');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });


