import "jsr:@std/dotenv/load";
import { task1 } from "../funcs/task1.ts"; 
// Connection string for local MongoDB
const uri = Deno.env.get("MONGODB_URI")||"";
//"mongodb://localhost:27017/";

// Database name 
const dbName = "rim-ebay";

// Collection name
const collectionName = "Annonce";

// The specific ID to update
const annonceId = "687f5682b9f671ec9d6ef516";

// Example update data - modify this as needed
await task1(uri, dbName, collectionName,annonceId);

 