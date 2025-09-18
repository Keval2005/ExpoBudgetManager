const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load .env file

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDb');
  })
  .catch(err => {
    console.log('Error Connecting to MongoDB', err);
  });

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});

const Expense = require('./models/expense');

app.post('/expenses', async (req, res) => {
  try {
    const {type, account, category, amount, date, note, day} = req.body;

    const newExpense = new Expense({
      userId,
      type,
      account,
      category,
      amount,
      date,
      note,
      day,
    });

    await newExpense.save();

    res
      .status(201)
      .json({message: 'Expense created Successfully', expense: newExpense});
  } catch (error) {
    console.log('Error creating expense', error);
    return res.status(500).json({message: 'Internal server error'});
  }
});

app.get('/expenses', async (req, res) => {
  try {
    // const {date} = req.query;
    // console.log('data', date);
    // const expenses = await Expense.find({date: date});
    // res.status(200).json(expenses);
    const { userId, date } = req.query;
    const query = { userId };
    if (date) query.date = date;

    const expenses = await Expense.find(query);
    res.status(200).json(expenses); 
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({message: 'Error getting all expenses'});
  }
});

app.get('/allExpenses', async (req, res) => {
  try {
    const expenses = await Expense.find({});
    res.status(200).json(expenses);
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({error: 'Error getting expenses'});
  }
});

const User = require('./models/user');

// Get user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // do not return password
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.log('Error fetching user', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/users", async (req, res) => {
  const { email, password } = req.query;

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    // Return userId so client can store locally
    res.status(200).json({ userId: user._id });
  } catch (error) {
    console.log("Error fetching user", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
