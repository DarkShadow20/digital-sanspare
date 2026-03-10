const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()


const app = express();
app.use(express.json());
app.use(cors()); // Allows your frontend to talk to this backend
// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);

// 2. Define your Data Schema (similar to Firebase collections)
const InquirySchema = new mongoose.Schema({
    name: String,
    phone: String,
    requirement: String,
    message: String,
    createdAt: String
});
const Inquiry = mongoose.model('Inquiry', InquirySchema);

// 3. Create an API Endpoint to receive form submissions
app.post('/api/quote', async (req, res) => {
    try {
        const newInquiry = new Inquiry(req.body);
        await newInquiry.save();
        res.status(200).json({ message: "Request Saved Successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to save request" });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));