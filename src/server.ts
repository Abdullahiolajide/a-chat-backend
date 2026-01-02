import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import dotenv from 'dotenv';
import auth from './routes/auth';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './config/passport';
import cors, { CorsOptions } from 'cors'

dotenv.config();

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
  console.error("MONGO_URI is not defined in .env file!");
  process.exit(1);
}

// Middleware setup
app.use(express.json());

const allowedOrigins: string[] = [
  "http://localhost:5173", 
];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // !origin allows server-to-server requests or tools like Postman
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET || "fallback-secret-change-in-prod", // Never keep weak defaults long-term
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: mongoUri, 
            collectionName: 'sessions', 
            ttl: 7 * 24 * 60 * 60,
            autoRemove: 'native',
        }),
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 7 * 24 * 60 * 60 * 1000, 
            sameSite: 'lax', 
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', auth);

// Optional: Add a simple health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

const start = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const server = app.listen(config.port, () => {
      console.log(`Server is listening on port ${config.port}`);
    });

    // Graceful shutdown (optional but recommended)
    process.on('SIGTERM', () => {
      console.log('SIGTERM received: closing server...');
      server.close(() => {
        mongoose.connection.close();
      });
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

start();