module.exports = {
  name: 'hello',
  description: 'Salue l\'utilisateur',
  async execute(sock, message, args, isGroup) {
    const sender = message.key.remoteJid;
    const time = new Date().getHours();
    
    let greeting = '👋 Bonjour';
    if (time >= 12 && time < 18) {
      greeting = '☀️ Bon après-midi';
    } else if (time >= 18) {
      greeting = '🌙 Bonsoir';
    }

    const text = `${greeting}! 😊\n\nComment allez-vous?`;
    await sock.sendMessage(sender, { text });
  }
};
