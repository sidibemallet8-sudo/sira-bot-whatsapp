# Configuration du Bot SIRA

## Variables d'environnement (Optionnel)

Créez un fichier `.env` à la racine du projet pour configurer :

```
# Numéro du propriétaire du bot
OWNER_NUMBER=+33612345678

# Prefix des commandes (par défaut: !)
BOT_PREFIX=!

# Mode debug (true/false)
DEBUG=true

# Port pour les webhooks (optionnel)
PORT=3000
```

## Charger les variables d'environnement

Pour utiliser les variables d'environnement, installez `dotenv`:

```bash
npm install dotenv
```

Puis modifiez `index.js`:

```javascript
require('dotenv').config();

// Utiliser les variables:
// process.env.OWNER_NUMBER
// process.env.BOT_PREFIX
// process.env.DEBUG
```

## Configuration avancée

### Logs personnalisés

Modifiez les paramètres du logger dans `index.js`:

```javascript
const logger = pino({
  transport: { 
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname'
    }
  }
});
```

### Baileys Options

Vous pouvez personnaliser les options de Baileys:

```javascript
const sock = makeWASocket({
  auth: state,
  logger: logger,
  printQRInTerminal: true,
  syncFullHistory: false,           // Synchroniser l'historique
  markOnlineOnConnect: true,        // Marquer en ligne à la connexion
  browser: ['Ubuntu', 'Chrome', '120.0.6099.129'], // Identité du navigateur
  version: [2, 2423, 51],           // Version WhatsApp
  retryRequestDelayMs: 10,          // Délai de retry
  transactionTimeout: 60000,        // Timeout des transactions
});
```

## Sécurité

### Protéger les données d'authentification

- **Ne pas committer** le dossier `auth_info_baileys/` sur GitHub
- Utilisez `.gitignore` pour l'exclure
- Gardez vos fichiers sécurisés

### Valider les commandes

Ajoutez des vérifications dans vos commandes:

```javascript
// Vérifier si c'est un message privé
if (isGroup) {
  return; // Ne fonctionne que privé
}

// Vérifier les paramètres
if (args.length < 2) {
  await sock.sendMessage(sender, { text: 'Paramètres manquants' });
  return;
}
```

## Déploiement

### Sur Heroku

1. Créez un compte [Heroku](https://www.heroku.com)
2. Installez Heroku CLI
3. Créez un `Procfile`:
```
worker: npm start
```
4. Déployez:
```bash
heroku create votre-app
git push heroku main
heroku ps:scale worker=1
```

### Sur Railway, Replit, ou d'autres services

Contactez le support du service pour les instructions spécifiques.

---

**Pour plus d'aide, consultez le README.md principal**
