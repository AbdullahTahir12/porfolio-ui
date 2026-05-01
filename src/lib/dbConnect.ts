import mongoose from "mongoose";

declare global {
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let MONGODB_URI = process.env.MONGODB_URI || 
                    process.env["MONGODB_URI "] || 
                    process.env[" MONGODB_URI"] || 
                    process.env[" MONGODB_URI "];

if (MONGODB_URI) {
  // Remove any accidental leading '=' or whitespace from the value itself
  MONGODB_URI = MONGODB_URI.trim().replace(/^=/, "").trim();
}

const cached = global.mongooseConnection ?? {
  conn: null,
  promise: null,
};

export async function dbConnect() {
  const uri = MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  cached.conn = await cached.promise;
  global.mongooseConnection = cached;

  return cached.conn;
}

export async function disconnectDatabase() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    global.mongooseConnection = cached;
  }
}
