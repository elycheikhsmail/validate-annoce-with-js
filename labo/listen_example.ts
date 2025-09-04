// Define the shape of the object we expect as a message in the queue
interface Notification {
  forUser: string;
  body: string;
}

// Create a type guard to check the type of the incoming message
function isNotification(o: unknown): o is Notification {
  return (
    ((o as Notification)?.forUser !== undefined &&
      typeof (o as Notification).forUser === "string") &&
    ((o as Notification)?.body !== undefined &&
      typeof (o as Notification).body === "string")
  );
}

// Get a reference to a KV database
const kv = await Deno.openKv();

// Register a handler function to listen for values - this example shows
// how you might send a notification
kv.listenQueue((msg: unknown) => {
  // Use type guard - then TypeScript compiler knows msg is a Notification
  if (isNotification(msg)) {
    console.log("Sending notification to user:", msg.forUser);
    // ... do something to actually send the notification!
  } else {
    // If the message is of an unknown type, it might be an error
    console.error("Unknown message received:", msg);
  }
});