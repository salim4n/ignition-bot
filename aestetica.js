import * as use from "@tensorflow-models/universal-sentence-encoder";
import { TableClient } from "@azure/data-tables";
import * as dotenv from "dotenv";
import * as tf from "@tensorflow/tfjs";
dotenv.config();

//Exemple simplifier pour le stockage de vecteurs dans Azure Table Storage
// Configuration d'Azure Table Storage
const connectionString = "your-connection-string";
const tableName = "your-table-name";

if (!connectionString || !tableName) {
	throw new Error("Missing Azure Table Storage configuration");
}

const dataToTable = [
	"Excellence & Raffinement",
	"# Révélez VotreBeauté Naturelle",
	"Une approche exclusive de la chirurgie esthétique où expertise médicale et élégance se rencontrent pour sublimer votre beauté authentique.",
	"Consultation Privée Découvrir nos Soins",
	"15+",
	"Années d'expertise",
	"5k+",
	"Patients satisfaits",
	"100%",
	"Confidentialité",
	"Excellence esthétique",
	"\"L'art de la chirurgie esthétique réside dans la subtilité et l'harmonie des résultats.\"",
	"## L'Excellence au Service de Votre Beauté",
	"Notre expertise et nos accréditations témoignent de notre engagement envers l'excellence et votre satisfaction.",
	"12,000+",
	"Clients Satisfaits",
	"Une confiance renouvelée",
	"15+",
	"Années d'Excellence",
	"Expertise reconnue",
	"100%",
	"Taux de Satisfaction",
	"Service d'exception",
	"5,000+",
	"Procédures",
	"Interventions réussies",
	"### Accréditations & Certifications",
	"Certification Elite",
	"Excellence internationale",
	"ISO 9001:2015",
	"Standards de qualité",
	"SOFCEP",
	"Expertise spécialisée",
	"## Nos Prestations",
	"Une gamme exclusive de soins d'exception, personnalisés selon vos attentes.",
	"### Chirurgie du Visage",
	"Une approche raffinée pour sublimer vos traits naturels avec précision.",
	"Lifting cervico-facial",
	"2-3hPremium",
	"Rhinoplastie",
	"1-2hSignature",
	"Blépharoplastie",
	"1hClassic",
	"### Médecine Esthétique",
	"Des soins non-chirurgicaux innovants pour une beauté préservée.",
	"Injections de luxe",
	"30minPremium",
	"Skincare avancé",
	"45minSignature",
	"Rajeunissement",
	"1hPremium",
	"### Chirurgie du Corps",
	"Une transformation harmonieuse pour révéler votre silhouette idéale.",
	"Liposculpture",
	"2-3hPremium",
	"Body contouring",
	"3hSignature",
	"Lifting corporel",
	"4hPremium",
	"### Soins Exclusifs",
	"Des protocoles sur-mesure associant différentes techniques d'exception.",
	"Luxury full face",
	"2hSignature",
	"Body perfection",
	"3hPremium",
	"Total harmony",
	"4hSignature",
	"Réserver une consultation",
	"![Dr. Sophie Martin - Fondatrice]",
	"## Message de la Fondatrice",
	"\"L'art de la chirurgie esthétique repose sur un équilibre subtil entre expertise médicale et sensibilité artistique. Depuis plus de quinze ans, je m'attache à perfectionner cette alliance pour offrir des résultats d'exception.\"",
	'"Notre approche unique combine l\'excellence des techniques chirurgicales les plus avancées avec une compréhension profonde des aspirations de chaque patient. Nous ne créons pas simplement de la beauté, nous révélons celle qui existe déjà."',
	"\"Dans notre établissement, chaque détail est pensé pour vous offrir une expérience d'exception, de la première consultation jusqu'au suivi post-opératoire. Votre confiance est notre plus précieuse récompense.\"",
	"![Dr. Sophie Martin]",
	"### Dr. Sophie Martin",
	"Chirurgienne Esthétique",
	"Fondatrice",
	"Prendre rendez-vous",
	"## Transformations",
	"Des résultats d'exception, témoins de notre expertise et de notre quête de perfection.",
	"![Rhinoplastie]",
	"Avant",
	"### Rhinoplastie",
	"Harmonisation du profil",
	"Voir le résultat",
	"![Lifting Facial]",
	"Avant",
	"### Lifting Facial",
	"Rajeunissement naturel",
	"Voir le résultat",
	"![Liposuccion]",
	"Après",
	"### Liposuccion",
	"Redéfinition de la silhouette",
	"Voir le résultat",
	"## Témoignages",
	"L'expression de la satisfaction de nos patients, notre plus belle récompense.",
	"“Une expérience exceptionnelle. L'équipe médicale m'a accompagnée tout au long du processus avec professionnalisme et bienveillance. Le résultat est exactement ce que j'espérais.”",
	"![Sophie Laurent]",
	"Sophie Laurent",
	"Rhinoplastie",
	"“Le Dr et son équipe ont su me mettre en confiance dès la première consultation. Le suivi post-opératoire est remarquable. Je me sens rajeunie naturellement.”",
	"![Marie Dubois]",
	"Marie Dubois",
	"Lifting facial",
	"“Un résultat harmonieux qui respecte parfaitement mes proportions. L'attention aux détails et le professionnalisme de l'équipe sont remarquables.”",
	"![Claire Martin]",
	"Claire Martin",
	"Augmentation mammaire",
	"## Questions Fréquentes",
	"Des réponses précises et transparentes à vos interrogations.",
	"Comment se déroule la première consultation ?",
	"La consultation initiale est un moment privilégié d'échange. Durant environ une heure, nous discutons de vos souhaits, analysons vos besoins et établissons ensemble un plan de traitement personnalisé. Une simulation virtuelle peut être réalisée pour certaines interventions.",
	"Quels sont les délais de récupération ?",
	"Les délais varient selon l'intervention : de quelques jours pour les procédures mini-invasives à 2-3 semaines pour les interventions plus importantes. Un protocole post-opératoire détaillé vous est remis, incluant soins spécifiques et recommandations pour une récupération optimale.",
	"Comment est assurée la confidentialité ?",
	"La discrétion et la confidentialité sont au cœur de nos engagements. Nous disposons d'une entrée privée et d'espaces dédiés. Vos données sont strictement protégées, et notre équipe est formée aux plus hauts standards de confidentialité.",
	"Quelles sont vos méthodes de paiement ?",
	"Nous proposons différentes options de paiement adaptées à vos besoins. Un devis détaillé vous est remis lors de la consultation. Nous pouvons également vous accompagner dans la mise en place d'un financement personnalisé si nécessaire.",
	"Une autre question ?",
	"Contactez-nous",
	"## Commencez Votre Transformation",
	"Prenez rendez-vous pour une consultation personnalisée dans notre clinique parisienne",
	"Téléphone",
	"+33 1 23 45 67 89",
	"9h-19h, Lun-Ven",
	"Email",
	"contact@aesthetica.fr",
	"Réponse sous 24h",
	"Adresse",
	"15 rue de la Paix, Paris",
	"Proche Opéra",
	"Horaires",
	"Lun-Sam: 9h-19h",
	"Sur rendez-vous",
	"Demander une consultation",
	"En soumettant ce formulaire, vous acceptez notre politique de confidentialité",
];

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
	for (const data in messages) {
		if (typeof data === "string") {
			console.log("Message est une chaîne de caractères.");
			const vector = await vectorizeMessage(data);
			const partitionKey = data;
			const rowKey = `${data}`;
			await storeVector(partitionKey, rowKey, vector);
			console.log(`Vecteur ${vector} stocké pour la clé ${rowKey}.`);
		}
	}
}
const now = new Date();
await vectorizeAndStoreMessages(dataToTable);
const end = new Date();
const timeTaken = end.getTime() - now.getTime();

const hours = Math.floor(timeTaken / (1000 * 60 * 60));
const minutes = Math.floor((timeTaken % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((timeTaken % (1000 * 60)) / 1000);

console.log(
	`Temps de traitement : ${hours} heures ${minutes} minutes ${seconds} secondes`,
);
