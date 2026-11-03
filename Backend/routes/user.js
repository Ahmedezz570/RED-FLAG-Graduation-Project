const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema"); 
router.get("/", async (req, res) => {
    try {
        const users = await User.find();  
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Define your user routes here
router.post( "/", async (req, res) => {
  
    const{ name, email, password } = req.body;
    if(!name || !email || !password){
        return res.status(400).json({ message: "Please provide name, email, and password" });
    }
    const newUser = await User.create({ name, email, password });
    res.status(201).json(newUser);

});
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);  
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true , runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;


