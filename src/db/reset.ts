import fs from 'node:fs/promises';
import { createInterface } from 'node:readline';
import 'dotenv/config';
import { reset } from 'drizzle-seed';
import { db } from '@/db';
import * as schema from '@/db/schema';

export function askConfirmation(question: string): Promise<boolean> {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		rl.question(`${question} (y/N): `, (answer) => {
			rl.close();
			resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
		});
	});
}

async function main() {
	console.log(
		'⚠️  WARNING: This will permanently delete ALL data from the database!'
	);
	console.log('This action cannot be undone.');

	const confirmed = await askConfirmation(
		'Are you sure you want to reset the database?'
	);
	if (!confirmed) {
		console.log('Operation cancelled.');
		return;
	}

	console.log('Resetting database...');
	await reset(db, schema);
	console.log('Database reset successfully!');
}
main()
	.then(() => {
		console.log('Database reset completed successfully');
		process.exit(0);
	})
	.catch((error) => {
		console.error('Database reset failed:', error);
		process.exit(1);
	});
