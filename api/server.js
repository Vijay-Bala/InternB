const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ConnectionLog = require('./models/connectionLogModel'); 

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://VB:7604@react-todo.p3cc7fy.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error: ", err));

let connectionCount = 0;

app.use(async (req, res, next) => {
  try {
    connectionCount++;
    console.log(`Connection count: ${connectionCount}`);

    const logEntry = new ConnectionLog({ connectionCount });
    await logEntry.save();

    next();
  } catch (err) {
    console.error("Error logging connection count: ", err);
    res.status(500).json({ error: 'Failed to log connection count' });
  }
});

const Todo = require('./models/Todo');

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.error("Error fetching todos: ", err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.post('/todo/new', async (req, res) => {
  const { text } = req.body;
  
  try {
    const todo = new Todo({ text });
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error("Error creating todo: ", err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});


app.put('/todo/update/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    todo.text = req.body.text;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error("Error updating todo: ", err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

app.delete('/todo/delete/:id', async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ result });
  } catch (err) {
    console.error("Error deleting todo: ", err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});


app.get('/todo/complete/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.complete = !todo.complete;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error("Error updating todo: ", err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

app.get('/connection-count', (req, res) => {
  res.json({ connectionCount }); 
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
