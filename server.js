require("dotenv").config();

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


const API_KEY = process.env.API_KEY;


const GOOGLE_URL = "https://script.google.com/macros/s/AKfycbzLVgGqdOKR5IN0NAWvOTxPY11LgR4mSDqZJZeP2uIyT_Ske2W3VzixQujRGv3bQ93r5w/exec";

app.post("/enviar-feedback", async (req, res) => {
  try {
    await fetch(GOOGLE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY 
      },
      body: JSON.stringify(req.body)
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en servidor" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
