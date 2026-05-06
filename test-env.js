require('dotenv').config();

if (process.env.GEMINI_API_KEY) {
    console.log('Gemini API key is miau')
} else {
    console.log('miau, kenapa eror, benerin!')
}