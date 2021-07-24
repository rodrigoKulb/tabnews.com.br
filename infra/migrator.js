const { join, resolve } = require("path");
import databaseFactory from "infra/database.js";
import migrationRunner from "node-pg-migrate";

export default function Migrator() {
  const defaultConfigurations = {
    dir: join(resolve("."), "infra", "migrations"),
    direction: "up",
    migrationsTable: "migrations",
    verbose: false,
  };

  async function listPendingMigrations() {
    const database = databaseFactory();
    const databaseClient = await database.getNewConnectedClient();
    const pendingMigrations = await migrationRunner({
      ...defaultConfigurations,
      dbClient: databaseClient,
      dryRun: true,
    });

    await databaseClient.end();

    return pendingMigrations;
  }

  async function runPendingMigrations() {
    const database = databaseFactory();
    const databaseClient = await database.getNewConnectedClient();

    const migratedMigrations = await migrationRunner({
      ...defaultConfigurations,
      dbClient: databaseClient,
      dryRun: false,
    });

    await databaseClient.end();

    return migratedMigrations;
  }

  return {
    listPendingMigrations,
    runPendingMigrations,
  };
}