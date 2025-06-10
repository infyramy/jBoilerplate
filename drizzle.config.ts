import type { Config } from 'drizzle-kit';
import 'dotenv/config';

const env = process.env.NODE_ENV || 'development';

// Database configuration based on environment
const getDbConfig = () => {
  const configs = {
    development: {
      host: process.env.VITE_DB_HOST || 'localhost',
      port: Number(process.env.VITE_DB_PORT) || 5432,
      user: process.env.VITE_DB_USER || 'postgres',
      password: process.env.VITE_DB_PASSWORD || 'postgres',
      database: process.env.VITE_DB_NAME || 'jboilerplate_dev',
    },
    staging: {
      host: process.env.VITE_DB_HOST,
      port: Number(process.env.VITE_DB_PORT) || 5432,
      user: process.env.VITE_DB_USER,
      password: process.env.VITE_DB_PASSWORD,
      database: process.env.VITE_DB_NAME || 'jboilerplate_staging',
    },
    production: {
      host: process.env.VITE_DB_HOST,
      port: Number(process.env.VITE_DB_PORT) || 5432,
      user: process.env.VITE_DB_USER,
      password: process.env.VITE_DB_PASSWORD,
      database: process.env.VITE_DB_NAME || 'jboilerplate_prod',
    }
  };
  
  return configs[env as keyof typeof configs] || configs.development;
};

const dbConfig = getDbConfig();

export default {
  schema: './src/lib/db/schema.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: `postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
  },
} satisfies Config; 