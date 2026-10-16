import { mkdir, readFile, writeFile } from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const dataDir = path.resolve(currentDir, "../data");
const inquiryFile = path.join(dataDir, "inquiries.json");

export async function saveInquiry(inquiry) {
  await mkdir(dataDir, { recursive: true });

  const existing = await readInquiries();

  const record = {
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    ...inquiry
  };

  existing.unshift(record);

  await writeFile(inquiryFile, JSON.stringify(existing, null, 2), "utf8");

  return record;
}

export async function readInquiries() {
  try {
    const content = await readFile(inquiryFile, "utf8");
    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}