
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const imageRoutes = require('./routes/ImageRoutes');
const cors = require('cors')

const app = express();
app.use(cors());

app.use(express.json({ limit: "20mb" }));


// Routes
app.use('/api', imageRoutes);

// MongoDB Connection

app.get('/', async(req, res) => {
    return res.json({ "msg" : "test server"})
})


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error('MongoDB error:', err));
