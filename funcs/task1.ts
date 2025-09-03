 import { getClassifationForAnnonce } from "./confirme-annonce-desc.ts";
import { getAnnonceById } from "./get-annonce.ts";
import { updateAnnonce } from "./update-annonce.ts";

 

export async function task1(uri: string, dbName: string, collectionName: string, annonceId: string) { 
    const description = await getAnnonceById(uri, dbName, collectionName,annonceId);
    if (description) {
        const classification = await getClassifationForAnnonce(description);
        console.log("Classification result:", classification.choices[0]?.message?.content || "");
        const result = classification.choices[0]?.message?.content || "";
        if (result.includes("PUBLIER")) {
            console.log("L'annonce est validée pour publication.");
            const updateData = {
                $set: {
                    isDescriptionCheckedByIA: true,
                    isValidForPublicationByIA: true
                }
            };
            await updateAnnonce(uri, dbName, collectionName, annonceId, updateData);
        } else {
            console.log("L'annonce est rejetée.");

            const updateData = {
                $set: {
                    isDescriptionCheckedByIA: true,
                    isValidForPublicationByIA: false
                }
            };
            await updateAnnonce(uri, dbName, collectionName, annonceId, updateData);
        }
    }

}
