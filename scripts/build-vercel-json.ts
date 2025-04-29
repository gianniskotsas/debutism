import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config(); // Load from .env.local or .env

const secret = process.env.DEBUTISM_SECRET;

if (!secret) {
  throw new Error('Missing DEBUTISM_SECRET in environment variables');
}

const templatePath = path.join(process.cwd(), 'vercel.template.json');
const outputPath = path.join(process.cwd(), 'vercel.json');

const template = fs.readFileSync(templatePath, 'utf-8');
const filled = template.replace('__DEBUTISM_SECRET__', secret);

fs.writeFileSync(outputPath, filled, "utf-8");

console.log("✅ vercel.json built successfully");
