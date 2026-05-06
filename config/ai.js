require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inisialisasi Gemini menggunakan kunci dari brankas
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Menggunakan model Gemini 2.5 Flash yang cepat dan stabil
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Ekspor agar bisa dipakai
module.exports = { model };