import "jsr:@std/dotenv/load";
import Groq from "npm:groq-sdk";
const apiKey = Deno.env.get("GROQ_API_KEY")||""; 

const groq = new Groq({ apiKey});

export async function getGroqChatCompletion() {
  return await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "quelle est la capitale de la france ?",
        //"Explain the importance of fast language models"
        //"quelle est la capitale de la france ?",
      },
    ],
    model: "openai/gpt-oss-20b",
  });
}


export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

await main();