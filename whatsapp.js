const { DisconnectReason, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const makeWASocket = require("@whiskeysockets/baileys").default;

// WhatsApp connection
let sock; // WhatsApp socket instance

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    connectTimeoutMs: 60000,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update || {};

    if (qr) {
      console.log("Scan this QR code with your WhatsApp app:", qr);
    }

    if (connection === "close") {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log("Reconnecting...");
        connectToWhatsApp();
      } else {
        console.log("Logged out. Please restart the application and scan the QR code again.");
      }
    }

    if (connection === "open") {
      console.log("Connected to WhatsApp!");
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

// Function to send a message
async function sendMessage(chatId, message) {
  if (!sock) {
    throw new Error("WhatsApp is not connected.");
  }

  try {
    console.log(`Sending message to: ${chatId}`);
    await sock.sendMessage(chatId, { text: message });
    console.log(`Message sent to ${chatId}: ${message}`);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

module.exports = { connectToWhatsApp, sendMessage };
