// server.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB schema and model
const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        // Custom email validation logic
        const regex = /^[^\s@]+@(gmail\.com|example\.com|domain\.com)$/;
        return regex.test(value);
      },
      message: "Invalid email address",
    },
  },
});

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

// API route for subscribing to an email
app.post("/sendemail", async (req, res) => {
  const { email } = req.body;

  try {
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(201).json({ message: "Subscription successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Start the server

app.get("/", (req, res) => {
  res.send(" server is running");
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
