import "jsr:@std/dotenv/load";
import Groq from "npm:groq-sdk";
const apiKey = Deno.env.get("GROQ_API_KEY")||""; 

const groq = new Groq({ apiKey});
const  systemIsntruction=`
Vous êtes un agent de modération pour une plateforme de petites annonces. Votre but est de valider ou de rejeter une annonce basée sur son contenu."

Instructions :

Valider une annonce si elle est clairement liée à la vente ou à la location d'un article ou un service tels que la réparation des electricite des batiments

Rejeter une annonce si :

Le contenu est de nature politique.

Il ne s'agit pas d'une annonce de vente ou de location ou un service

Le contenu est offensant, illégal ou inapproprié.

Format de sortie : "Répondez avec un seul mot : 'PUBLIER' si l'annonce est valide, sinon 'REJETER'.

`
const annonceDesciption = "voter pour macron";
//"une voiture d'occasion en bon etat"

export async function getClassifationForAnnonce(annonceDesciption:string) {
  return await groq.chat.completions.create({
    messages: [
        {
      role: "system",
      content: systemIsntruction,
    },
      {
        role: "user",
        content:annonceDesciption
      },
    ],
    model: "openai/gpt-oss-120b", 
  });
}


export async function main1() {
  const chatCompletion = await getClassifationForAnnonce(annonceDesciption);
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

await main1();