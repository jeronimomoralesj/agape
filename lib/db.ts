import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// In serverless environments (Vercel) the module can be re-evaluated between
// invocations. Caching the connection on `globalThis` prevents exhausting the
// Atlas connection pool with one connection per lambda invocation.
declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis._mongoose ?? { conn: null, promise: null };
globalThis._mongoose = cached;

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI no está definida. Copia .env.example a .env.local y agrega tu cadena de conexión de MongoDB Atlas.'
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 5, // serverless: small pools, many lambdas
        // Fail fast instead of hanging until the platform kills the function.
        // (Default is 30s, which exceeds Vercel's function timeout and shows
        // up as endless spinners + opaque 500s.)
        serverSelectionTimeoutMS: 7000,
        connectTimeoutMS: 7000,
        socketTimeoutMS: 30000,
      })
      .catch((err) => {
        // Reset so the next request retries instead of reusing a rejected promise
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
