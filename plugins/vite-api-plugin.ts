import type { Plugin, ViteDevServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import knex from 'knex';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Helper function to parse connection string
function parseConnectionString(connStr: string) {
  // Format: mysql://user:password@host:port/database
  const regex = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = connStr.match(regex);

  if (match) {
    return {
      user: match[1],
      password: match[2],
      host: match[3],
      port: match[4],
      database: match[5]
    };
  }
  return null;
}

// Initialize database connection
const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.VITE_DB_HOST || 'localhost',
    port: Number(process.env.VITE_DB_PORT) || 3306,
    user: process.env.VITE_DB_USER || 'mariadb',
    password: process.env.VITE_DB_PASSWORD || 'mariadb',
    database: process.env.VITE_DB_NAME || 'default',
  },
  pool: {
    min: 2,
    max: 10,
  },
});

// Logo file watcher - ensures logo files exist and restores defaults if missing
function initLogoWatcher() {
  const logoDir = path.join(process.cwd(), 'public/assets/logo');
  const logoTypes = ['light', 'dark'];
  const extensions = ['.png', '.svg'];

  // Check and restore missing logos
  const checkLogos = () => {
    logoTypes.forEach(type => {
      let logoExists = false;

      // Check if any logo file exists for this type
      extensions.forEach(ext => {
        const logoPath = path.join(logoDir, `logo-${type}${ext}`);
        if (fs.existsSync(logoPath)) {
          logoExists = true;
        }
      });

      // If no logo exists, restore from default
      if (!logoExists) {
        const defaultPath = path.join(logoDir, `logo-${type}-default.svg`);
        const restorePath = path.join(logoDir, `logo-${type}.svg`);

        if (fs.existsSync(defaultPath)) {
          try {
            fs.copyFileSync(defaultPath, restorePath);
            console.log(`[Logo Watcher] Restored missing ${type} logo from default`);
          } catch (error) {
            console.error(`[Logo Watcher] Failed to restore ${type} logo:`, error);
          }
        }
      }
    });
  };

  // Initial check
  checkLogos();

  // Watch for changes/deletions
  if (fs.existsSync(logoDir)) {
    fs.watch(logoDir, (eventType, filename) => {
      if (filename && (filename.includes('logo-light') || filename.includes('logo-dark'))) {
        // Debounce checks
        setTimeout(checkLogos, 100);
      }
    });
    console.log('[Logo Watcher] Monitoring logo directory for changes');
  }
}

// Initialize logo watcher on module load
initLogoWatcher();

export default function apiPlugin(): Plugin {
  return {
    name: 'vite-api-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {

        // Helper functions for route management (used by Page Editor)
        const routesJsonPath = path.join(process.cwd(), 'public/config/generated-routes.json');

        function ensureRoutesJson() {
          const dir = path.dirname(routesJsonPath);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          if (!fs.existsSync(routesJsonPath)) fs.writeFileSync(routesJsonPath, '[]', 'utf8');
        }

        function readRoutes(): any[] {
          ensureRoutesJson();
          try {
            return JSON.parse(fs.readFileSync(routesJsonPath, 'utf8') || '[]');
          } catch {
            return [];
          }
        }

        function writeRoutes(list: any[]) {
          ensureRoutesJson();
          fs.writeFileSync(routesJsonPath, JSON.stringify(list, null, 2), 'utf8');
        }

        // Handle file upload
        // Handle logo file uploads (FormData)
        if (req.url === '/api/upload' && req.method === 'POST') {
          const formidable = await import('formidable');
          const form = formidable.default({
            multiples: false,
            maxFileSize: 2 * 1024 * 1024, // 2MB limit
            filter: ({ mimetype }) => {
              // Only allow PNG and SVG
              return mimetype === 'image/png' || mimetype === 'image/svg+xml';
            }
          });

          form.parse(req, (err: any, fields: any, files: any) => {
            if (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: err.message }));
              return;
            }

            try {
              // Get uploaded file
              const file = files.file[0] || files.file;

              if (!file) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, message: 'No file uploaded' }));
                return;
              }

              // Get logo type from fields (light or dark)
              const logoType = fields.type?.[0] || fields.type || 'light';

              // Validate file extension
              const ext = path.extname(file.originalFilename || '').toLowerCase();
              if (ext !== '.png' && ext !== '.svg') {
                res.statusCode = 400;
                res.end(JSON.stringify({
                  success: false,
                  message: 'Invalid file format. Only PNG and SVG are allowed.'
                }));
                return;
              }

              // Validate file size (2MB max)
              if (file.size > 2 * 1024 * 1024) {
                res.statusCode = 400;
                res.end(JSON.stringify({
                  success: false,
                  message: 'File size exceeds 2MB limit.'
                }));
                return;
              }

              // Use fixed filenames based on logo type
              const logoDir = path.join(process.cwd(), 'public/assets/logo');
              if (!fs.existsSync(logoDir)) {
                fs.mkdirSync(logoDir, { recursive: true });
              }

              // Fixed filenames: logo-light.png/svg and logo-dark.png/svg
              const fixedFilename = `logo-${logoType}${ext}`;
              const destPath = path.join(logoDir, fixedFilename);

              // Overwrite existing file if it exists
              fs.copyFileSync(file.filepath, destPath);

              // Clean up temp file
              fs.unlinkSync(file.filepath);

              console.log(`[Logo Upload] Saved ${logoType} logo: ${fixedFilename}`);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                path: `/assets/logo/${fixedFilename}`,
                filename: fixedFilename,
                type: logoType
              }));
            } catch (error: any) {
              console.error('[Logo Upload] Error:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: error.message }));
            }
          });
          return;
        }

        // Get available logo file info (checks for PNG or SVG)
        if (req.url?.startsWith('/api/logo-info') && req.method === 'GET') {
          try {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const type = url.searchParams.get('type') || 'light'; // light or dark

            const logoDir = path.join(process.cwd(), 'public/assets/logo');
            const extensions = ['.png', '.svg'];

            let foundFile = null;
            for (const ext of extensions) {
              const filePath = path.join(logoDir, `logo-${type}${ext}`);
              if (fs.existsSync(filePath)) {
                foundFile = {
                  path: `/assets/logo/logo-${type}${ext}`,
                  extension: ext,
                  type: type
                };
                break;
              }
            }

            // If no file found, use default
            if (!foundFile) {
              foundFile = {
                path: `/assets/logo/logo-${type}-default.svg`,
                extension: '.svg',
                type: type
              };
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, logo: foundFile }));
          } catch (error: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: error.message }));
          }
          return;
        }

        if (req.url === '/api/upload-image' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const { image, filename } = data;

              // Create uploads directory if it doesn't exist
              const uploadsDir = path.join(process.cwd(), 'public/uploads');
              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }

              // Generate unique filename
              const timestamp = Date.now();
              const ext = path.extname(filename);
              const name = path.basename(filename, ext);
              const uniqueFilename = `${name}-${timestamp}${ext}`;
              const filePath = path.join(uploadsDir, uniqueFilename);

              // Save base64 image to file
              const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
              fs.writeFileSync(filePath, base64Data, 'base64');

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                path: `/uploads/${uniqueFilename}`,
                filename: uniqueFilename
              }));
            } catch (error: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: error.message }));
            }
          });
          return;
        }

        // Handle config save to file
        if (req.url === '/api/system-config/save-file' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', () => {
            try {
              const config = JSON.parse(body);
              const configPath = path.join(process.cwd(), 'public/config/system-config.json');
              const configDir = path.dirname(configPath);

              // Ensure config directory exists
              if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir, { recursive: true });
              }

              // Write configuration to file
              fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: 'Configuration saved successfully'
              }));
            } catch (error: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: error.message }));
            }
          });
          return;
        }

        // Handle config load from database
        if (req.url === '/api/system-config/load-db' && req.method === 'GET') {
          (async () => {
            try {
              const rows = await db('system_configuration').select('key', 'value', 'type');

              const config: any = {};
              for (const row of rows) {
                let value = row.value;
                // Parse numeric values
                if (row.type === 'number') {
                  value = parseFloat(value);
                }
                config[row.key] = value;
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                config
              }));
            } catch (error: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: error.message }));
            }
          })();
          return;
        }

        // Handle config save to database
        if (req.url === '/api/system-config/save-db' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', async () => {
            try {
              const config = JSON.parse(body);
              console.log('[Config Save] Saving configuration keys:', Object.keys(config));

              // Save each config field to database
              for (const [key, value] of Object.entries(config)) {
                const type = typeof value === 'number' ? 'number' : 'string';
                const stringValue = String(value);
                const valueLength = stringValue.length;

                console.log(`[Config Save] Saving ${key}: ${type}, ${valueLength} bytes`);

                // Check if key exists
                const existing = await db('system_configuration').where('key', key).first();

                if (existing) {
                  // Update existing
                  await db('system_configuration')
                    .where('key', key)
                    .update({
                      value: stringValue,
                      type,
                      updated_at: db.fn.now()
                    });
                  console.log(`[Config Save] Updated ${key}`);
                } else {
                  // Insert new
                  await db('system_configuration').insert({
                    key,
                    value: stringValue,
                    type,
                    created_at: db.fn.now(),
                    updated_at: db.fn.now()
                  });
                  console.log(`[Config Save] Inserted ${key}`);
                }
              }

              console.log('[Config Save] All configuration saved successfully');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: 'Configuration saved to database successfully'
              }));
            } catch (error: any) {
              console.error('[Config Save] Error:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: error.message }));
            }
          });
          return;
        }

        // Get list of tables
        if (req.url === '/api/database/tables' && req.method === 'GET') {
          (async () => {
            try {
              const tables = await db.raw('SHOW TABLES');
              const tableList = tables[0].map((row: any) => {
                const tableName = Object.values(row)[0] as string;
                return { name: tableName, rows: 0 };
              });

              // Get row counts for each table
              for (const table of tableList) {
                const result = await db(table.name).count('* as count').first();
                table.rows = result?.count || 0;
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, tables: tableList }));
            } catch (error: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: error.message }));
            }
          })();
          return;
        }

        // Get table structure and data
        if (req.url?.startsWith('/api/database/table/') && req.method === 'GET') {
          const tableName = req.url.replace('/api/database/table/', '');
          (async () => {
            try {
              // Get table structure
              const columns = await db.raw(`DESCRIBE ${tableName}`);

              // Get table data
              const rows = await db(tableName).select('*').limit(1000);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                columns: columns[0],
                rows
              }));
            } catch (error: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: error.message }));
            }
          })();
          return;
        }

        // Export database schema
        if (req.url?.startsWith('/api/database/export-schema') && req.method === 'GET') {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const format = url.searchParams.get('format') || 'sql';

          (async () => {
            try {
              // Get all tables
              const tables = await db.raw('SHOW TABLES');
              const tableList = tables[0].map((row: any) => Object.values(row)[0] as string);

              let schema = '';

              if (format === 'sql') {
                // Generate SQL schema
                schema = `-- Database Schema Export\n-- Generated: ${new Date().toISOString()}\n\n`;

                for (const tableName of tableList) {
                  // Get CREATE TABLE statement
                  const createTable = await db.raw(`SHOW CREATE TABLE ${tableName}`);
                  schema += `-- Table: ${tableName}\n`;
                  schema += createTable[0][0]['Create Table'] + ';\n\n';
                }
              } else if (format === 'json') {
                // Generate JSON schema
                const schemaData: any = {
                  database: process.env.VITE_DB_NAME || 'default',
                  exportedAt: new Date().toISOString(),
                  tables: []
                };

                for (const tableName of tableList) {
                  // Get table structure
                  const columns = await db.raw(`DESCRIBE ${tableName}`);

                  // Get indexes
                  const indexes = await db.raw(`SHOW INDEX FROM ${tableName}`);

                  schemaData.tables.push({
                    name: tableName,
                    columns: columns[0].map((col: any) => ({
                      field: col.Field,
                      type: col.Type,
                      null: col.Null,
                      key: col.Key,
                      default: col.Default,
                      extra: col.Extra
                    })),
                    indexes: indexes[0].map((idx: any) => ({
                      name: idx.Key_name,
                      column: idx.Column_name,
                      unique: idx.Non_unique === 0
                    }))
                  });
                }

                schema = JSON.stringify(schemaData, null, 2);
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                schema
              }));
            } catch (error: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: error.message }));
            }
          })();
          return;
        }

        // Test database connection with comprehensive validation
        if (req.url === '/api/database/test-connection' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', async () => {
            try {
              const parsedBody = body ? JSON.parse(body) : {};

              // Use provided config or fall back to environment variables
              const connectionConfig = {
                host: parsedBody.host || process.env.VITE_DB_HOST || 'localhost',
                port: parsedBody.port || Number(process.env.VITE_DB_PORT) || 3306,
                user: parsedBody.user || process.env.VITE_DB_USER || 'mariadb',
                password: parsedBody.password || process.env.VITE_DB_PASSWORD || 'mariadb',
                database: parsedBody.database || process.env.VITE_DB_NAME || 'default',
              };

              const testDb = knex({
                client: 'mysql2',
                connection: connectionConfig,
              });

              // Test basic connection
              await testDb.raw('SELECT 1');

              // Check for required system tables
              const requiredTables = ['users', 'system_configuration', 'audit_logs'];
              const tables = await testDb.raw('SHOW TABLES');
              const tableList = tables[0].map((row: any) => Object.values(row)[0] as string);

              const missingTables = requiredTables.filter(t => !tableList.includes(t));
              const hasAllTables = missingTables.length === 0;

              // Check if tables have data
              let hasData = false;
              if (hasAllTables) {
                try {
                  const configCount = await testDb('system_configuration').count('* as count').first();
                  hasData = configCount && configCount.count > 0;
                } catch (e) {
                  hasData = false;
                }
              }

              await testDb.destroy();

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: 'Database connection successful',
                status: {
                  connected: true,
                  hasRequiredTables: hasAllTables,
                  missingTables: missingTables,
                  hasData: hasData,
                  requiresMigration: !hasAllTables,
                  tables: tableList
                }
              }));
            } catch (error: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                message: error.message || 'Failed to connect to database',
                status: {
                  connected: false,
                  hasRequiredTables: false,
                  missingTables: [],
                  hasData: false,
                  requiresMigration: true,
                  tables: []
                }
              }));
            }
          });
          return;
        }

        // Load environment variables
        if (req.url === '/api/env/load' && req.method === 'GET') {
          try {
            const envPath = path.join(process.cwd(), '.env');
            const envContent = fs.readFileSync(envPath, 'utf8');
            const env: Record<string, string> = {};

            envContent.split('\n').forEach(line => {
              const trimmed = line.trim();
              if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                if (key) {
                  env[key.trim()] = valueParts.join('=').trim();
                }
              }
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, env }));
          } catch (error: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
          return;
        }

        // Save environment variables
        if (req.url === '/api/env/save' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', () => {
            try {
              const { env } = JSON.parse(body);
              const envPath = path.join(process.cwd(), '.env');

              // Build env file content
              const lines = Object.entries(env).map(([key, value]) => `${key}=${value}`);
              const envContent = lines.join('\n') + '\n';

              // Write to .env file
              fs.writeFileSync(envPath, envContent, 'utf8');

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: 'Environment variables saved successfully'
              }));
            } catch (error: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: error.message }));
            }
          });
          return;
        }

        // /* MENUS: CRUD API START */
        if (req.url === '/api/menus' && req.method === 'GET') {
          try {
            const rows = await db('menus').select('*').orderBy('order','asc');
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify({ success: true, menus: rows }));
          } catch (e: any) { res.statusCode=500; res.end(JSON.stringify({ success:false, error:e.message })); }
          return;
        }
        if (req.url === '/api/menus' && req.method === 'POST') {
          let body=''; req.on('data',c=>body+=c.toString());
          req.on('end', async () => {
            try {
              const { label, path: p, icon, role='user', visible=true, order=0 } = JSON.parse(body||'{}');
              if (!label || !p) throw new Error('label/path required');
              await db('menus').insert({ label, path: p, icon, role, visible, order });
              await db('audit_logs').insert({ user:'admin', action:'menu:create', details: JSON.stringify({ label, path:p }) });
              res.setHeader('Content-Type','application/json'); res.end(JSON.stringify({ success:true }));
            } catch (e: any) { res.statusCode=400; res.end(JSON.stringify({ success:false, error:e.message })); }
          }); return;
        }
        if (req.url?.startsWith('/api/menus/') && req.method === 'PUT') {
          const id = Number(req.url.split('/').pop()); if (!id) { next(); return; }
          let body=''; req.on('data',c=>body+=c.toString());
          req.on('end', async () => {
            try {
              const data = JSON.parse(body||'{}');
              await db('menus').where('id', id).update(data);
              await db('audit_logs').insert({ user:'admin', action:'menu:update', details: JSON.stringify({ id, ...data }) });
              res.setHeader('Content-Type','application/json'); res.end(JSON.stringify({ success:true }));
            } catch (e:any) { res.statusCode=400; res.end(JSON.stringify({ success:false, error:e.message })); }
          }); return;
        }
        if (req.url?.startsWith('/api/menus/') && req.method === 'DELETE') {
          const id = Number(req.url.split('/').pop()); if (!id) { next(); return; }
          try {
            await db('menus').where('id', id).del();
            await db('audit_logs').insert({ user:'admin', action:'menu:delete', details: JSON.stringify({ id }) });
            res.setHeader('Content-Type','application/json'); res.end(JSON.stringify({ success:true }));
          } catch (e:any) { res.statusCode=400; res.end(JSON.stringify({ success:false, error:e.message })); }
          return;
        }
        if (req.url === '/api/pages' && req.method === 'GET') {
          try {
            const rows = await db('pages').select('*');
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify({ success: true, pages: rows }));
          } catch (e: any) { res.statusCode=500; res.end(JSON.stringify({ success:false, error:e.message })); }
          return;
        }
        if (req.url === '/api/pages' && req.method === 'POST') {
          let body=''; req.on('data',c=>body+=c.toString());
          req.on('end', async () => {
            try {
              const { name, path: p, component_path, layout='dashboard', role='user' } = JSON.parse(body||'{}');
              if (!name || !p || !component_path) throw new Error('name/path/component_path required');

              // Create the actual Vue file
              const filePath = component_path.replace('@/', 'src/');
              const absolutePath = path.join(process.cwd(), filePath);
              const dir = path.dirname(absolutePath);

              // Create directory if it doesn't exist
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
              }

              // Create basic Vue template
              const vueTemplate = `<script setup lang="ts">
import { ref } from 'vue';

// Add your component logic here
const data = ref();
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">${name}</h1>
      <p class="text-muted-foreground">Welcome to ${name}</p>
    </div>

    <!-- Add your content here -->
    <div class="bg-muted/50 rounded-lg p-8 text-center">
      <p class="text-muted-foreground">This page is ready for customization.</p>
      <p class="text-sm text-muted-foreground mt-2">Edit this file at: <code class="bg-background px-2 py-1 rounded">${filePath}</code></p>
    </div>
  </div>
</template>
`;

              fs.writeFileSync(absolutePath, vueTemplate, 'utf8');
              console.log(`Created page file: ${absolutePath}`);

              await db('pages').insert({ name, path: p, component_path, layout, role });
              // update routes registry
              const routes = readRoutes();
              if (!routes.some(r => r.path===p)) {
                routes.push({ path: p, name, componentPath: component_path, meta: { requiresAuth: true, roles:[role], layout, title: name }});
                writeRoutes(routes);
              }
              res.setHeader('Content-Type','application/json'); res.end(JSON.stringify({ success:true }));
            } catch (e:any) { res.statusCode=400; res.end(JSON.stringify({ success:false, error:e.message })); }
          }); return;
        }
        if (req.url?.startsWith('/api/pages/') && req.method === 'DELETE') {
          const id = Number(req.url.split('/').pop()); if (!id) { next(); return; }
          try {
            const page = await db('pages').where('id', id).first();
            if (page) {
              await db('pages').where('id', id).del();

              // Remove from routes registry
              const routes = readRoutes();
              const updated = routes.filter((r: any) => r.path !== page.path);
              writeRoutes(updated);

              // Delete the actual file
              const filePath = page.component_path.replace('@/', 'src/');
              const absolutePath = path.join(process.cwd(), filePath);

              try {
                if (fs.existsSync(absolutePath)) {
                  fs.unlinkSync(absolutePath);
                  console.log(`Deleted file: ${absolutePath}`);

                  // Try to remove empty parent directories
                  const dir = path.dirname(absolutePath);
                  try {
                    if (fs.readdirSync(dir).length === 0) {
                      fs.rmdirSync(dir);
                      console.log(`Removed empty directory: ${dir}`);
                    }
                  } catch {}
                }
              } catch (fileErr) {
                console.error('Error deleting file:', fileErr);
                // Don't fail the API call if file deletion fails
              }

              // Remove from menu structures
              try {
                const menuStructures = await db('menu_structures').select('*');
                for (const menuRow of menuStructures) {
                  const structure = JSON.parse(menuRow.structure);
                  let modified = false;

                  // Go through each category and remove the item
                  for (const category of structure) {
                    if (category.items) {
                      const originalLength = category.items.length;
                      category.items = category.items.filter((item: any) => item.path !== page.path);
                      if (category.items.length < originalLength) {
                        modified = true;
                      }
                    }
                  }

                  // Update if modified
                  if (modified) {
                    await db('menu_structures')
                      .where('id', menuRow.id)
                      .update({ structure: JSON.stringify(structure) });
                    console.log(`Removed page from ${menuRow.role} menu structure`);
                  }
                }
              } catch (menuErr) {
                console.error('Error removing from menu:', menuErr);
              }
            }
            res.setHeader('Content-Type','application/json'); res.end(JSON.stringify({ success:true }));
          } catch (e:any) { res.statusCode=400; res.end(JSON.stringify({ success:false, error:e.message })); }
          return;
        }
        // Delete manual page (not in database, just files and routes)
        if (req.url === '/api/pages/delete-manual' && req.method === 'POST') {
          let body = '';
          req.on('data', c => body += c.toString());
          req.on('end', async () => {
            try {
              const { path: pagePath, componentPath } = JSON.parse(body || '{}');
              if (!pagePath || !componentPath) {
                throw new Error('path and componentPath required');
              }

              // Remove from routes registry
              const routes = readRoutes();
              const routeIndex = routes.findIndex((r: any) => r.path === pagePath);

              if (routeIndex === -1) {
                throw new Error('Route not found in generated-routes.json');
              }

              const route = routes[routeIndex];
              routes.splice(routeIndex, 1);
              writeRoutes(routes);
              console.log(`Removed route from generated-routes.json: ${pagePath}`);

              // Delete the actual file
              const filePath = componentPath.replace('@/', 'src/');
              const absolutePath = path.join(process.cwd(), filePath);

              if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
                console.log(`Deleted file: ${absolutePath}`);

                // Try to remove empty parent directories
                const dir = path.dirname(absolutePath);
                try {
                  if (fs.readdirSync(dir).length === 0) {
                    fs.rmdirSync(dir);
                    console.log(`Removed empty directory: ${dir}`);
                  }
                } catch {}
              } else {
                console.warn(`File not found: ${absolutePath}`);
              }

              // Remove from menu structures
              try {
                const menuStructures = await db('menu_structures').select('*');
                for (const menuRow of menuStructures) {
                  const structure = JSON.parse(menuRow.structure);
                  let modified = false;

                  // Go through each category and remove the item
                  for (const category of structure) {
                    if (category.items) {
                      const originalLength = category.items.length;
                      category.items = category.items.filter((item: any) => item.path !== pagePath);
                      if (category.items.length < originalLength) {
                        modified = true;
                      }
                    }
                  }

                  // Update if modified
                  if (modified) {
                    await db('menu_structures')
                      .where('id', menuRow.id)
                      .update({ structure: JSON.stringify(structure) });
                    console.log(`Removed page from ${menuRow.role} menu structure`);
                  }
                }
              } catch (menuErr) {
                console.error('Error removing from menu:', menuErr);
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: 'Manual page deleted successfully',
                deletedFiles: [absolutePath]
              }));
            } catch (e: any) {
              console.error('Error deleting manual page:', e);
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: e.message }));
            }
          });
          return;
        }
        // /* MENU STRUCTURE API START */
        if (req.url?.startsWith('/api/menu-structure') && req.method === 'GET') {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const role = url.searchParams.get('role') || 'admin';
          console.log(`[API] GET /api/menu-structure?role=${role}`);
          try {
            const row = await db('menu_structures').where('role', role).first();
            if (row) {
              console.log(`[API] Found menu structure for ${role}:`, row.structure.substring(0, 100) + '...');
              res.setHeader('Content-Type','application/json');
              res.end(JSON.stringify({ success: true, structure: JSON.parse(row.structure) }));
            } else {
              console.log(`[API] No menu structure found for ${role}, returning null`);
              res.setHeader('Content-Type','application/json');
              res.end(JSON.stringify({ success: true, structure: null }));
            }
          } catch (e: any) {
            console.error(`[API] Error loading menu structure:`, e);
            res.statusCode=500; res.end(JSON.stringify({ success:false, error:e.message }));
          }
          return;
        }
        if (req.url === '/api/menu-structure' && req.method === 'POST') {
          let body=''; req.on('data',c=>body+=c.toString());
          req.on('end', async () => {
            try {
              const { role, structure } = JSON.parse(body||'{}');
              console.log(`[API] POST /api/menu-structure role=${role}, categories=${structure?.length}`);
              if (!role || !structure) throw new Error('role and structure required');

              const existing = await db('menu_structures').where('role', role).first();
              if (existing) {
                console.log(`[API] Updating existing menu structure for ${role}`);
                await db('menu_structures').where('role', role).update({ structure: JSON.stringify(structure) });
              } else {
                console.log(`[API] Creating new menu structure for ${role}`);
                await db('menu_structures').insert({ role, structure: JSON.stringify(structure) });
              }

              res.setHeader('Content-Type','application/json'); res.end(JSON.stringify({ success:true }));
            } catch (e:any) {
              console.error(`[API] Error saving menu structure:`, e);
              res.statusCode=400; res.end(JSON.stringify({ success:false, error:e.message }));
            }
          }); return;
        }
        // /* MENU STRUCTURE API END */
        // /* MENUS: CRUD API END */

        // /* SETUP API START */
        // Get setup status
        if (req.url === '/api/setup/status' && req.method === 'GET') {
          try {
            // Check if setup is completed by checking .env for SETUP_COMPLETED flag
            const setupCompleted = process.env.SETUP_COMPLETED === 'true';

            // If setup is completed, verify database is reachable
            if (setupCompleted) {
              try {
                await db.raw('SELECT 1');

                // Check if core tables exist
                const tables = await db.raw('SHOW TABLES');
                const tableList = tables[0].map((row: any) => Object.values(row)[0] as string);
                const coreTables = ['users', 'system_configuration', 'audit_logs'];
                const hasCoreTablesResult = coreTables.every(table => tableList.includes(table));

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  initialized: true,
                  hasDatabase: true,
                  hasCoreTables: hasCoreTablesResult,
                  reason: 'Setup completed successfully'
                }));
              } catch (dbError: any) {
                // Database not reachable despite setup completed flag
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  initialized: true,
                  hasDatabase: false,
                  hasCoreTables: false,
                  reason: 'Setup completed but database connection failed: ' + dbError.message
                }));
              }
            } else {
              // Check if we have minimum DB config in .env
              const hasDbConfig = !!(
                process.env.VITE_DB_HOST &&
                process.env.VITE_DB_NAME
              );

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                initialized: false,
                hasDatabase: hasDbConfig,
                hasCoreTables: false,
                reason: hasDbConfig ? 'Setup not completed' : 'Database not configured'
              }));
            }
          } catch (error: any) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({
              initialized: false,
              hasDatabase: false,
              hasCoreTables: false,
              reason: 'Error checking setup status: ' + error.message
            }));
          }
          return;
        }

        // Test database connection
        if (req.url === '/api/setup/test-db' && req.method === 'POST') {
          let body = '';
          req.on('data', c => body += c.toString());
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              let { host, port, user, password, database, connectionString } = data;

              // If connection string is provided, parse it
              if (connectionString && connectionString.trim()) {
                const parsed = parseConnectionString(connectionString);
                if (parsed) {
                  ({ host, port, user, password, database } = parsed);
                } else {
                  throw new Error('Invalid connection string format');
                }
              }

              // Create test connection
              const testDb = knex({
                client: 'mysql2',
                connection: { host, port: Number(port), user, password, database }
              });

              // Test connection
              await testDb.raw('SELECT 1');

              // Check database status
              const tables = await testDb.raw(
                "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
                [database]
              );

              const tableNames = tables[0].map((t: any) => t.TABLE_NAME);
              const hasTables = tableNames.length > 0;

              // Check if tables have data
              let hasData = false;
              if (hasTables) {
                for (const table of tableNames) {
                  const count = await testDb(table).count('* as count').first();
                  if (count && count.count > 0) {
                    hasData = true;
                    break;
                  }
                }
              }

              await testDb.destroy();

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: 'Database connection successful!',
                status: {
                  hasConnection: true,
                  hasTables: hasTables,
                  hasData: hasData,
                  tableCount: tableNames.length,
                  existingTables: tableNames
                }
              }));
            } catch (e: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                message: e.message || 'Connection failed'
              }));
            }
          });
          return;
        }

        // Download database schema
        if (req.url === '/api/setup/download-schema' && req.method === 'GET') {
          try {
            const schemaPath = path.join(__dirname, '../public/jboilerplate_schema.sql');
            const schemaContent = fs.readFileSync(schemaPath, 'utf8');

            res.setHeader('Content-Type', 'application/sql');
            res.setHeader('Content-Disposition', 'attachment; filename="jboilerplate_schema.sql"');
            res.end(schemaContent);
          } catch (e: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
          return;
        }

        // Run migrations
        if (req.url === '/api/setup/run-migrations' && req.method === 'POST') {
          let body = '';
          req.on('data', c => body += c.toString());
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              let { host, port, user, password, database, connectionString, action, adminAccount } = data;

              // If connection string is provided, parse it
              if (connectionString && connectionString.trim()) {
                const parsed = parseConnectionString(connectionString);
                if (parsed) {
                  ({ host, port, user, password, database } = parsed);
                } else {
                  throw new Error('Invalid connection string format');
                }
              }

              // Create connection for migrations
              const migrationDb = knex({
                client: 'mysql2',
                connection: { host, port: Number(port), user, password, database }
              });

              // Handle different actions
              if (action === 'overwrite') {
                // Get all tables in the database
                const tables = await migrationDb.raw(
                  "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
                  [database]
                );

                const tableNames = tables[0].map((t: any) => t.TABLE_NAME);

                // Drop all tables
                if (tableNames.length > 0) {
                  // Disable foreign key checks temporarily
                  await migrationDb.raw('SET FOREIGN_KEY_CHECKS = 0');

                  for (const table of tableNames) {
                    await migrationDb.raw(`DROP TABLE IF EXISTS ??`, [table]);
                  }

                  // Re-enable foreign key checks
                  await migrationDb.raw('SET FOREIGN_KEY_CHECKS = 1');
                }
              }

              // Run migrations
              await migrationDb.migrate.latest({
                directory: path.join(__dirname, '../migrations')
              });

              // Create initial users with roles
              if (action === 'overwrite' || action === 'run') {
                try {
                  const bcrypt = await import('bcryptjs');
                  const crypto = await import('crypto');

                  // Wait a bit to ensure migrations are fully applied
                  await new Promise(resolve => setTimeout(resolve, 500));

                  // Check if users table exists
                  const hasUsersTable = await migrationDb.schema.hasTable('users');

                  if (hasUsersTable) {
                    // Check if admin user exists
                    const existingAdmin = await migrationDb('users').where('role', 'admin').first();

                    if (!existingAdmin) {
                      // Use adminAccount data if provided, otherwise use defaults
                      const adminName = adminAccount?.name || 'Admin User';
                      const adminEmail = adminAccount?.email || 'admin@example.com';
                      const adminPassword = adminAccount?.password || 'admin123';

                      // Create admin user with UUID
                      const hashedPassword = await bcrypt.hash(adminPassword, 10);
                      await migrationDb('users').insert({
                        uuid: crypto.randomUUID(),
                        name: adminName,
                        email: adminEmail,
                        password: hashedPassword,
                        role: 'admin',
                        is_active: true
                      });

                      console.log(`[Setup] Created admin user: ${adminEmail}`);
                    } else {
                      console.log('[Setup] Admin user already exists, skipping creation');
                    }

                    // Check if demo user exists
                    const existingUser = await migrationDb('users').where('role', 'user').first();

                    if (!existingUser) {
                      // Create demo regular user with UUID
                      const hashedPassword = await bcrypt.hash('user123', 10);
                      await migrationDb('users').insert({
                        uuid: crypto.randomUUID(),
                        name: 'Demo User',
                        email: 'user@example.com',
                        password: hashedPassword,
                        role: 'user',
                        is_active: true
                      });

                      console.log('[Setup] Created demo user: user@example.com');
                    }
                  } else {
                    console.log('[Setup] Users table not found, skipping user creation');
                  }

                  // Run other seeds (system config, menus, etc.)
                  try {
                    await migrationDb.seed.run({
                      directory: path.join(__dirname, '../seeds')
                    });
                    console.log('[Setup] Seed data applied successfully');
                  } catch (seedError: any) {
                    console.error('[Setup] Seed error:', seedError.message);
                  }
                } catch (seedError: any) {
                  console.error('[Setup] User creation error:', seedError);
                  console.error('[Setup] Error stack:', seedError.stack);
                  // Return error to user with more details
                  throw new Error(`User creation failed: ${seedError.message || seedError}`);
                }
              }

              await migrationDb.destroy();

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: action === 'overwrite'
                  ? 'Database overwritten and migrations completed successfully!'
                  : 'Migrations completed successfully!'
              }));
            } catch (e: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                message: e.message || 'Migration failed'
              }));
            }
          });
          return;
        }

        // Complete setup
        if (req.url === '/api/setup/complete' && req.method === 'POST') {
          let body = '';
          req.on('data', c => body += c.toString());
          req.on('end', async () => {
            try {
              const { database, system, admin, theme } = JSON.parse(body || '{}');

              console.log('[Setup Complete] Starting final setup...');

              // Parse connection string if provided
              let { host, port, user, password, database: dbName, connectionString } = database;

              if (connectionString && connectionString.trim()) {
                const parsed = parseConnectionString(connectionString);
                if (parsed) {
                  ({ host, port, user, password, database: dbName } = parsed);
                } else {
                  throw new Error('Invalid connection string format');
                }
              }

              console.log('[Setup Complete] Using database:', { host, port, user, database: dbName });

              // Create database connection with the credentials from the request
              // (NOT the global db which may have old credentials)
              const setupDb = knex({
                client: 'mysql2',
                connection: {
                  host,
                  port: Number(port),
                  user,
                  password,
                  database: dbName
                }
              });

              // Helper function to upsert system config
              const upsertConfig = async (key: string, value: string) => {
                const existing = await setupDb('system_configuration').where('key', key).first();
                if (existing) {
                  await setupDb('system_configuration').where('key', key).update({ value, updated_at: new Date() });
                } else {
                  await setupDb('system_configuration').insert({
                    key,
                    value,
                    type: 'string',
                    created_at: new Date(),
                    updated_at: new Date()
                  });
                }
              };

              // FIRST: Update system configuration in database
              await upsertConfig('systemName', system.systemName);
              await upsertConfig('loginTitle', system.loginTitle);
              await upsertConfig('loginDescription', system.loginDescription);

              if (system.logoLight) {
                await upsertConfig('logoLight', system.logoLight);
              }

              if (system.logoDark) {
                await upsertConfig('logoDark', system.logoDark);
              }

              // Save theme settings
              if (theme) {
                await upsertConfig('themeColor', theme.color || 'zinc');
                await upsertConfig('themeRadius', theme.radius || '0.5');
              }

              console.log('[Setup Complete] Updated system configuration in database');

              // SECOND: Update admin account if provided
              if (admin && admin.email) {
                const bcrypt = await import('bcryptjs');
                const hashedPassword = await bcrypt.hash(admin.password, 10);

                await setupDb('users')
                  .where('role', 'admin')
                  .update({
                    name: admin.name,
                    email: admin.email,
                    password: hashedPassword,
                    updated_at: new Date()
                  });

                console.log('[Setup Complete] Updated admin account');
              }

              // Close the setup database connection
              await setupDb.destroy();

              // THIRD: Send success response immediately
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: 'Setup completed successfully!'
              }));

              // LAST: Update .env file AFTER sending response (this will trigger server restart)
              // We do this last so the response is sent before restart
              setTimeout(() => {
                const envPath = path.join(__dirname, '../.env');
                let envContent = '';

                if (fs.existsSync(envPath)) {
                  envContent = fs.readFileSync(envPath, 'utf8');
                }

                // Update database config with parsed values
                envContent = updateEnvVar(envContent, 'VITE_DB_HOST', host);
                envContent = updateEnvVar(envContent, 'VITE_DB_PORT', port);
                envContent = updateEnvVar(envContent, 'VITE_DB_USER', user);
                envContent = updateEnvVar(envContent, 'VITE_DB_PASSWORD', password);
                envContent = updateEnvVar(envContent, 'VITE_DB_NAME', dbName);

                // Set SETUP_COMPLETED flag
                envContent = updateEnvVar(envContent, 'SETUP_COMPLETED', 'true');

                fs.writeFileSync(envPath, envContent);
                console.log('[Setup Complete] Updated .env file with SETUP_COMPLETED flag (server will restart)');
              }, 100);
            } catch (e: any) {
              console.error('[Setup Complete] Error:', e);
              console.error('[Setup Complete] Error stack:', e.stack);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({
                success: false,
                message: e.message || 'Setup failed'
              }));
            }
          });
          return;
        }
        // /* SETUP API END */

        // /* SYSTEM STATUS API START */
        // Get system runtime status
        if (req.url === '/api/system/status' && req.method === 'GET') {
          (async () => {
            try {
              const startTime = Date.now();

              // Check database connection
              let dbConnected = false;
              let dbClient = 'unknown';
              let dbDatabase = 'unknown';
              try {
                await db.raw('SELECT 1');
                dbConnected = true;
                dbClient = 'mysql2';
                dbDatabase = process.env.VITE_DB_NAME || 'unknown';
              } catch (dbError) {
                console.error('[System Status] Database connection failed:', dbError);
              }

              // Determine config source
              let configSource = 'default';
              try {
                const configCheck = await db('system_configuration').select('key').limit(1);
                if (configCheck && configCheck.length > 0) {
                  configSource = 'db';
                }
              } catch (e) {
                // Check if file exists
                const configPath = path.join(__dirname, '../public/config/system-config.json');
                if (fs.existsSync(configPath)) {
                  configSource = 'file';
                }
              }

              // Count modules loaded
              let modulesLoaded = 0;
              try {
                const routesPath = path.join(__dirname, '../public/config/generated-routes.json');
                if (fs.existsSync(routesPath)) {
                  const routesData = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
                  modulesLoaded = Array.isArray(routesData) ? routesData.length : 0;
                }
              } catch (e) {
                console.error('[System Status] Failed to count modules:', e);
              }

              // Get uptime in milliseconds
              const uptimeMs = process.uptime() * 1000;

              const status = {
                env: process.env.NODE_ENV || 'development',
                db: {
                  connected: dbConnected,
                  client: dbClient,
                  database: dbDatabase,
                  // Redact sensitive info
                  host: process.env.VITE_DB_HOST ? maskString(process.env.VITE_DB_HOST) : 'unknown',
                  port: process.env.VITE_DB_PORT || 'unknown'
                },
                configSource,
                modulesLoaded,
                uptimeMs: Math.round(uptimeMs),
                timestamp: new Date().toISOString(),
                responseTime: Date.now() - startTime
              };

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(status));
            } catch (error: any) {
              console.error('[System Status] Error:', error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                error: 'Failed to fetch system status',
                message: error.message
              }));
            }
          })();
          return;
        }

        // Get system logs with filtering
        if (req.url?.startsWith('/api/system/logs') && req.method === 'GET') {
          (async () => {
            try {
              const url = new URL(req.url!, `http://${req.headers.host}`);
              const page = parseInt(url.searchParams.get('page') || '1');
              const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
              const type = url.searchParams.get('type'); // status|audit|security|boot|migration|setup
              const level = url.searchParams.get('level'); // info|warn|error
              const startDate = url.searchParams.get('startDate');
              const endDate = url.searchParams.get('endDate');

              let query = db('system_logs').select('*');

              // Apply filters
              if (type) {
                query = query.where('type', type);
              }
              if (level) {
                query = query.where('level', level);
              }
              if (startDate) {
                query = query.where('created_at', '>=', startDate);
              }
              if (endDate) {
                query = query.where('created_at', '<=', endDate);
              }

              // Get total count
              const countQuery = query.clone().count('* as count');
              const [{ count }] = await countQuery;
              const total = Number(count);

              // Get paginated results
              const offset = (page - 1) * limit;
              const logs = await query
                .orderBy('created_at', 'desc')
                .limit(limit)
                .offset(offset);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                logs,
                pagination: {
                  page,
                  limit,
                  total,
                  pages: Math.ceil(total / limit)
                }
              }));
            } catch (error: any) {
              console.error('[System Logs] Error:', error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                error: 'Failed to fetch system logs',
                message: error.message
              }));
            }
          })();
          return;
        }

        // Add system log entry
        if (req.url === '/api/system/logs' && req.method === 'POST') {
          let body = '';
          req.on('data', c => body += c.toString());
          req.on('end', async () => {
            try {
              const { type, level, message, meta } = JSON.parse(body || '{}');

              if (!type || !message) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: false,
                  error: 'type and message are required'
                }));
                return;
              }

              await db('system_logs').insert({
                type,
                level: level || 'info',
                message,
                meta: meta ? JSON.stringify(meta) : null,
                created_at: new Date()
              });

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: 'Log entry created'
              }));
            } catch (error: any) {
              console.error('[System Logs] Error adding log:', error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                error: 'Failed to add log entry',
                message: error.message
              }));
            }
          });
          return;
        }
        // /* SYSTEM STATUS API END */

        next();
      });
    }
  };
}

// Helper function to update env variables
function updateEnvVar(content: string, key: string, value: string): string {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    return content.replace(regex, `${key}=${value}`);
  } else {
    return content + `\n${key}=${value}`;
  }
}

// Helper function to mask sensitive strings (show first 3 and last 3 characters)
function maskString(str: string): string {
  if (str.length <= 6) return '***';
  return str.substring(0, 3) + '***' + str.substring(str.length - 3);
}
