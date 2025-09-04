// Describe the shape of your message object (optional)
interface Notification {
  forUser: string;
  body: string;
}

// Get a reference to a KV instance
const kv = await Deno.openKv();

// Create a notification object
const message: Notification = {
  forUser: "alovelace",
  body: "You've got mail!",
};

// Enqueue the message for immediate delivery
await kv.enqueue(message);
// Enqueue the message for delivery in 3 days
// const delay = 1000 * 60 * 60 * 24 * 3;
// await kv.enqueue(message, { delay });