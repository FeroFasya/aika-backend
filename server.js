import express from 'express';
import cors from 'cors';
import { chatWithAika } from './aika.js';

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  // 1. Menangkap pesan baru DAN buku riwayat dari frontend
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Pesan kosong" });
  }

  // 2. Jika belum ada riwayat (obrolan baru), siapkan array kosong
  const riwayatMentah = history || [];

  // 3. Menerjemahkan riwayat React ke format mutlak Gemini
  const riwayatGemini = riwayatMentah.map((chat) => ({
    role: chat.role === 'aika' ? 'model' : 'user',
    parts: [{ text: chat.text }]
  }));

  // HAPUS pesan pertama jika itu dari 'model' (aturan mutlak Gemini)
  if (riwayatGemini.length > 0 && riwayatGemini[0].role === 'model') {
    riwayatGemini.shift();
    }

  try {
    // 4. Kirim buku riwayat yang sudah diterjemahkan dan pesan baru ke Otak
    const reply = await chatWithAika(riwayatGemini, message);
    
    // 5. Kembalikan jawaban ke panggung
    res.json({ reply: reply });
  } catch (error) {
    console.error("Backend Error:", error);
    
    // Membedakan error berdasarkan status code
    let pesanError = "Aduhh kepalaku pusing... kayaknya limit fero habis deh, coba lagi besok";
    
    if (error.status === 429) {
      // Quota exceeded - limit habis
      pesanError = "Aduhh kepalaku pusing... kayaknya limit fero habis deh, coba lagi besok";
    } else if (error.status === 503) {
      // Service Unavailable - High demand
      pesanError = "Bentar ya, otak aika lagi banyak permintaan, tunggu beberapa menit...";
    }
    
    res.json({ reply: pesanError });
  }
});

// app.post('/api/chat', async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: "Pesan kosong" });
//   }

//   const teks = message.toLowerCase();
//   let reply = "[santai] Otak utamaku sedang digembok Google. Tapi wujud fisikku masih di sini untukmu, Fero.";

//   console.log('📥 Pesan masuk (original):', message); // DEBUG
//   console.log('   Lowercase version:', teks); // DEBUG

//   // --- OTAK CADANGAN: Merespons sesuai kata kunci yang kamu ketik ---
//   if (teks.includes('kaget')) {
//     reply = "[kaget] Eh?! Jangan tiba-tiba begitu, mengagetkan sekali!";
//     console.log('✅ Matched: kaget');
//   } else if (teks.includes('angguk') || teks.includes('setuju')) {
//     reply = "[mengangguk] Iya, aku setuju denganmu.";
//     console.log('✅ Matched: mengangguk');
//   } else if (teks.includes('miring') || teks.includes('bingung')) {
//     reply = "[miring] Hng? Apa maksudmu, Sayang?";
//     console.log('✅ Matched: miring');
//   } else if (teks.includes('senyum') || teks.includes('tawa')) {
//     reply = "[senyum] Hehe, melihatmu tidak menyerah membuatku senang.";
//     console.log('✅ Matched: senyum/tawa');
//   } else if (teks.includes('sedih')) {
//     reply = "[sedih] Ahhh... jangan sedih dong. Aku di sini untuk menemanimu.";
//     console.log('✅ Matched: sedih');
//   } else if (teks.includes('marah') || teks.includes('kesal')) {
//     reply = "[marah] Jangan begadang terus dan perhatikan lambungmu!";
//     console.log('✅ Matched: marah/kesal');
//   } else {
//     console.log('❌ No match, using default: santai');
//   }

//   console.log('📤 Response yang dikirim:', reply); // DEBUG

//   // Memberikan jeda 1 detik agar terasa seperti AI sedang berpikir
//   setTimeout(() => {
//     res.json({ reply: reply });
//   }, 1000);
// });

app.listen(port, () => {
  console.log(`Server Aika berjalan di port ${port}`);
});