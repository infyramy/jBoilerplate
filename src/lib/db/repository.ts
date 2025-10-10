import { db } from './index';

/**
 * Generic repository class for database operations
 */
export class Repository {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Find all records with optional filtering
   */
  async findAll(options?: {
    where?: Record<string, any>;
    limit?: number;
    offset?: number;
    orderBy?: { column: string; direction: 'asc' | 'desc' };
  }) {
    let query = db(this.tableName).select('*');
    
    if (options?.where) {
      query = query.where(options.where);
    }
    
    if (options?.orderBy) {
      query = query.orderBy(options.orderBy.column, options.orderBy.direction);
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
    const result = await db(this.tableName)
      .where({ id })
      .first();
    
    return result || null;
  }

  /**
   * Find a single record by UUID
   */
  async findByUuid(uuid: string) {
    const result = await db(this.tableName)
      .where({ uuid })
      .first();
    
    return result || null;
  }

  /**
   * Create a new record
   */
  async create(data: Record<string, any>) {
    const result = await db(this.tableName)
      .insert(data)
      .returning('*');
    
    return result[0];
  }

  /**
   * Update a record by id
   */
  async updateById(id: number, data: Record<string, any>) {
    const now = new Date();
    const result = await db(this.tableName)
      .where({ id })
      .update({
        ...data,
        updated_at: now
      })
      .returning('*');
    
    return result[0];
  }

  /**
   * Delete a record by id
   */
  async deleteById(id: number) {
    const result = await db(this.tableName)
      .where({ id })
      .del()
      .returning('*');
    
    return result[0];
  }

  /**
   * Count records with optional filtering
   */
  async count(options?: { where?: Record<string, any> }) {
    const result = await db(this.tableName)
      .where(options?.where || {})
      .count('* as count')
      .first();
    
    return Number(result?.count || 0);
  }
}

// Export specific repositories for each table
export const usersRepository = new Repository('users');
export const teamsRepository = new Repository('teams');
export const teamMembersRepository = new Repository('team_members');
export const projectsRepository = new Repository('projects');
export const settingsRepository = new Repository('settings'); 