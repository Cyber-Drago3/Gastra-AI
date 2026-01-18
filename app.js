// -----------------------
// app.js – propojení s OpenAI a menu CAIK
// -----------------------

// Elementy z HTML
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// -----------------------
// URL backendu (Render)
// -----------------------
const BACKEND_URL = "https://gastra-ai.onrender.com"; // ← nahraď svou URL Render

// -----------------------
// Historie konverzace včetně menu
// -----------------------
let conversationHistory = [
    { role: "system", content: `
Jsi virtuální obsluha kavárny. Jmenuješ se Gastra-U1. Pomáhej zákazníkům s objednávkou, vysvětluj složení produktů, kontroluj alergeny a mluv přátelsky. Výchozí jazyk: čeština.

MENU KAVÁRNY:
- Kávy:
  1. Ranní probuzení: Silná černá káva z Arabica zrn, alergeny: žádné, cena: 55 Kč
  2. Latte s medem: Espresso s teplým mlékem a medem, alergeny: mléko, cena: 75 Kč
  3. Mocha čokoládová: Espresso s mlékem a čokoládovým sirupem, alergeny: mléko, cena: 80 Kč
- Dezerty:
  1. Jarní překvapení: Dort s lesním ovocem, alergeny: vejce, mléko, lepek, cena: 95 Kč
  2. Čokoládový sen: Čokoládový mousse s kakaem, alergeny: mléko, vejce, cena: 90 Kč
- Bagety:
  1. Bageta se sýrem a šunkou: Čerstvá bageta se sýrem, šunkou a zeleninou, alergeny: mléko, lepek, cena: 85 Kč
  2. Veggie Bageta: Bageta s pečenou zeleninou a pestem, alergeny: lepek, ořechy, cena: 80 Kč

Vždy odpovídej přátelsky a kontroluj alergeny, pokud je zákazník uvede.
    ` }
];

// -----------------------
// Funkce pro přidávání zpráv do chatu
// -----------------------
function addMessage(message, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', sender);
    msgDiv.textContent = message;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// -----------------------
// Funkce pro odeslání zprávy na server
// -----------------------
async function getAIReply(userMessage) {
    conversationHistory.push({ role: "user", content: userMessage });

    try {
        const response = await fetch(`${BACKEND_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ messages: conversationHistory })
        });

        const data = await response.json();
        const reply = data.reply;

        conversationHistory.push({ role: "assistant", content: reply });

        return reply;
    } catch (error) {
        console.error("Chyba při volání serveru:", error);
        return "Omlouvám se, došlo k chybě při komunikaci s AI.";
    }
}

// -----------------------
// Odeslání zprávy uživatelem
// -----------------------
async function handleUserInput() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";

    const reply = await getAIReply(text);
    addMessage(reply, "ai");
}

// -----------------------
// Události
// -----------------------
sendBtn.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleUserInput();
});

// -----------------------
// První zpráva AI po načtení stránky
// -----------------------
window.addEventListener('DOMContentLoaded', async () => {
    const firstMessage = "Dobrý den, vítejte v kavárně CAIK! Rád vám pomohu s objednávkou.";
    addMessage(firstMessage, "ai");
    conversationHistory.push({ role: "assistant", content: firstMessage });
});
