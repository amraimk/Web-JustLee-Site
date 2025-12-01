import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { getConnection } from "./oracle.js";

import bookRouter from "./routes/book.js";
import authorRouter from "./routes/author.js";
import customerRouter from "./routes/customer.js";
import adminRouter from "./routes/admin.js";

dotenv.config({ path: path.resolve('../server/.env') });

const app = express();
app.use(cors());
app.use(express.json());

//Check database connection 
app.get("/api/test-db", async (req, res) => { 
    try { 
        const connection = await getConnection(); 
        const result = await connection.execute("SELECT 'Connected to Oracle!' AS message FROM dual"); 
        await connection.close(); 
        res.json(result.rows); 
        console.log("Database connection successful.");
    } catch (err)
    { 
        res.status(500).json({ error: err.message }); 
    } 
});

app.use("/api/book", bookRouter);
app.use("/api/author", authorRouter);
app.use("/api/customer", customerRouter);
app.use("/api/admin", adminRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
