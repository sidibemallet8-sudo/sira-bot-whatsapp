module.exports = {
  name: 'about',
  description: 'À propos du bot',
  async execute(sock, message, args, isGroup) {
    const sender = message.key.remoteJid;
    
    const aboutText = `
╔════════════════════════════════╗
║       📖 À PROPOS DU BOT       ║
╚════════════════════════════════╝

*SIRA Bot* est un bot WhatsApp intelligent construit avec:

🛠️ *Technologie:*
- Baileys (Émulateur WhatsApp)
- Node.js
- Système de commandes modulaire

🎯 *Objectifs:*
- Automatiser les tâches WhatsApp
- Répondre aux commandes
- Fonctionner en messages privés et groupes
- Être facilement extensible

🚀 *Améliorations futures:*
- Intégration IA/ChatGPT
- Base de données
- Systèmes d'automatisation avancés
- Et bien d'autres...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pour plus d'infos: !help
    `;

    await sock.sendMessage(sender, { text: aboutText });
  }
};
