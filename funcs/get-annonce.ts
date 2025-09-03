 import { MongoClient, ObjectId } from "npm:mongodb";


// Async function to connect and retrieve the specific document
export async function getAnnonceById(
  uri:string, dbName:string, collectionName:string,
  annonceId:string) { 
  // Create a new MongoClient
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected successfully to MongoDB server");

    // Select the database
    const db = client.db(dbName);

    // Select the collection
    const collection = db.collection(collectionName);

    // Find the document by _id
    const document = await collection.findOne({ _id: new ObjectId(annonceId) });

    if (document) {
      console.log("Retrieved document:"); 
     console.log(document.description);
     const description=String(document.description);
     if(!description){
      console.log("No description found in the document.");
      return;
     }
     return description;
   
    } else {
      console.log("No document found with the given ID.");
      return
    }

  } catch (error) {
    console.error("Error connecting to MongoDB or fetching data:", error);
  } finally {
    // Close the connection
    await client.close();
    console.log("Connection closed");
  }
}

