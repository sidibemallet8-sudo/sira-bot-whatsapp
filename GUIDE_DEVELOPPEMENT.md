# Guide de Développement - SIRA Bot

## 🎯 Objectif

Ce guide explique comment développer et étendre le bot SIRA avec de nouvelles fonctionnalités.

## 📚 Table des matières

1. [Architecture du bot](#architecture-du-bot)
2. [Créer une commande](#créer-une-commande)
3. [API Baileys](#api-baileys)
4. [Appeler des APIs externes](#appeler-des-apis-externes)
5. [Gestion des erreurs](#gestion-des-erreurs)
6. [Base de données](#base-de-données)
7. [Déploiement](#déploiement)

## Architecture du bot

### Flux d'exécution

```
WhatsApp -> Baileys -> index.js -> Parser de commande -> Exécution de la commande
                                                              ↓
                                                         Réponse -> WhatsApp
```

### Structure des fichiers

- `index.js` : Charge automatiquement les commandes du dossier `commands/`
- `commands/` : Chaque fichier = une commande
- `auth_info_baileys/` : Données d'authentification (auto-généré)

## Créer une commande

### Template basique

```javascript
module.exports = {
  name: 'mycommand',           // Nom de la commande (sans prefix !)
  description: 'Ma description', // Description
  async execute(sock, message, args, isGroup) {
    const sender = message.key.remoteJid;  // Numéro/ID du sender
    
    // Votre logique ici
    await sock.sendMessage(sender, { text: 'Réponse!' });
  }
};
```

### Paramètres disponibles

- `sock` : Socket Baileys (pour envoyer/recevoir des messages)
- `message` : Objet du message reçu
- `args` : Tableau des arguments (ex: `['!calc', '5', '+', '3']`)
- `isGroup` : Boolean (true si message en groupe)

### Exemple: Commande avec arguments

**Fichier:** `commands/add.js`

```javascript
module.exports = {
  name: 'add',
  description: 'Additionne deux nombres',
  async execute(sock, message, args, isGroup) {
    const sender = message.key.remoteJid;
    
    // Vérifier les arguments
    if (args.length < 3) {
      await sock.sendMessage(sender, { 
        text: '❌ Syntaxe: !add <nombre1> <nombre2>\nExemple: !add 5 10' 
      });
      return;
    }
    
    const num1 = parseFloat(args[1]);
    const num2 = parseFloat(args[2]);
    
    if (isNaN(num1) || isNaN(num2)) {
      await sock.sendMessage(sender, { text: '❌ Les arguments doivent être des nombres' });
      return;
    }
    
    const result = num1 + num2;
    await sock.sendMessage(sender, { text: `✅ ${num1} + ${num2} = ${result}` });
  }
};
```

Utilisation: `!add 5 10`

## API Baileys

### Envoyer un message texte

```javascript
await sock.sendMessage(sender, { 
  text: 'Coucou!' 
});
```

### Envoyer une image

```javascript
const fs = require('fs');
await sock.sendMessage(sender, {
  image: fs.readFileSync('path/to/image.jpg'),
  caption: 'Ceci est une image'
});
```

### Envoyer un document

```javascript
await sock.sendMessage(sender, {
  document: fs.readFileSync('path/to/file.pdf'),
  fileName: 'document.pdf',
  mimetype: 'application/pdf'
});
```

### Envoyer un audio

```javascript
await sock.sendMessage(sender, {
  audio: fs.readFileSync('path/to/audio.mp3'),
  mimetype: 'audio/mpeg'
});
```

### Envoyer un message avec boutons (Variante TextMessage)

```javascript
await sock.sendMessage(sender, {
  text: 'Choisissez une option:',
  footer: 'SIRA Bot',
  buttons: [
    { buttonId: 'id1', buttonText: { displayText: 'Option 1' }, type: 1 },
    { buttonId: 'id2', buttonText: { displayText: 'Option 2' }, type: 1 }
  ],
  headerType: 1
});
```

### Récupérer les informations du groupe

```javascript
const groupMetadata = await sock.groupMetadata(sender);
console.log(groupMetadata.subject); // Nom du groupe
console.log(groupMetadata.participants); // Participants
```

### Réagir à un message

```javascript
await sock.sendMessage(sender, {
  react: { text: '👍', key: message.key }
});
```

## Appeler des APIs externes

### Utiliser Axios (déjà installé)

```javascript
const axios = require('axios');

// Appel GET
const response = await axios.get('https://api.example.com/data');
console.log(response.data);

// Appel POST
const result = await axios.post('https://api.example.com/post', {
  key: 'value'
});
```

### Exemple: Météo

**Fichier:** `commands/weather.js`

```javascript
const axios = require('axios');

module.exports = {
  name: 'weather',
  description: 'Affiche la météo',
  async execute(sock, message, args, isGroup) {
    const sender = message.key.remoteJid;
    
    if (args.length < 2) {
      await sock.sendMessage(sender, { text: '❌ Utilisez: !weather <ville>' });
      return;
    }
    
    const city = args.slice(1).join(' ');
    
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=YOUR_API_KEY`
      );
      
      const data = response.data;
      const text = `
🌍 Météo de ${data.name}:
🌡️ Température: ${data.main.temp}°C
💨 Vent: ${data.wind.speed} km/h
☁️ Conditions: ${data.weather[0].description}
      `;
      
      await sock.sendMessage(sender, { text });
    } catch (error) {
      await sock.sendMessage(sender, { text: '❌ Ville non trouvée' });
    }
  }
};
```

## Gestion des erreurs

### Try-Catch

```javascript
try {
  // Code qui pourrait échouer
  const data = await fetchData();
} catch (error) {
  console.error('Erreur:', error.message);
  await sock.sendMessage(sender, { text: '❌ Une erreur est survenue' });
}
```

### Valider les entrées

```javascript
// Vérifier la longueur
if (args.length < 3) {
  await sock.sendMessage(sender, { text: '❌ Pas assez d\'arguments' });
  return;
}

// Vérifier le type
const num = parseFloat(args[1]);
if (isNaN(num)) {
  await sock.sendMessage(sender, { text: '❌ Doit être un nombre' });
  return;
}

// Vérifier un intervalle
if (num < 0 || num > 100) {
  await sock.sendMessage(sender, { text: '❌ Doit être entre 0 et 100' });
  return;
}
```

## Base de données

### Utiliser MongoDB

Installez:
```bash
npm install mongoose
```

Créez `models/user.js`:

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: String,
  name: String,
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
```

Utilisez dans une commande:

```javascript
const User = require('../models/user');

module.exports = {
  name: 'profile',
  async execute(sock, message, args, isGroup) {
    const sender = message.key.remoteJid;
    
    // Chercher l'utilisateur
    let user = await User.findOne({ phoneNumber: sender });
    
    if (!user) {
      // Créer un nouvel utilisateur
      user = await User.create({
        phoneNumber: sender,
        name: 'New User'
      });
    }
    
    await sock.sendMessage(sender, { 
      text: `Vos points: ${user.points}` 
    });
  }
};
```

## Déploiement

### Sur Heroku

```bash
# Installer Heroku CLI
# Créer un app
heroku create nom-du-bot

# Créer Procfile
echo "worker: npm start" > Procfile

# Déployer
git push heroku main

# Voir les logs
heroku logs --tail
```

### Sur Railway

1. Connectez votre repo GitHub
2. Sélectionnez ce repository
3. Railway déployera automatiquement

### En local (24/7)

Pour garder le bot en ligne h24, utilisez des services comme:
- [Uptime Robot](https://uptimerobot.com) (pour ping le bot)
- [screen](https://linux.die.net/man/1/screen) (sur Linux/Mac)
- [PM2](https://pm2.keymetrics.io/) (gestionnaire de processus)

Avec PM2:

```bash
npm install -g pm2
pm2 start index.js --name "sira-bot"
pm2 startup
pm2 save
```

---

**Besoin d'aide ? Créez une issue sur GitHub !** 🚀
