import express from 'express';
import ViteExpress from 'vite-express';
import { createRequestHandler } from '@remix-run/express';

const app = express();

async function startRemix() {
	app.use(
		'/api/assets',
		express.static('./not-seed/build/client/assets', { immutable: true, maxAge: '1y' })
	);
	app.use('/api', express.static('./not-seed/build/client', { maxAge: '1h' }));
	app.use('/', express.static('public', { maxAge: '1h' }));

	const remixHandler = createRequestHandler({
		build: await import('./not-seed/build/server/index.js')
	});
	app.use('/api', remixHandler);
}

async function startServer() {
	await startRemix();

	const server = app.listen(3000, () => {
		console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
	});

	ViteExpress.bind(app, server);
}

startServer();
