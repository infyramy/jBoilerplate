// Import dotenv to load environment variables
import { config } from 'dotenv';
config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const knexConfig = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.VITE_DB_HOST || 'localhost',
      port: Number(process.env.VITE_DB_PORT) || 3306,
      user: process.env.VITE_DB_USER || 'jboilerplate',
      password: process.env.VITE_DB_PASSWORD || 'jboilerplate',
      database: process.env.VITE_DB_NAME || 'jboilerplate_dev',
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  staging: {
    client: 'mysql2',
    connection: {
      host: process.env.VITE_DB_HOST,
      port: Number(process.env.VITE_DB_PORT) || 3306,
      user: process.env.VITE_DB_USER,
      password: process.env.VITE_DB_PASSWORD,
      database: process.env.VITE_DB_NAME || 'jboilerplate_staging',
      ssl: process.env.VITE_DB_SSL === 'true' ? true : undefined,
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.VITE_DB_HOST,
      port: Number(process.env.VITE_DB_PORT) || 3306,
      user: process.env.VITE_DB_USER,
      password: process.env.VITE_DB_PASSWORD,
      database: process.env.VITE_DB_NAME || 'jboilerplate_prod',
      ssl: process.env.VITE_DB_SSL === 'true' ? true : undefined,
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export default knexConfig; 