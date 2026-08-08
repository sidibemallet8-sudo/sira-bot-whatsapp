module.exports = {
  name: 'ping',
  description: 'Teste la connexion du bot',
  async execute(sock, message, args, isGroup) {
    const sender = message.key.remoteJid;
    const start = Date.now();
    
    const sentMessage = await sock.sendMessage(sender, { text: '⏱️ Pong!' });
    
    const latency = Date.now() - start;
    
    await sock.sendMessage(sender, { 
      text: `🏓 Pong! Latence: ${latency}ms` 
    });
  }
};
