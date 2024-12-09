import express, { Express, Request, Response } from "express";
import { getAllVectorsInTable } from "./services/azure-table.service";
import { getAnswer } from "./services/rag.service";
import * as dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = 3000;

app.use(express.json());

// Get all vectors
app.get("/vectors", async (req: Request, res: Response) => {
    try {
        const entities = await getAllVectorsInTable();
        res.json(entities);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Search and get natural language response
app.post("/search", async (req: Request, res: Response) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ error: "Query is required" });
        }

        const answer = await getAnswer(query);
        res.json({ answer });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
