// ==============================================================================
// ENTERPRISE POSTGRESQL MIGRATION RUNNER
// Applies versioned SQL migrations transactionally with schema tracking
// ==============================================================================

import fs from 'node:fs';
import path from 'node:path';

export class MigrationRunner {
  /**
   * Discovers and sorts all SQL migration files in numerical order
   */
  static loadMigrationFiles(migrationsDir) {
    if (!fs.existsSync(migrationsDir)) return [];

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    return files.map((filename) => ({
      version: filename.replace('.sql', ''),
      filename,
      sqlContent: fs.readFileSync(path.join(migrationsDir, filename), 'utf-8'),
    }));
  }

  /**
   * Generates execution plan for unapplied migrations
   */
  static planMigrations(allMigrations, appliedVersions) {
    return allMigrations.filter((m) => !appliedVersions.has(m.version));
  }
}
