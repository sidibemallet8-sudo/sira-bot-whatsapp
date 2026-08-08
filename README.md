# SIRA Bot WhatsApp

Un bot WhatsApp complet et fonctionnel créé avec Baileys et Node.js

## 📋 Table des matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🚀 Installation](#-installation)
- [📖 Commandes](#-commandes)
- [💻 Utilisation](#-utilisation)
- [🛠️ Ajouter une commande](#️-ajouter-une-commande)
- [⚠️ Avertissement](#️-avertissement)

## ✨ Fonctionnalités

- ✅ Bot WhatsApp qui fonctionne en **messages privés** et **groupes**
- ✅ Système de **commandes modulaire** facile à étendre
- ✅ **7+ commandes prédéfinies** prêtes à l'emploi
- ✅ Intégration avec des **APIs externes** (blagues, météo, etc.)
- ✅ Gestion automatique des **erreurs**
- ✅ **Logging en temps réel** des messages
- ✅ Support du **français**

## 🚀 Installation

### Prérequis

- **Node.js** v14+ ([Télécharger](https://nodejs.org/))
- **npm** ou **yarn**
- Un **compte WhatsApp**

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/sidibemallet8-sudo/sira-bot-whatsapp.git
cd sira-bot-whatsapp
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer le bot**
```bash
npm start
```

4. **Scanner le QR Code**
   - Un QR code apparaîtra dans votre terminal
   - Ouvrez WhatsApp sur votre téléphone
   - Allez dans **Paramètres → Appareils liés → Lier un appareil**
   - Scannez le QR code avec votre caméra

5. **Validez !** ✅
   - Une fois connecté, vous verrez le message: **"✅ Bot connecté avec succès !"**

## 📖 Commandes

| Commande | Description | Exemple |
|----------|-------------|---------|
| `!help` | Affiche toutes les commandes | `!help` |
| `!hello` | Salue l'utilisateur | `!hello` |
| `!ping` | Teste la latence du bot | `!ping` |
| `!info` | Affiche les infos du bot | `!info` |
| `!time` | Affiche l'heure actuelle | `!time` |
| `!about` | À propos du bot | `!about` |
| `!joke` | Génère une blague aléatoire | `!joke` |

## 💻 Utilisation

### Envoyer une commande

Envoyez simplement un message WhatsApp au bot avec le prefix `!` :

```
!help
!hello
!ping
!joke
```

### Utilisation en groupes

Le bot fonctionne aussi dans les groupes ! Tapez simplement les commandes dans le groupe :

```
!help    # Affichera l'aide dans le groupe
!joke    # Enverra une blague dans le groupe
```

## 🛠️ Ajouter une commande

### Structure d'une commande

Créez un fichier `commands/macommande.js` :

```javascript
module.exports = {
  name: 'macommande',
  description: 'Description de ma commande',
  async execute(sock, message, args, isGroup) {
    const sender = message.key.remoteJid;
    
    // Votre logique ici
    await sock.sendMessage(sender, { 
      text: 'Réponse du bot!' 
    });
  }
};
```

### Exemple: Commande personnalisée

Créez `commands/calc.js` :

```javascript
module.exports = {
  name: 'calc',
  description: 'Calcule une opération mathématique',
  async execute(sock, message, args, isGroup) {
    const sender = message.key.remoteJid;
    
    if (args.length < 3) {
      await sock.sendMessage(sender, { 
        text: '❌ Utilisez: !calc <nombre1> <opérateur> <nombre2>\nExemple: !calc 5 + 3' 
      });
      return;
    }
    
    const num1 = parseFloat(args[1]);
    const operator = args[2];
    const num2 = parseFloat(args[3]);
    
    let result;
    
    switch(operator) {
      case '+': result = num1 + num2; break;
      case '-': result = num1 - num2; break;
      case '*': result = num1 * num2; break;
      case '/': result = num1 / num2; break;
      default: 
        await sock.sendMessage(sender, { text: '❌ Opérateur invalide (+, -, *, /)' });
        return;
    }
    
    await sock.sendMessage(sender, { 
      text: `🧮 ${num1} ${operator} ${num2} = ${result}` 
    });
  }
};
```

Puis utilisez : `!calc 10 + 5`

## 📁 Structure du Projet

```
sira-bot-whatsapp/
├── index.js                    # 🤖 Fichier principal du bot
├── package.json               # 📦 Dépendances
├── README.md                  # 📖 Documentation
├── .gitignore                 # 🔒 Fichiers ignorés par Git
├── LICENSE                    # ⚖️ Licence MIT
├── commands/                  # 📂 Dossier des commandes
│   ├── help.js               # Affiche l'aide
│   ├── hello.js              # Salue l'utilisateur
│   ├── ping.js               # Teste la connexion
│   ├── info.js               # Infos du bot
│   ├── time.js               # Heure actuelle
│   ├── about.js              # À propos du bot
│   └── joke.js               # Génère une blague
└── auth_info_baileys/        # 🔐 Données d'authentification (auto-créé)
```

## 🔧 Options de démarrage

### Démarrage normal
```bash
npm start
```

### Mode développement (avec rechargement automatique)
```bash
npm run dev
```
*(Nécessite nodemon: `npm install --save-dev nodemon`)*

## 🐛 Dépannage

### "Le QR code ne s'affiche pas"
- Essayez avec un autre terminal
- Utilisez une fenêtre plus large pour voir le QR code
- Assurez-vous que `pino-pretty` est installé

### "Le bot se déconnecte après quelques minutes"
- C'est normal avec WhatsApp Web
- Rescannez le QR code
- Supprimez le dossier `auth_info_baileys/` pour réinitialiser

### "Les commandes ne fonctionnent pas"
- Vérifiez que vous utilisez le prefix `!`
- Assurez-vous que le bot affiche "✅ Bot connecté"
- Les fichiers de commandes doivent être dans le dossier `commands/`

### "Erreur: Cannot find module"
```bash
# Réinstallez toutes les dépendances
rm -rf node_modules package-lock.json
npm install
```

## 📦 Dépendances

| Package | Version | Description |
|---------|---------|-------------|
| `@whiskeysockets/baileys` | ^6.4.0 | Émulateur WhatsApp |
| `pino` | ^8.16.0 | Logger performant |
| `pino-pretty` | ^10.2.0 | Formatage des logs |
| `axios` | ^1.6.0 | Client HTTP |
| `qrcode` | ^1.5.3 | Génération de QR codes |

## ⚠️ Avertissement Important

⚠️ **ATTENTION:** 
- **Baileys est un émulateur WhatsApp non officiel**
- **WhatsApp peut bloquer votre compte** si vous l'utilisez de manière abusive
- **À utiliser à vos propres risques et responsabilités**
- **Respectez les conditions d'utilisation de WhatsApp**
- **N'utilisez pas pour du spam ou des activités malveillantes**

## 🚀 Améliorations Futures

- [ ] Intégration ChatGPT/Claude IA
- [ ] Base de données (MongoDB/Firebase)
- [ ] Système de permissions et rôles
- [ ] Commandes de modération pour groupes
- [ ] Système de points/récompenses
- [ ] Webhooks et notifications
- [ ] Support des médias (images, vidéos)
- [ ] Commandes avancées

## 🤝 Contribution

Vous avez une idée ? Un bug ? Des suggestions ?

1. Créez une **issue** pour rapporter un bug
2. Proposez une **nouvelle fonctionnalité**
3. Soumettez une **pull request**

## 📝 Licence

Ce projet est sous licence **MIT**. Consultez le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Mallet Sidibe** (@sidibemallet8-sudo)

## 🆘 Support

Besoin d'aide ?
- 📖 Consultez la documentation
- 🐛 Créez une [issue GitHub](https://github.com/sidibemallet8-sudo/sira-bot-whatsapp/issues)
- 💬 Posez vos questions

## 📚 Ressources Utiles

- [Baileys GitHub](https://github.com/WhiskeySockets/Baileys)
- [Node.js Documentation](https://nodejs.org/docs/)
- [WhatsApp Web](https://web.whatsapp.com)

---

**Bon développement ! 🚀**

Fait avec ❤️ par **sidibemallet8-sudo**
