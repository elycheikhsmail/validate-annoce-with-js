import { MongoClient, ObjectId } from "npm:mongodb";
 
// deno-lint-ignore no-explicit-any
export async function updateAnnonce(uri:string, dbName:string, collectionName:string, annonceId:string, updateData:any) {
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

    // Update the document by _id
    const result = await collection.updateOne(
      { _id: new ObjectId(annonceId) },
      updateData
    );

    if (result.matchedCount > 0) {
      console.log(`Successfully updated ${result.modifiedCount} document(s).`);
    } else {
      console.log("No document found with the given ID.");
    }

  } catch (error) {
    console.error("Error connecting to MongoDB or updating data:", error);
  } finally {
    // Close the connection
    await client.close();
    console.log("Connection closed");
  }
}

 