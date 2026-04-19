// routes/recipes.js — your actual API endpoints live here

const express = require('express')
const router = express.Router()
const Recipe = require('../models/Recipe')

// ─────────────────────────────────────────
// GET /api/recipes — fetch ALL recipes
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query
    const query = {}

    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    if (category) {
      query.category = category
    }

    const recipes = await Recipe.find(query)
    res.json(recipes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─────────────────────────────────────────
// GET /api/recipes/:id — fetch ONE recipe
// ─────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' })
    res.json(recipe)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─────────────────────────────────────────
// POST /api/recipes — add a NEW recipe
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
  const recipe = new Recipe({
    name:         req.body.name,
    ingredients:  req.body.ingredients,
    instructions: req.body.instructions,
    category:     req.body.category,
    image:        req.body.image
  })
  try {
    const saved = await recipe.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// ─────────────────────────────────────────
// DELETE /api/recipes/:id — delete ONE recipe
// ─────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' })
    await Recipe.findByIdAndDelete(req.params.id)
    res.json({ message: 'Recipe deleted successfully!' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ─────────────────────────────────────────
// PUT /api/recipes/:id — update ONE recipe
// ─────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!updated) return res.status(404).json({ message: 'Recipe not found' })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router