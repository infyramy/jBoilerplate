import { db, schema } from './index';
import { eq, and, or, like, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';

/**
 * Generic repository class for database operations
 */
export class Repository<T extends keyof typeof schema> {
  private tableName: T;

  constructor(tableName: T) {
    this.tableName = tableName;
  }

  /**
   * Get table reference
   */
  private get table() {
    return schema[this.tableName];
  }

  /**
   * Find all records with optional filtering
   */
  async findAll(options?: {
    where?: SQL<unknown>;
    limit?: number;
    offset?: number;
    orderBy?: { column: string; direction: 'asc' | 'desc' };
  }) {
    let query = db.select().from(this.table);
    
    if (options?.where) {
      query = query.where(options.where);
    }
    
    if (options?.orderBy) {
      query = query.orderBy(
        sql`${sql.identifier(options.orderBy.column)} ${options.orderBy.direction === 'desc' ? sql`DESC` : sql`ASC`}`
      );
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.offset(options.offset);
    }
    
    return await query;
  }

  /**
   * Find a single record by id
   */
  async findById(id: number) {
    const result = await db.select()
      .from(this.table)
      .where(eq((this.table as any).id, id))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Find a single record by UUID
   */
  async findByUuid(uuid: string) {
    const result = await db.select()
      .from(this.table)
      .where(eq((this.table as any).uuid, uuid))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Create a new record
   */
  async create(data: Record<string, any>) {
    const result = await db.insert(this.table)
      .values(data)
      .returning();
    
    return result[0];
  }

  /**
   * Update a record by id
   */
  async updateById(id: number, data: Record<string, any>) {
    const result = await db.update(this.table)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq((this.table as any).id, id))
      .returning();
    
    return result[0];
  }

  /**
   * Delete a record by id
   */
  async deleteById(id: number) {
    const result = await db.delete(this.table)
      .where(eq((this.table as any).id, id))
      .returning();
    
    return result[0];
  }

  /**
   * Count records with optional filtering
   */
  async count(options?: { where?: SQL<unknown> }) {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(this.table)
      .where(options?.where || sql`TRUE`);
    
    return Number(result[0]?.count || 0);
  }
}

// Export specific repositories for each table
export const usersRepository = new Repository('users');
export const teamsRepository = new Repository('teams');
export const teamMembersRepository = new Repository('teamMembers');
export const projectsRepository = new Repository('projects');
export const settingsRepository = new Repository('settings'); 