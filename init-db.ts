import { initDb } from "@/lib/db";

async function main() {
  try {
    await initDb();
    console.log("✅ Database initialized");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed:", error);
    process.exit(1);
  }
}

main();
