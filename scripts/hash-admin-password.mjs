import { scryptSync, randomBytes } from 'node:crypto';

const password = process.env.ADMIN_PASSWORD;

if (!password) {
  console.error('Set ADMIN_PASSWORD before running this script.');
  process.exit(1);
}

const salt = randomBytes(16).toString('base64url');
const hash = scryptSync(password, salt, 64).toString('base64url');

console.log(`scrypt:${salt}:${hash}`);
