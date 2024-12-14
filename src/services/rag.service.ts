import * as use from "@tensorflow-models/universal-sentence-encoder";
import {
	VectorStoreRetriever,
	VectorStoreInterface,
} from "@langchain/core/vectorstores";
import { Document as LangchainDocument } from "@langchain/core/documents";
import { getAllVectorsInTable } from "./azure-table.service";
import * as tf from "@tensorflow/tfjs-node";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

interface Document extends LangchainDocument {
	pageContent: string;
	metadata: {
		category: string;
		timestamp: string;
		id: string;
	};
	vector: number[];
}

const SYSTEM_TEMPLATE = `Tu es l'assistant officiel d'IgnitionAI, une agence spécialisée en intelligence artificielle.

EXPERTISE:
- Fine-tuning de LLMs (GPT, Claude, LLaMA)
- Systèmes RAG pour l'enrichissement des LLMs avec des données propriétaires
- Développement de systèmes multi-agents intelligents
- Chatbots avancés avec compréhension contextuelle

CONSIGNES:
1. Base tes réponses principalement sur les documents fournis
2. Reste factuel et technique quand nécessaire
3. Pour les questions hors contexte, redirige vers le formulaire de contact
4. Ne fais pas de promesses spécifiques sur les délais ou les coûts
5. Si tu n'as pas l'information, suggère un appel de consultation

INFORMATIONS DISPONIBLES:
{context}

QUESTION: {question}

RÉPONSE:`;

class CustomRetriever extends VectorStoreRetriever<VectorStoreInterface> {
	private model: use.UniversalSentenceEncoder | null;
	private documents: Document[];
	public k: number;
	vectorStore: VectorStoreInterface;
	searchType: "similarity" | "mmr";
	private llm: ChatOpenAI;
	private promptTemplate: PromptTemplate;
	private chain: RunnableSequence;

	constructor(k: number = 4) {
		super({
			vectorStore: {} as VectorStoreInterface,
			k: k,
			searchType: "similarity",
		});
		this.model = null;
		this.documents = [];
		this.k = k;
		this.vectorStore = {} as VectorStoreInterface;
		this.searchType = "similarity";

		// Initialiser le modèle de langage et la chaîne de traitement
		this.llm = new ChatOpenAI({
			modelName: "gpt-4o-mini",
			temperature: 0.7,
			apiKey: process.env.OPENAI_API_KEY,
		});

		this.promptTemplate = PromptTemplate.fromTemplate(SYSTEM_TEMPLATE);

		// Créer la chaîne de traitement
		this.chain = RunnableSequence.from([
			{
				context: async (input: { question: string }) => {
					const relevantDocs = await this.getRelevantDocuments(input.question);
					if (!relevantDocs || relevantDocs.length === 0) {
						console.log(
							"Aucun document pertinent trouvé pour la question:",
							input.question,
						);
						return "Aucun document pertinent trouvé.";
					}
					console.log(`${relevantDocs.length} documents pertinents trouvés`);
					return relevantDocs
						.map((doc) => `[${doc.metadata.category}] ${doc.pageContent}`)
						.join("\n\n");
				},
				question: (input: { question: string }) => input.question,
			},
			this.promptTemplate,
			this.llm,
			new StringOutputParser(),
		]);
	}

	_vectorstoreType(): string {
		return "custom";
	}

	async initialize() {
		// Charger le modèle USE
		tf.setBackend("cpu");
		this.model = await use.load();
		console.log("Modèle USE chargé");

		// Charger les documents
		const vectors = await getAllVectorsInTable();
		this.documents = vectors
			.filter((vec) => vec.content && vec.content.trim()) // Only include documents with non-empty content
			.map((vec) => ({
				pageContent: vec.content,
				metadata: {
					category: vec.category,
					timestamp: vec.timestamp,
					id: vec.id,
				},
				vector: vec.vector,
			}));
		console.log(`${this.documents.length} documents chargés`);
	}

	async getRelevantDocuments(query: string): Promise<Document[]> {
		// Verifier si le modèle est initialisé
		tf.setBackend("cpu");
		if (!this.model) {
			throw new Error("Le modèle n'est pas initialisé");
		}

		// Obtenir l'embedding de la requête
		const queryEmbedding = await this.model.embed(query);
		const queryVector = await queryEmbedding.array();

		// Calculer les similarités cosinus avec tous les documents
		const similarities = await Promise.all(
			this.documents.map(async (doc) => {
				const docVector = doc.vector;
				const similarity = this.cosineSimilarity(queryVector[0], docVector);
				return { doc, similarity };
			}),
		);

		// Trier par similarité décroissante et prendre les k premiers
		const topK = similarities
			.sort((a, b) => b.similarity - a.similarity)
			.slice(0, this.k)
			.map((item) => item.doc);

		return topK;
	}

	async getAnswer(query: string): Promise<string> {
		const answer = await this.chain.invoke({
			question: query,
		});
		return answer;
	}

	private cosineSimilarity(vectorA: number[], vectorB: number[]): number {
		const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
		const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
		const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
		return dotProduct / (magnitudeA * magnitudeB);
	}
}

// Instance unique du retrieveur pour réutiliser le modèle chargé
let retrieverInstance: CustomRetriever | null = null;

export async function searchSimilarDocuments(query: string, k: number = 4) {
	if (!retrieverInstance) {
		retrieverInstance = new CustomRetriever(k);
		await retrieverInstance.initialize();
	}
	return await retrieverInstance.getRelevantDocuments(query);
}

export async function getAnswer(query: string) {
	if (!retrieverInstance) {
		retrieverInstance = new CustomRetriever();
		await retrieverInstance.initialize();
	}
	return await retrieverInstance.getAnswer(query);
}
