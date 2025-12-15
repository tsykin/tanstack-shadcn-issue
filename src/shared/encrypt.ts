import crypto from 'node:crypto';
import { SERVER_ENV } from '@/shared/env.server';

// Separator between IV and encrypted data
// Tip: Use a separator that is unlikely to appear in hex strings, ex. colon ":"
const separator = ':';

// AES-256-CBC requires a 32-byte key and a 16-byte IV
const algorithm = 'aes-256-cbc';
const ivLength = 16;
const keyDerivationIterations = 100000; // PBKDF2 iterations

/**
 * Derives a 32-byte key from a password using PBKDF2.
 * This is more secure than simple SHA-256 hashing.
 */
function deriveKey(password: string, salt: Buffer): Uint8Array {
	return Uint8Array.from(
		crypto.pbkdf2Sync(password, salt, keyDerivationIterations, 32, 'sha256')
	);
}

/**
 * Encrypts data using AES-256-CBC with PBKDF2 key derivation.
 * Uses the BETTER_AUTH_SECRET from environment as the encryption key.
 *
 * @param data - The data to encrypt
 * @returns Encrypted string in format: salt:iv:encryptedData
 */
export async function customEncrypt(data: string): Promise<string> {
	const encryptionKey = SERVER_ENV.BETTER_AUTH_SECRET;
	const salt = crypto.randomBytes(16); // Random salt for key derivation
	const iv = crypto.randomBytes(ivLength); // Random IV for encryption

	const key = deriveKey(encryptionKey, salt);

	const cipher = crypto.createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(data, 'utf-8', 'hex');
	encrypted += cipher.final('hex');

	// Combine salt, IV, and encrypted data: salt:iv:encryptedData
	return `${salt.toString('hex')}${separator}${iv.toString('hex')}${separator}${encrypted}`;
}

/**
 * Decrypts data encrypted with customEncrypt.
 * Uses the BETTER_AUTH_SECRET from environment as the decryption key.
 *
 * @param encryptedData - Encrypted string in format: salt:iv:encryptedData
 * @returns Decrypted string
 * @throws Error if the encrypted data format is invalid
 */
export async function customDecrypt(encryptedData: string): Promise<string> {
	const encryptionKey = SERVER_ENV.BETTER_AUTH_SECRET;
	const parts = encryptedData.split(separator);

	if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2])
		throw new Error('Invalid encrypted data format.');

	const [saltHex, ivHex, encryptedHex] = parts;
	const salt = Buffer.from(saltHex, 'hex');
	const iv = Buffer.from(ivHex, 'hex');

	const key = deriveKey(encryptionKey, salt);

	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	let decrypted = decipher.update(encryptedHex, 'hex', 'utf-8');
	decrypted += decipher.final('utf-8');

	return decrypted;
}

// Example usage:
// const encrypted = await customEncrypt('sensitive data');
// const decrypted = await customDecrypt(encrypted);
// console.log(decrypted); // => 'sensitive data'
