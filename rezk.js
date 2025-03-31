const axios = require("axios");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const CHAT_IDS = ["5319575940", "7523888013"]; 
const BASE_URL = "https://ads-bot.pp.ua/credit.php?chat_id=";

let successCount = {}; 
CHAT_IDS.forEach((id) => (successCount[id] = 0)); 

async function fetchData(chatId) {
  const url = `${BASE_URL}${chatId}`;
  console.log(`[${new Date().toISOString()}] Sending request to ${chatId}...`);

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": "https://ads-bot.pp.ua/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      timeout: 30000,
    });

    successCount[chatId]++; 
    console.log(`[${new Date().toISOString()}] ✅ Request #${successCount[chatId]} to ${chatId} successful`);
    console.log(`[${new Date().toISOString()}] Response Data (${chatId}):`, response.data);

    
    setTimeout(() => fetchData(chatId), 700);

  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Request to ${chatId} failed: ${error.message}`);
    if (error.response) {
      console.error(`[${new Date().toISOString()}] ❌ Server Response (${chatId}):`, error.response.data);
    }

    
    setTimeout(() => fetchData(chatId), 5000);
  }
}


CHAT_IDS.forEach((chatId) => fetchData(chatId));


app.get("/", (req, res) => {
  res.send("Bot is running...");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
