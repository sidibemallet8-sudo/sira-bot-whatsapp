require('dotenv').config();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Logger
const logger = pino({ transport: { target: 'pino-pretty' } });

// Token Hugging Face (gratuit)
const HF_TOKEN = process.env.HF_TOKEN || 'hf_default_token';

// Charger les commandes
const commandsPath = path.join(__dirname, 'commands');
const commands = {};

if (fs.existsSync(commandsPath)) {
  fs.readdirSync(commandsPath).forEach(file => {
    if (file.endsWith('.js')) {
      const command = require(path.join(commandsPath, file));
      commands[command.name] = command;
    }
  });
}

console.log(`\n✅ ${Object.keys(commands).length} commandes chargées!\n`);

// Fonction pour appeler l'IA Mistral via Hugging Face
async function getAIResponse(userMessage) {
  try {
    // Utiliser Hugging Face Inference API avec Mistral-7B (gratuit)
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
      {
        inputs: userMessage,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000
      }
    );

    if (response.data && response.data[0] && response.data[0].generated_text) {
      let aiResponse = response.data[0].generated_text;
      
      // Nettoyer la réponse
      aiResponse = aiResponse.replace(userMessage, '').trim();
      
      // Limiter la longueur pour WhatsApp
      if (aiResponse.length > 1000) {
        aiResponse = aiResponse.substring(0, 997) + '...';
      }
      
      return aiResponse;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur IA:', error.message);
    return null;
  }
}

// Fonction principale
async function startBot() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
      auth: state,
      logger: logger,
      printQRInTerminal: true,
      syncFullHistory: false,
      markOnlineOnConnect: true,
    });

    // Événement de connexion
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (connection === 'close') {
        if ((lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut) {
          startBot();
        } else {
          console.log('Connexion fermée. Veuillez scanner le QR code à nouveau.');
        }
      } else if (connection === 'open') {
        console.log('\n✅ Bot connecté avec succès !\n');
      }
    });

    // Événement de sauvegarde des credentials
    sock.ev.on('creds.update', saveCreds);

    // Événement de réception de messages
    sock.ev.on('messages.upsert', async (m) => {
      const message = m.messages[0];

      if (!message.message) return;
      if (message.key.fromMe) return;

      const text = message.message.conversation || 
                   message.message.extendedTextMessage?.text || '';
      
      const sender = message.key.remoteJid;
      const isGroup = message.key.remoteJid.endsWith('@g.us');

      console.log(`\n📨 Message de ${sender}: ${text}`);

      // Vérifier si c'est une commande (avec prefix !)
      if (text.startsWith('!')) {
        const args = text.slice(1).split(' ');
        const commandName = args[0].toLowerCase();

        if (commands[commandName]) {
          try {
            await commands[commandName].execute(sock, message, args, isGroup);
          } catch (error) {
            console.error('Erreur lors de l\'exécution de la commande:', error);
            await sock.sendMessage(sender, { 
              text: '❌ Une erreur s\'est produite lors de l\'exécution de la commande.' 
            });
          }
        } else {
          await sock.sendMessage(sender, { 
            text: `❌ Commande "${commandName}" inconnue. Tapez !help pour voir les commandes disponibles.` 
          });
        }
      } 
      // Messages normaux → Utiliser l'IA
      else if (text.length > 0) {
        try {
          // Afficher le typing
          await sock.sendPresenceUpdate('composing', sender);

          // Appeler l'IA
          const aiResponse = await getAIResponse(text);

          if (aiResponse) {
            await sock.sendMessage(sender, { text: `🤖 ${aiResponse}` });
          } else {
            await sock.sendMessage(sender, { 
              text: '⏳ Je réfléchis encore... Essaye une autre question ou utilise !help pour les commandes!' 
            });
          }

          // Arrêter le typing
          await sock.sendPresenceUpdate('paused', sender);
        } catch (error) {
          console.error('Erreur IA:', error.message);
          await sock.sendMessage(sender, { 
            text: '❌ Erreur lors du traitement. Réessaye plus tard !' 
          });
        }
      }
    });

  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Démarrer le bot
startBot().catch(console.error);
