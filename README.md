# 🤖 SIRA Bot WhatsApp

Un bot WhatsApp intelligent construit avec **Baileys** et **Node.js** qui répond à des commandes en messages privés et groupes.

## ✨ Fonctionnalités

- ✅ Réponse aux commandes (avec prefix `!`)
- ✅ Support des messages privés
- ✅ Support des groupes
- ✅ Système de commandes modulaire et extensible
- ✅ Commandes prédéfinies (help, hello, ping, info, time, about, joke)
- ✅ Facile à personnaliser
- ✅ Intégration avec des APIs externes

## 🚀 Installation

### Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- Un compte WhatsApp

### Étapes

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
   - Un QR code s'affichera dans le terminal
   - Ouvrez WhatsApp sur votre téléphone
   - Allez dans Paramètres → Appareils liés → Lier un appareil
   - Scannez le QR code avec votre téléphone

5. **C'est prêt ! 🎉**

## 📋 Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `!help` | Affiche la liste des commandes |
| `!hello` | Salue l'utilisateur |
| `!ping` | Teste la connexion du bot |
| `!info` | Affiche les infos du bot |
| `!time` | Affiche l'heure actuelle |
| `!about` | À propos du bot |
| `!joke` | Génère une blague aléatoire |

## 💻 Comment Utiliser

### Utiliser une commande existante
Envoyez un message WhatsApp au bot:
```
!help
!hello
!ping
!joke
```

### Créer une nouvelle commande

1. Créez un fichier dans le dossier `commands/` (ex: `commands/mycommand.js`)

2. Voici la structure d'une commande:
```javascript
module.exports = {
  name: 'mycommand',
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

3. C'est tout ! Le bot chargera automatiquement votre commande au démarrage.

## 📁 Structure du Projet

```
sira-bot-whatsapp/
├── index.js                 # Fichier principal du bot
├── package.json            # Dépendances du projet
├── .gitignore              # Fichiers à ignorer par Git
├── README.md               # Ce fichier
├── commands/               # Dossier des commandes
│   ├── help.js
│   ├── hello.js
│   ├── ping.js
│   ├── info.js
│   ├── time.js
│   ├── about.js
│   └── joke.js
└── auth_info_baileys/      # Dossier d'authentification (créé automatiquement)
```

## 🔧 Configuration

### Variables d'environnement (optionnel)

Créez un fichier `.env`:
```
OWNER_NUMBER=+33612345678
BOT_PREFIX=!
```

## 🐛 Dépannage

### Le QR code ne s'affiche pas
- Assurez-vous que votre terminal supporte les QR codes
- Essayez avec un autre terminal

### Le bot se déconnecte
- C'est normal, il faut rescanner le QR code
- Le dossier `auth_info_baileys/` peut être supprimé pour réinitialiser

### Les commandes ne fonctionnent pas
- Assurez-vous d'utiliser le prefix `!` (ex: `!help`)
- Vérifiez que le bot est connecté (look for ✅ in terminal)

## ⚠️ Avertissement Important

- **Baileys est un émulateur WhatsApp non officiel**
- WhatsApp peut bloquer votre compte si vous l'utilisez de manière abusive
- À utiliser à vos propres risques
- Respectez les conditions d'utilisation de WhatsApp

## 📈 Améliorations Futures

- [ ] Intégration avec ChatGPT/Claude
- [ ] Base de données
- [ ] Système de permissions
- [ ] Commandes de modération pour les groupes
- [ ] Système de points/récompenses
- [ ] Et bien d'autres...

## 🤝 Contribution

Les contributions sont bienvenues ! N'hésitez pas à:
- Créer des issues pour les bugs
- Proposer des nouvelles fonctionnalités
- Soumettre des pull requests

## 📝 Licence

Ce projet est sous licence **MIT**. Voir le fichier LICENSE pour plus de détails.

## 👨‍💻 Auteur

**sidibemallet8-sudo**

## 🆘 Support

Si vous avez des questions ou des problèmes, créez une issue sur GitHub!

---

**Bon développement ! 🚀**
