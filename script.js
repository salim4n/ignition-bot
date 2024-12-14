import * as use from "@tensorflow-models/universal-sentence-encoder";
import { TableClient } from "@azure/data-tables";
import * as dotenv from "dotenv";
import * as tf from "@tensorflow/tfjs";
dotenv.config();

// Configuration d'Azure Table Storage
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const tableName = process.env.AZURE_STORAGE_TABLE_NAME || "";

if (!connectionString || !tableName) {
	throw new Error("Missing Azure Table Storage configuration");
}

const messages = {
	en: {
		nav: {
			services: "Services",
			features: "Features",
			contact: "Contact",
			getStarted: "Start Your Project",
		},
		vectorDb: {
			title: "Vector Database Demo",
			demo: "Try Vector DB",
			howItWorks:
				"This demo shows how vector databases work using TensorFlow.js and the Universal Sentence Encoder",
			desc: "Enter a sentence in the input field below and add it to the vector database. Then, find similar sentences using the 'Find Similar' button",
			addText: "Add to Database",
			searchSimilar: "Find Similar",
		},
		hero: {
			title: "Ignite Your AI Potential",
			subtitle:
				"We turn your data into competitive advantage through cutting-edge AI. Specializing in LLMs and intelligent systems, we bring your most ambitious projects to life",
			getStarted: "Start Your Project",
			learnMore: "Learn More",
		},
		services: {
			title: "Our Services",
			rag: {
				title: "Enterprise RAG Systems",
				description:
					"Advanced Retrieval-Augmented Generation systems that seamlessly integrate your proprietary data with state-of-the-art language models",
				details: [
					"Custom data source connectors",
					"Semantic search optimization",
					"Automated document processing pipeline",
					"High-availability architecture",
				],
				benefits: [
					"85%+ increase in response accuracy",
					"Immediate knowledge base valorization",
					"Near-zero hallucination rate",
					"Real-time business context maintenance",
				],
			},
			chatbots: {
				title: "Advanced Conversational Agents",
				description:
					"Next-generation LLM-powered chatbots with deep contextual understanding and enterprise-grade capabilities",
				details: [
					"Multi-channel deployment (Web, Mobile, API)",
					"Advanced tone and personality customization",
					"Native multilingual capabilities",
					"Real-time behavioral analytics",
				],
				benefits: [
					"70% reduction in support costs",
					"40% improvement in CSAT scores",
					"24/7 scalable customer support",
					"Automated customer insight generation",
				],
			},
			llm: {
				title: "Enterprise LLM Solutions",
				description:
					"Custom-built large language model implementations leveraging GPT-4, Claude, and LLaMA to solve your specific business challenges",
				details: [
					"Industry-specific model fine-tuning",
					"Optimized inference costs and latency",
					"Secure enterprise integration",
					"Continuous performance monitoring",
				],
				benefits: [
					"40-60% reduction in operational costs",
					"Automated complex document processing",
					"Accelerated time-to-market",
					"GDPR-compliant data handling",
				],
			},
			agents: {
				title: "Intelligent Multi-Agent Systems",
				description:
					"Self-orchestrating AI agents powered by LangChain and AutoGPT for complex business process automation",
				details: [
					"LangChain/AutoGPT architecture",
					"Self-optimizing workflows",
					"Enterprise API integration",
					"Real-time performance monitoring",
				],
				benefits: [
					"End-to-end process automation",
					"80% reduction in manual tasks",
					"Audited autonomous decision-making",
					"Unlimited operational scaling",
				],
			},
		},
		features: {
			title: "Why Choose ",
			fast: {
				title: "Production-Ready",
				description:
					"From prototype to production in weeks, not months. Built on proven frameworks with scalable architecture.",
			},
			scalable: {
				title: "Cost-Efficient",
				description:
					"Optimized inference costs and resource usage. Pay only for what you need as you grow.",
			},
			secure: {
				title: "Enterprise-Grade",
				description:
					"GDPR-compliant implementations with data security at the core of our solutions.",
			},
		},
		cta: {
			title: "Ready to Enhance Your Business with AI?",
			subtitle:
				"Book a technical consultation to discuss your project with our AI engineers",
			button: "Schedule Technical Call",
		},
		contact: {
			firstName: "First Name",
			firstNamePlaceholder: "John",
			lastName: "Last Name",
			lastNamePlaceholder: "Doe",
			email: "Email",
			emailPlaceholder: "john.doe@company.com",
			phone: "Phone (optional)",
			phonePlaceholder: "+1 (555) 123-4567",
			company: "Company",
			companyPlaceholder: "Your Company Name",
			message: "Message",
			messagePlaceholder: "Tell us about your project...",
			submit: "Send Message",
			success: "Thank you! We'll get back to you soon",
		},
		footer: {
			tagline: "Empowering businesses with intelligent AI solutions",
			services: "Services",
			company: "Company",
			connect: "Connect",
			about: "About Us",
			contact: "Contact",
		},
		about: {
			title: "About Us",
			missionTitle: "Our Mission",
			expertiseTitle: "Our Expertise",
			approachTitle: "Our Approach",
			getInTouch: "Get in touch",
			description:
				"Specialized AI consultancy focused on practical business applications of language models and intelligent systems. TensorFlow certified developers with experience in enterprise LLM deployments.",
			mission:
				"We bridge the gap between cutting-edge AI technology and business needs through practical, production-ready solutions.",
			expertise:
				"Our team combines deep technical expertise in LLMs, RAG systems, and multi-agent architectures with real-world implementation experience.",
			approach:
				"We focus on delivering measurable business value through carefully architected AI solutions that are secure, scalable, and cost-effective.",
		},
		resources: {
			title: "Technical Resources",
			subtitle: "Practical guides and documentation for AI developers",
			blog: {
				title: "Developer Documentation",
				description:
					"Detailed technical guides and best practices for AI implementation",
				categories: [
					"LLM Integration Guides",
					"RAG System Architecture",
					"Agent Development",
					"Production Deployment",
				],
				cta: "Access Documentation",
			},
			learning: {
				title: "Learning Path",
				sections: [
					{
						title: "LLM Fundamentals",
						topics: [
							"Model Types and Capabilities",
							"Prompt Engineering",
							"Fine-tuning Strategies",
						],
					},
					{
						title: "RAG Implementation",
						topics: [
							"Vector Databases",
							"Embedding Models",
							"Retrieval Optimization",
						],
					},
					{
						title: "Production Best Practices",
						topics: [
							"Security Considerations",
							"Cost Optimization",
							"Performance Monitoring",
						],
					},
				],
			},
		},
	},
	fr: {
		nav: {
			services: "Services",
			features: "Fonctionnalités",
			contact: "Contact",
			getStarted: "Démarrer Votre Projet",
		},
		vectorDb: {
			title: "Démo Base de Données Vectorielle",
			demo: "Essayer la BD Vectorielle",
			howItWorks:
				"Cette démo montre comment fonctionnent les bases de données vectorielles en utilisant TensorFlow.js et l'Universal Sentence Encoder",
			desc: "Entrez une phrase dans le champ ci-dessous et ajoutez-la à la base de données vectorielle. Ensuite, trouvez des phrases similaires en utilisant le bouton 'Rechercher Similaires'",
			addText: "Ajouter à la Base",
			searchSimilar: "Rechercher Similaires",
		},
		hero: {
			title: "Libérez votre Potentiel IA",
			subtitle:
				"Nous transformons vos données en avantage compétitif grâce à l'IA de pointe. Spécialistes des LLMs et systèmes intelligents, nous concrétisons vos projets les plus ambitieux",
			getStarted: "Démarrer Votre Projet",
			learnMore: "En savoir plus",
		},
		services: {
			title: "Nos Services",
			rag: {
				title: "Systèmes RAG Entreprise",
				description:
					"Systèmes avancés de génération augmentée par récupération intégrant harmonieusement vos données propriétaires aux modèles de langage dernière génération",
				details: [
					"Connecteurs personnalisés pour vos sources de données",
					"Optimisation de la recherche sémantique",
					"Pipeline automatisé de traitement documentaire",
					"Architecture haute disponibilité",
				],
				benefits: [
					"Augmentation de 85%+ de la précision des réponses",
					"Valorisation immédiate des bases de connaissances",
					"Taux d'hallucination quasi-nul",
					"Maintenance en temps réel du contexte métier",
				],
			},
			chatbots: {
				title: "Agents Conversationnels Avancés",
				description:
					"Chatbots nouvelle génération basés sur les LLMs avec compréhension contextuelle approfondie et fonctionnalités entreprise",
				details: [
					"Déploiement multi-canal (Web, Mobile, API)",
					"Personnalisation avancée du ton et du style",
					"Capacités multilingues natives",
					"Analyse comportementale en temps réel",
				],
				benefits: [
					"Réduction de 70% des coûts de support",
					"Amélioration de 40% du score CSAT",
					"Support client 24/7 évolutif",
					"Génération automatisée d'insights clients",
				],
			},
			llm: {
				title: "Solutions LLM Entreprise",
				description:
					"Implémentations personnalisées de modèles de langage exploitant GPT-4, Claude et LLaMA pour répondre à vos défis métier",
				details: [
					"Fine-tuning adapté à votre secteur",
					"Optimisation des coûts d'inférence et de latence",
					"Intégration sécurisée en entreprise",
					"Surveillance continue des performances",
				],
				benefits: [
					"Réduction de 40-60% des coûts opérationnels",
					"Automatisation du traitement documentaire complexe",
					"Mise sur le marché accélérée",
					"Traitement des données conforme au RGPD",
				],
			},
			agents: {
				title: "Systèmes Multi-Agents Intelligents",
				description:
					"Agents IA auto-orchestrés propulsés par LangChain et AutoGPT pour l'automatisation des processus métier complexes",
				details: [
					"Architecture LangChain/AutoGPT",
					"Workflows auto-optimisants",
					"Intégration API entreprise",
					"Monitoring des performances en temps réel",
				],
				benefits: [
					"Automatisation complète des processus",
					"Réduction de 80% des tâches manuelles",
					"Prise de décision autonome auditée",
					"Scalabilité opérationnelle illimitée",
				],
			},
		},
		features: {
			title: "Pourquoi Choisir ",
			fast: {
				title: "Ultra Rapide",
				description:
					"Déploiement rapide et traitement en temps réel pour des résultats immédiats",
			},
			scalable: {
				title: "Évolutif",
				description: "Des solutions qui évoluent avec vos besoins",
			},
			secure: {
				title: "Sécurisé",
				description: "Sécurité de niveau entreprise pour vos données sensibles",
			},
		},
		cta: {
			title: "Prêt à Améliorer Votre Entreprise avec l'IA ?",
			subtitle:
				"Réservez une consultation technique pour discuter de votre projet avec nos ingénieurs IA",
			button: "Planifier un Appel Technique",
		},
		contact: {
			firstName: "Prénom",
			firstNamePlaceholder: "Jean",
			lastName: "Nom",
			lastNamePlaceholder: "Dupont",
			email: "Email",
			emailPlaceholder: "jean.dupont@entreprise.com",
			phone: "Téléphone (facultatif)",
			phonePlaceholder: "+33 6 12 34 56 78",
			company: "Entreprise",
			companyPlaceholder: "Nom de votre entreprise",
			message: "Message",
			messagePlaceholder: "Parlez-nous de votre projet...",
			submit: "Envoyer le message",
			success: "Merci ! Nous vous recontacterons bientôt",
		},
		footer: {
			tagline:
				"Autonomiser les entreprises avec des solutions IA intelligentes",
			services: "Services",
			company: "Entreprise",
			connect: "Connexion",
			about: "À Propos",
			contact: "Contact",
		},
		about: {
			title: "À propos",
			missionTitle: "Notre Mission",
			expertiseTitle: "Notre Expertise",
			approachTitle: "Notre Approche",
			getInTouch: "Contactez-nous",
			description:
				"Cabinet de conseil spécialisé en IA focalisé sur les applications métier pratiques des modèles de langage et systèmes intelligents. Développeurs certifiés TensorFlow avec expérience en déploiement LLM entreprise.",
			mission:
				"Nous comblons le fossé entre la technologie IA de pointe et les besoins métier par des solutions pratiques et prêtes pour la production.",
			expertise:
				"Notre équipe combine une expertise technique pointue en LLMs, systèmes RAG et architectures multi-agents avec une expérience concrète d'implémentation.",
			approach:
				"Nous nous concentrons sur la création de valeur mesurable à travers des solutions IA soigneusement architecturées, sécurisées, évolutives et rentables.",
		},
		resources: {
			title: "Ressources Techniques",
			subtitle: "Guides pratiques et documentation pour développeurs IA",
			blog: {
				title: "Documentation Développeur",
				description:
					"Guides techniques détaillés et bonnes pratiques pour l'implémentation IA",
				categories: [
					"Guides d'Intégration LLM",
					"Architecture Système RAG",
					"Développement d'Agents",
					"Déploiement en Production",
				],
				cta: "Accéder à la Documentation",
			},
			learning: {
				title: "Parcours d'Apprentissage",
				sections: [
					{
						title: "Fondamentaux LLM",
						topics: [
							"Types et Capacités des Modèles",
							"Ingénierie de Prompts",
							"Stratégies de Fine-tuning",
						],
					},
					{
						title: "Implémentation RAG",
						topics: [
							"Bases de Données Vectorielles",
							"Modèles d'Embedding",
							"Optimisation de la Récupération",
						],
					},
					{
						title: "Bonnes Pratiques Production",
						topics: [
							"Considérations de Sécurité",
							"Optimisation des Coûts",
							"Monitoring des Performances",
						],
					},
				],
			},
		},
	},
};

const tableClient = TableClient.fromConnectionString(
	connectionString,
	tableName,
);
await tf.setBackend("cpu");
console.log("Backend défini sur CPU.");
console.log(tf.getBackend());

const model = await use.load();
console.log("Model chargé.");
// Fonction pour vectoriser un message
async function vectorizeMessage(message) {
	const embeddings = await model.embed([message]);
	return embeddings.arraySync()[0];
}

// Fonction pour stocker un vecteur dans Azure Table Storage
async function storeVector(partitionKey, rowKey, vector) {
	const entity = {
		partitionKey: partitionKey,
		rowKey: rowKey,
		vector: vector.toString(), // Convertir le vecteur en chaîne de caractères
	};

	await tableClient.createEntity(entity);
	console.log(`Entity ${entity.rowKey} created.`);
	console.log(`Vector ${entity.vector} stored.`);
}

// Fonction pour vectoriser et stocker tous les messages
export async function vectorizeAndStoreMessages(messages) {
	console.log("Vectorisation des messages en cours...");
	for (const lang in messages) {
		console.log(`Langage ${lang} en cours...`);
		for (const section in messages[lang]) {
			console.log(`Section ${section} en cours...`);
			for (const key in messages[lang][section]) {
				console.log(`Clé ${key} en cours...`);
				const message = messages[lang][section][key];
				if (typeof message === "string") {
					console.log("Message est une chaîne de caractères.");
					const vector = await vectorizeMessage(message);
					const partitionKey = lang;
					const rowKey = `${section}_${key}`;
					await storeVector(partitionKey, rowKey, vector);
					console.log(`Vecteur ${vector} stocké pour la clé ${rowKey}.`);
				} else if (typeof message === "object") {
					console.log("Message est un objet.");
					for (const subKey in message) {
						console.log(`Clé ${subKey} en cours...`);
						const subMessage = message[subKey];
						if (typeof subMessage === "string") {
							console.log("Message est une chaîne de caractères.");
							const vector = await vectorizeMessage(subMessage);
							console.log(`Vecteur ${vector} vectorisé pour la clé ${subKey}.`);
							const partitionKey = lang;
							const rowKey = `${section}_${key}_${subKey}`;
							await storeVector(partitionKey, rowKey, vector);
							console.log(`Vecteur ${vector} stocké pour la clé ${rowKey}.`);
						}
					}
				}
			}
		}
	}
}
const now = new Date();
await vectorizeAndStoreMessages(messages);
const end = new Date();
const timeTaken = end.getTime() - now.getTime();

const hours = Math.floor(timeTaken / (1000 * 60 * 60));
const minutes = Math.floor((timeTaken % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((timeTaken % (1000 * 60)) / 1000);

console.log(
	`Temps de traitement : ${hours} heures ${minutes} minutes ${seconds} secondes`,
);
