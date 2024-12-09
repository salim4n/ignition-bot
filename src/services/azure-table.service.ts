import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";
import * as dotenv from "dotenv";

dotenv.config();

interface VectorEntity {
    partitionKey: string;
    rowKey: string;
    timestamp: string;
    vector: string;
    content: string;
    etag: string;
}

interface FormattedVectorEntity {
    id: string;
    category: string;
    timestamp: string;
    vector: number[];
    content: string;
}

// Configuration d'Azure Table Storage
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const tableName = process.env.AZURE_STORAGE_TABLE_NAME || "";

if (!connectionString || !tableName) {
	throw new Error("Missing Azure Table Storage configuration");
}

console.log("connectionString", connectionString);
console.log("tableName", tableName);

const tableClient = TableClient.fromConnectionString(connectionString, tableName);

export async function getAllVectorsInTable() {
    try {
        const entities: FormattedVectorEntity[] = [];
        const iterator = tableClient.listEntities<VectorEntity>();
        
        for await (const entity of iterator) {
            // Convertir la chaîne de vecteurs en tableau de nombres
            const vectorArray = entity.vector.split(',').map(num => parseFloat(num));
            
            entities.push({
                id: entity.rowKey,
                category: entity.partitionKey,
                timestamp: entity.timestamp,
                vector: vectorArray,
                content: entity.content || entity.rowKey // Fallback to rowKey if content is not available
            });
        }
        
        return entities;
    } catch (error) {
        console.error("Error fetching entities:", error);
        throw error;
    }
}
