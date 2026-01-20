// server.js (ES Module)
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages) return res.status(400).json({ reply: "Chybí zprávy v požadavku." });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages
    });
    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Došlo k chybě při komunikaci s AI." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));
