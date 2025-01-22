import { generateKeyPairSync } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// Directory to store the keys
const keysDirectory = path.resolve(__dirname, '../keys');

// Check if the directory exists, if not, create it
if (!fs.existsSync(keysDirectory)) {
  fs.mkdirSync(keysDirectory);
}

// Generate RSA key pair
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 4096, // Use 4096-bit RSA key
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

// Save the keys to files in the 'keys' directory
fs.writeFileSync(path.join(keysDirectory, 'publicKey.pem'), publicKey);
fs.writeFileSync(path.join(keysDirectory, 'privateKey.pem'), privateKey);

// Now write the keys into the .env file
const envPath = path.resolve(__dirname, '../.env');
const envContent = `
PUBLIC_KEY="${publicKey}"

PRIVATE_KEY="${privateKey}"
`;

fs.appendFileSync(envPath, envContent);

console.log('RSA key pair generated!');
