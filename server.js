// server.js — this is the heart of your backend

const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

// load your .env file so process.env.MONGO_URL works
dotenv.config()

const app = express()

// this lets Express read JSON from request bodies
app.use(express.json())
app.use(express.static('public'))

// connect to MongoDB using the URL in your .env file
mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.log('Connection failed:', err))

// tell Express to use your recipe routes
// any request to /api/recipes will go to routes/recipes.js
const recipeRoutes = require('./routes/recipes')
app.use('/api/recipes', recipeRoutes)

// start listening on port 3000
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})