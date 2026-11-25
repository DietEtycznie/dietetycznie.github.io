#!/usr/bin/env node
/**
 * DietEtycznie Firestore Seed & Backup Utility
 *
 * Usage:
 *   FIREBASE_API_KEY=... FIREBASE_PROJECT_ID=diet-39ccb npm run seed
 *   FIREBASE_API_KEY=... FIREBASE_PROJECT_ID=diet-39ccb npm run backup
 *
 * You can also run against local Firebase Emulator:
 *   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_PROJECT_ID=diet-39ccb npm run seed
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase/app";
import {
  collection,
  connectFirestoreEmulator,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const isBackup = process.argv.includes("--backup");
const projectId = process.env.FIREBASE_PROJECT_ID || "diet-39ccb";
const apiKey = process.env.FIREBASE_API_KEY || "demo-key";
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;

const app = initializeApp({
  apiKey,
  projectId,
  authDomain: `${projectId}.firebaseapp.com`,
});
const db = getFirestore(app);

if (emulatorHost) {
  const [host, portStr] = emulatorHost.split(":");
  connectFirestoreEmulator(db, host, Number(portStr || 8080));
  console.log(`Connected to Firestore Emulator at ${emulatorHost}`);
}

async function runBackup() {
  const outDir = path.join(rootDir, "backups");
  fs.mkdirSync(outDir, { recursive: true });

  const collections = ["recipes", "medicalConditions", "dietPlans"];
  const dump = {
    version: 2,
    exportedAt: new Date().toISOString(),
    projectId,
  };

  for (const name of collections) {
    const snap = await getDocs(collection(db, name));
    dump[name] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    console.log(`Exported ${dump[name].length} docs from '${name}'`);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outFile = path.join(outDir, `firestore-backup-${stamp}.json`);
  fs.writeFileSync(outFile, JSON.stringify(dump, null, 2), "utf8");
  console.log(`Backup saved to ${outFile}`);
}

async function runSeed() {
  const seedFileArg = process.argv.find((a) => a.endsWith(".json"));
  if (!seedFileArg) {
    console.log(
      "Tip: Pass a backup JSON file (e.g. `node scripts/seed-firestore.mjs backups/latest.json`)\n" +
        "or use the built-in 1-click Seed button inside the Admin Panel (/admin).",
    );
    process.exit(0);
  }

  const payload = JSON.parse(fs.readFileSync(path.resolve(seedFileArg), "utf8"));
  for (const colName of ["recipes", "medicalConditions", "dietPlans"]) {
    const items = payload[colName] || [];
    for (const item of items) {
      const id = item.id || item.uid;
      if (!id) continue;
      const { id: _id, uid: _uid, ...data } = item;
      await setDoc(doc(db, `${colName}/${id}`), data, { merge: true });
    }
    console.log(`Seeded ${items.length} docs into '${colName}'`);
  }
  console.log("Seed completed successfully.");
}

(isBackup ? runBackup() : runSeed()).catch((err) => {
  console.error("Operation failed:", err.message || err);
  process.exit(1);
});
