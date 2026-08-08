module.exports = {
  name: 'info',
  description: 'Affiche les infos du bot',
  async execute(sock, message, args, isGroup) {
    const sender = message.key.remoteJid;
    
    const infoText = `
╔════════════════════════════════╗
║      ℹ️ INFORMATIONS DU BOT    ║
╚════════════════════════════════╝

🤖 *Nom:* SIRA Bot
📱 *Plateforme:* WhatsApp (Baileys)
💻 *Langage:* Node.js
🔧 *Version:* 1.0.0

📍 *Fonctionnalités:*
✓ Réponse aux commandes
✓ Support des messages privés
✓ Support des groupes
✓ Système de commandes extensible

👨‍💻 *Développeur:* sidibemallet8-sudo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    await sock.sendMessage(sender, { text: infoText });
  }
};
