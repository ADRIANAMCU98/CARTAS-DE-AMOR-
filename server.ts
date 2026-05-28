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

      const prompt = `Eres un maestro de las cartas de amor y reconciliación en español. Escribe UNA carta íntima y memorable.

Destinatario: ${recipientName}
Contexto y relación: ${context}
Tono solicitado: ${style}

Instrucciones de calidad premium:
- Abre con una imagen o sensación evocadora, no con clichés vacíos.
- Incluye al menos un recuerdo o detalle concreto inspirado en el contexto (sin inventar hechos que contradigan lo dado).
- Cierra con una invitación suave a reconectar, sin presionar.
- Longitud: entre 180 y 320 palabras. Párrafos cortos, ritmo literario.
- Voz en primera persona del remitente. Tutea o trata de "usted" según encaje con el tono.
- Prohibido: marcadores [nombre], listas con viñetas, encabezados, notas del autor, emojis.
- Escribe SOLO el cuerpo de la carta (sin "Querido/a", sin firma con nombre inventado).`;

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
