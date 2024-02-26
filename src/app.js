const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const AuthRoute = require('../routes/auth.js');
const Profile = require('../models/profile.js');
const Message = require('../models/message');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});

const dbURL = 'mongodb+srv://krystian:krystian2@cluster.c6yyhpd.mongodb.net/livescore?retryWrites=true&w=majority';
const port = process.env.PORT || 4200;

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use('/api', AuthRoute)


app.get('/', (req, res) => {
  res.send('Server is running');
});

async function findUserByName(userName) {
  try {
    // Assuming the 'name' field holds the user's name in your Profile model
    return await Profile.findOne({ name: userName });
  } catch (err) {
    console.error('Error finding user by name:', err);
    throw err;
  }
}


const users = {};

io.on("connection", (socket) => {
  socket.on('register_user', (userName) => {
    findUserByName(userName).then(user => {
      if (user) {
        users[socket.id] = user.name;
        socket.userId = user.name;
        console.log(`User ${user.name} registered with socket ID ${socket.id}`);
      } else {
        console.log(`User ${userName} not found in MongoDB.`);
      }
    }).catch(err => console.error(err));
  });

  socket.on('send_message', async ({ recipientName, message, senderId }) => {
    try {
      const sender = await Profile.findOne({ name: senderId });
      const recipient = await Profile.findOne({ name: recipientName });

      if (!sender || !recipient) {
        console.log('Sender or recipient not found in the database.');
        return;
      }

      const newMessage = new Message({
        senderName: senderId,
        recipientName,
        message,
      });

      await newMessage.save();

      const recipientSocketId = Object.keys(users).find(key => users[key] === recipientName);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receive_message', { message, senderId: senderId });
      } else {
        console.log(`Recipient ${recipientName} not currently connected.`);
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });


  socket.on("disconnect", () => {
    console.log(`User ${socket.userId} disconnected`);
    Object.keys(users).forEach(key => {
      if (users[key] === socket.userId) {
        delete users[key];
      }
    });
  });
});

mongoose.connect(dbURL)
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err.message);
  });
