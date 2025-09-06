 import "jsr:@std/dotenv/load";
 // runtime is deno 
// Import necessary Node modules compatible with Deno
import { readFile } from "node:fs/promises";
import { basename } from "node:path";

// Function to convert file to base64 in chunks to avoid stack overflow
async function fileToBase64(filePath: string): Promise<string> {
  const data = await readFile(filePath);
  const uint8 = new Uint8Array(data);
  let binary = '';
  const chunkSize = 4096;
  for (let i = 0; i < uint8.length; i += chunkSize) {
    //console.log('Type of subarray:', typeof uint8.subarray(i, i + chunkSize), uint8.subarray(i, i + chunkSize).constructor.name);
    binary += String.fromCharCode.apply(null, Array.from(uint8.subarray(i, i + chunkSize)));
  }
  return btoa(binary);
}

// Main function
async function main() {
  // Get image path from command line arguments
  const args = Deno.args;
  if (args.length !== 1) {
    console.error("Usage: deno run --allow-read --allow-net --allow-env script.ts <image_path>");
    Deno.exit(1);
  }
  const imagePath = args[0];

  // Read and convert image to base64
  let base64Image: string;
  try {
    base64Image = await fileToBase64(imagePath);
  } catch (error) {
    console.error("Error reading image file:", error);
    Deno.exit(1);
  }

  // Get Groq API key from environment
  const apiKey = Deno.env.get("GROQ_API_KEY");
  if (!apiKey) {
    console.error("GROQ_API_KEY environment variable is not set.");
    Deno.exit(1);
  }

  // Prepare the API request
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const model = "meta-llama/llama-4-scout-17b-16e-instruct"; // Updated vision model supported by Groq
  const systemPrompt = "You are an image classifier. Analyze the image and determine if it is safe to publish. Respond with 'Yes' if it can be published (no violence, NSFW, illegal content, etc.), or 'No' with a brief reason if not.";
  const userMessage = {
    role: "user",
    content: [
      { type: "text", text: "Classify this image: is it possible to publish it?" },
      {
        type: "image_url",
        image_url: {
          url: `data:image/${basename(imagePath).split('.').pop()};base64,${base64Image}`,
        },
      },
    ],
  };

  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      userMessage,
    ],
    max_tokens: 100,
    temperature: 0.5,
  };

  // Send request to Groq API
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("API request failed:", response.status, await response.text());
      Deno.exit(1);
    }

    const data = await response.json();
    const classification = data.choices[0].message.content.trim();
    console.log("Classification result:", classification);
  } catch (error) {
    console.error("Error during API call:", error);
  }
}

main();
 