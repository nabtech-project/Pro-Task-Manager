const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// Get tasks
router.get("/", auth, async (req, res) => {
    const tasks = await Task.find({ user: req.user });
    res.json(tasks);
});

// Create task
router.post("/", auth, async (req, res) => {
    const task = await Task.create({
        user: req.user,
        title: req.body.title
    });
    res.json(task);
});

// Toggle complete
router.put("/:id", auth, async (req, res) => {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.json(task);
});

// Delete
router.delete("/:id", auth, async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

module.exports = router;
