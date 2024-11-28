import { readFileSync } from 'fs';
import { resolve } from 'path';

export const load = async () => {
	const configPath = resolve('config/index.json');
	const fileContent = readFileSync(configPath, 'utf-8');
	const data = JSON.parse(fileContent);

	const version = data.version;

	const { engine, backend, frontend } = version;

	return {
		engine_v: engine as string,
		back_v: backend as string,
		front_v: frontend as string
	};
};
