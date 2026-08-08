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

👨‍💻 *Créateur:* Mallet Sidibe
🏢 *Entreprise:* Data-core
📞 *Contact:* +223 83466782

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    await sock.sendMessage(sender, { text: infoText });
  }
};
