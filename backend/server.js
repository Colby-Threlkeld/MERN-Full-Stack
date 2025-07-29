import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from '../models/users.model.js';

dotenv.config();

const app = express();

app.use(express.json());  // allows us to accept JSON data in the req.body

app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({success: true, data: users});
    } catch (error) {
        console.log('Error fetching users:', error.message);
        res.status(500).json({success: false, message: "Server error" });
    }
});

app.post('/api/users', async (req, res) => {
    const user = req.body;

    if(!user.firstName || !user.lastName || !user.email || !user.password) {
        return res.status(400).json({ success: false, message: "Please fill in each field"})
    }
    
    const newUser = new User(user);

    try {
        await newUser.save();
        res.status(201).json({success: true, data: newUser});
    }   catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({success: false, message: "Server error" });
    } 
});

app.put("/api/users/:id", async (req, res) => {
    const {id} = req.params;

    const user = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: "User not found"});
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, {new:true})
        res.status(200).json({success: true, message: "User updated successfully"});
    } catch (error) {
        res.status(500).json({success: false, message: "Server error"});
    }
});



app.delete("/api/users/:id", async (req, res) => {
    const {id} = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "User deleted successfully"});
    }   catch (error) {
        console.log('Error deleting user:', error.message);
        res.status(404).json({success: false, message: "User not found"});
    }
});

// Starts the server only after DB connects
const startServer = async () => {
    try {
        await connectDB();
        app.listen(5000, () => {
            console.log('Server running at http://localhost:5000');
        });
    } catch (err) {
        console.error("Failed to start server:", err.message);
    }
};

startServer();
