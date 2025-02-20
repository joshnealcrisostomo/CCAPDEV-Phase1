


const mongoose = require("mongoose")
const uri = "mongodb+srv://patricklim:Derp634Derp@apdevcluster.chzne.mongodb.net/?retryWrites=true&w=majority&appName=APDEVcluster";
const User = require('./UserSchema.js'); // Replace with the actual path to your user.model.js file

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB Connected...');

    // Create a new user instance
    const newUser = new User({
        email: 'euly123@gmail.com',
        displayName: 'Eulysis Dimailig',
        username: '@euly123',
        password: 'eulyPogi123',
        bio: 'No bio yet.',
        profilePic: 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png',
    });

    // Save the user to the database
    newUser.save()
      .then((savedUser) => {
        console.log('User saved:', savedUser);
        mongoose.disconnect(); // Disconnect after testing
      })
      .catch((err) => {
        console.error('Error saving user:', err);
        mongoose.disconnect(); // Disconnect after testing
      });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });


