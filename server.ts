import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post("/api/generate-letter", async (req, res) => {
    try {
      const { recipientName, context, style } = req.body;

      if (!recipientName || !context || !style) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const prompt = `Escribe una carta de amor o afecto para alguien con quien no has hablado en mucho tiempo.
      Destinatario: ${recipientName}
      Relación/Contexto: ${context}
      Estilo: ${style}
      
      La carta debe ser sentida, respetuosa y buscar reconectar de manera genuina. 
      No uses marcadores de posición como "[Tu nombre]". Deja claro que el remitente la está escribiendo desde el corazón.
      Escribe solo la carta, sin comentarios adicionales.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      res.json({ content: result.text });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to generate letter" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
