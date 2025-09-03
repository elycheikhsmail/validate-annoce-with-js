import "jsr:@std/dotenv/load";
import { task1 } from "./funcs/task1.ts";
const uri = Deno.env.get("MONGODB_URI") || "";
// Database name 
const dbName = "rim-ebay";
// Collection name
const collectionName = "Annonce";

Deno.serve({
    port: 8000, // Port par défaut, modifiable
}, async (req: Request): Promise<Response> => {
    const url = new URL(req.url)
    console.log("url path", url.pathname)
    // je veux reconnaitre le path 
    if (url.pathname.startsWith("/annonce/validate")) {
        // exécuter l'id depuis l'url
        const annonceId = url.searchParams.get("id");
        if (annonceId) {
            console.log("Exécution de la tâche pour l'annonce ID:", annonceId);
            await task1(uri, dbName, collectionName, annonceId);
        }
    }
    // return new Response("Hello, world!", {
    //     headers: { "Content-Type": "text/plain" },
    // });
    const data = { message: "Hello, world!" };
    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
    });
});

console.log("Serveur démarré sur http://localhost:8000");