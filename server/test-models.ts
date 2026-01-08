import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function listModels() {
  try {
    // Esta es la función que nos dirá qué modelos existen para ti
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log("--- MODELOS DISPONIBLES ---");
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Error al listar modelos:", e);
  }
}

listModels();
