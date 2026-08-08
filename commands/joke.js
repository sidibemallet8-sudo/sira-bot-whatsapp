const axios = require('axios');

module.exports = {
  name: 'joke',
  description: 'Génère une blague aléatoire',
  async execute(sock, message, args, isGroup) {
    const sender = message.key.remoteJid;

    try {
      // Envoyer un message de chargement
      await sock.sendMessage(sender, { text: '⏳ Je cherche une blague drôle...' });

      // Appel à l'API JokeAPI
      const response = await axios.get('https://v2.jokeapi.dev/joke/Any?lang=fr', {
        timeout: 5000
      });

      const joke = response.data;
      let jokeText = '';

      if (joke.type === 'single') {
        // Blague sur une seule ligne
        jokeText = `😂 ${joke.joke}`;
      } else if (joke.type === 'twopart') {
        // Blague en deux parties (setup + delivery)
        jokeText = `😂 ${joke.setup}\n\n${joke.delivery}`;
      }

      // Supprimer le message de chargement et envoyer la blague
      await sock.sendMessage(sender, { text: jokeText });

    } catch (error) {
      console.error('Erreur lors de la récupération de la blague:', error.message);
      
      // Message d'erreur sympa
      const errorMessages = [
        '😅 Oups! Je n\'ai pas pu trouver de blague pour le moment. Réessaye plus tard!',
        '🤔 Désolé, mon API de blagues prend une pause. Réessaye!',
        '😬 La blague a disparu! Essaye encore!'
      ];
      
      const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      await sock.sendMessage(sender, { text: randomError });
    }
  }
};
