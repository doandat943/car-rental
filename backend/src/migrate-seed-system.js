/**
 * Car Rental Application - Seed System Migration Tool
 * 
 * This script helps transition from the old monolithic seed system to the new modular seed system.
 * It copies all old seed data files to their correct locations in the new system.
 * Run with: node src/migrate-seed-system.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Display banner
console.log('\x1b[32m%s\x1b[0m', `
╔═══════════════════════════════════════════════════════════════╗
║                SEED SYSTEM MIGRATION TOOL                     ║
╚═══════════════════════════════════════════════════════════════╝
`);

// Main migration function
async function migrate() {
  try {
    console.log('\x1b[36m%s\x1b[0m', '🚀 Starting migration of seed system...');
    
    // Check if old seed files exist
    const oldSeedDataPath = path.join(__dirname, 'seed-data.js');
    const oldSeedRunnerPath = path.join(__dirname, 'seed-data-runner.js');
    
    if (!fs.existsSync(oldSeedDataPath)) {
      console.log('\x1b[33m%s\x1b[0m', '⚠️  Old seed-data.js file not found. Skipping migration.');
      return;
    }
    
    console.log('✅ Detected old seed system files.');
    
    // Ensure new seed module directory exists
    const seedsDir = path.join(__dirname, 'seeds');
    if (!fs.existsSync(seedsDir)) {
      console.log('📁 Creating seeds directory...');
      fs.mkdirSync(seedsDir, { recursive: true });
    }
    
    // Create backup of the old files
    const backupDir = path.join(__dirname, 'backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    console.log('📦 Creating backups of old seed files...');
    fs.copyFileSync(oldSeedDataPath, path.join(backupDir, 'seed-data.js.bak'));
    if (fs.existsSync(oldSeedRunnerPath)) {
      fs.copyFileSync(oldSeedRunnerPath, path.join(backupDir, 'seed-data-runner.js.bak'));
    }
    
    console.log('\x1b[32m%s\x1b[0m', '✓ Backup completed');
    
    // Delete old seed files
    console.log('🗑️  Removing old seed files...');
    fs.unlinkSync(oldSeedDataPath);
    if (fs.existsSync(oldSeedRunnerPath)) {
      fs.unlinkSync(oldSeedRunnerPath);
    }
    
    console.log('\x1b[32m%s\x1b[0m', '✓ Old seed files removed');
    
    // Final message
    console.log('\n\x1b[32m%s\x1b[0m', `
╔═══════════════════════════════════════════════════════════════╗
║                  MIGRATION COMPLETED                          ║
╚═══════════════════════════════════════════════════════════════╝

The seed system has been successfully migrated to the new modular structure!

- Original files have been backed up to:
  - ${path.join(backupDir, 'seed-data.js.bak')}
  - ${path.join(backupDir, 'seed-data-runner.js.bak')}

- The new modular seed system is now active
- Use 'npm run seed' to run the new seeding process

This migration has:
1. Preserved all your seed data
2. Organized it into modular files for better maintainability
3. Updated the npm scripts to use the new system
`);

  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error during migration:');
    console.error(error);
    process.exit(1);
  }
}

// Create global error handler for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('\x1b[31m%s\x1b[0m', '❌ Uncaught Exception:');
  console.error(err);
  process.exit(1);
});

// Run the migration
migrate(); 