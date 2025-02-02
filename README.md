# Microservice pour Bot Intelligent avec OpenAI

Ce projet est un microservice basé sur Express et TypeScript, intégrant LangChain, TensorFlow.js, Azure Table Storage, et Telegram. Il permet de créer un bot intelligent en utilisant les capacités de traitement du langage naturel d'OpenAI. Telegram est utilisé uniquement pour surveiller les questions et réponses.

## Fonctionnalités

- **Vectorisation et Stockage**: Deux exemples de scripts (`script.js` et `aestetica.js`) montrent comment envoyer et vectoriser des données sur Azure Table Storage.
- **Récupération et Encodage**: Utilisation de LangChain avec une classe custom retriever pour le RAG (Retrieval-Augmented Generation) avec Sentence Encoder Lite sur le backend TensorFlow.js.
- **API Routes**: Deux routes API sont disponibles :
  - `/search` : Pour interagir avec le bot -> POST
  - `/vectors` : Pour tester la récupération de vecteurs -> GET
- **Surveillance avec Telegram**: Telegram est utilisé pour surveiller les questions et réponses du bot.

## Prérequis

- Node.js
- npm ou yarn
- Compte Azure avec Table Storage configuré
- Clé API OpenAI
- Token et ID de chat Telegram
- Docker (optionnel, pour l'utilisation du Dockerfile)

## Installation

### Créer la table Azure
[![Youtube video](http://img.youtube.com/vi/aZIluap-4mo/0.jpg)](http://www.youtube.com/watch?v=aZIluap-4mo "How to create an azure table on azure")

### Avec Docker

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/votre-projet.git
   cd votre-projet
   ```

2. Créez un fichier `.env` à la racine du projet avec les valeurs suivantes :
   ```env
   AZURE_STORAGE_CONNECTION_STRING="your-connection-string"
   AZURE_STORAGE_TABLE_NAME="your-table-name"
   OPENAI_API_KEY="your-openai-api-key"
   PORT=3002
   BOT_TOKEN="you-bot-token"
   CHAT_ID="your*chat-id"
   ```

3. Construisez et démarrez le conteneur Docker :
   ```bash
   docker build -t votre-projet .
   docker run -p 3002:3002 --env-file .env votre-projet
   ```

### Sans Docker

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/votre-projet.git
   cd votre-projet
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement en créant un fichier `.env` à la racine du projet avec les valeurs suivantes :
   ```env
   AZURE_STORAGE_CONNECTION_STRING="your-connection-string"
   AZURE_STORAGE_TABLE_NAME="your-table-name"
   OPENAI_API_KEY="your-openai-api-key"
   PORT=3002
   BOT_TOKEN="you-bot-token"
   CHAT_ID="your*chat-id"
   ```

4. Démarrez le serveur :
   ```bash
   npm start
   ```

## Utilisation

### Vectorisation et Stockage

Les scripts `script.js` et `aestetica.js` montrent comment envoyer et vectoriser des données sur Azure Table Storage. Vous pouvez les utiliser comme exemples pour vectoriser vos propres données.

### Récupération et Encodage

Le fichier `rag.service.ts` contient la logique pour la récupération et l'encodage des vecteurs. Vous pouvez modifier le système de prompt dans ce fichier pour adapter le comportement du bot à vos besoins.

### API Routes

- **/search**: Utilisez cette route pour interagir avec le bot.
- **/vectors**: Utilisez cette route pour tester la récupération de vecteurs.

### Surveillance avec Telegram

Telegram est utilisé pour surveiller les questions et réponses du bot. Assurez-vous que votre bot Telegram est configuré avec le token et l'ID de chat fournis dans le fichier `.env`.

## Dockerfile

Le Dockerfile est configuré pour construire et exécuter l'application dans un conteneur Docker. Voici son contenu :

```dockerfile
# Use Node.js LTS version as the base image
FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy TypeScript configuration
COPY tsconfig.json ./

# Copy source code
COPY src/ ./src/

# Build TypeScript code
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact

Pour toute question ou suggestion, veuillez contacter [Salim Laimeche](mailto:laimeche160@gmail.com)
