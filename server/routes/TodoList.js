const express = require("express");
const router = express.Router();
const { TodoList } = require('../models');

// GET all todos
router.get("/", async (req, res) => {
  try {
    const todoList = await TodoList.findAll();
    res.json(todoList);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new todo
router.post("/", async (req, res) => {
  try {
    const todo = req.body;
    await TodoList.create(todo);
    res.json(todo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a todo by ID
router.delete("/byId/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Use Sequelize's `destroy` method to delete the record by ID
    const deletedCount = await TodoList.destroy({
      where: { id }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(204).send(); // Respond with 204 No Content for a successful deletion
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT (update) a todo by ID
router.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body; // Assuming req.body contains the updates

    const [updatedCount] = await TodoList.update(updates, { where: { id } });

    if (updatedCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.sendStatus(204); // Respond with 204 No Content for a successful update
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
