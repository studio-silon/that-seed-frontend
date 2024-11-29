import { urlEncoding } from './utils/wiki';

export class Backend {
	private fetch: typeof fetch;

	constructor(fetchFn: typeof fetch) {
		this.fetch = fetchFn;
	}

	async getData() {
		const response = await this.fetch('/api/?_data=root');

		const json = await response.json();

		return {
			user: json.user
				? {
						id: +json.user.id,
						username: '' + json.user.username,
						createdAt: '' + json.user.createdAt,
						updatedAt: '' + json.user.updatedAt,
						permissions: json.user.permissions as string[],
						isOwner: !!json.user.siteInfo
					}
				: null,
			site: {
				title: '' + json.site.title,
				description: '' + json.site.description,
				footer: '' + json.site.footer,
				frontPage: '' + json.site.frontPage
			}
		};
	}

	async getRecentChanges(index: number = 1) {
		const response = await this.fetch(
			'/api/recentChanges?_data=routes%2FrecentChanges&page=' + index
		);

		const json = await response.json();

		return json as {
			changes: {
				id: number;
				title: string;
				namespace: string;
				content: string;
				deleted: boolean;
				rever: number;
				createdAt: string;
				updatedAt: string;
				versions: {
					id: number;
					rever: number;
					log: string;
					type: number;
					data: string;
					added: number;
					removed: number;
					content: string;
					createdAt: string;
					wikiId: number;
					userId: number;
					ipAddress: string;
					user?: {
						username: string;
					};
				}[];
			}[];
			page: number;
			totalPages: number;
		};
	}

	async getDocs(page: string, rever?: string | null) {
		const response = await fetch(
			'/api/wiki/' +
				urlEncoding(page) +
				'?_data=routes%2Fwiki.%24' +
				(typeof rever === 'string' ? '&rever=' + rever : '')
		);
		if (!response.ok || !response.body) {
			throw new Error('Network response was not ok');
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let done: boolean, value: Uint8Array | undefined;
		let result = '';

		while (true) {
			({ done, value } = await reader.read());
			if (done) break;
			result += decoder.decode(value, { stream: true });
		}

		result += decoder.decode();
		const lines = result.split('\n');
		const jsonData = JSON.parse(lines[0]);
		const additionalDataLine = lines[2].replace('data:', '').trim();
		const additionalData = lines[2] !== '' ? JSON.parse(additionalDataLine) : undefined;

		return {
			wiki: jsonData.wiki as
				| {
						id: number;
						title: string;
						namespace: string;
						name: string;
						forbidden: boolean;
						content: string;
						discussions?: { id: number }[];
						stars: { id: number }[];
						rever: number;
				  }
				| undefined,
			canEdit: Boolean(jsonData.canEdit),
			canMove: Boolean(jsonData.canMove),
			canDelete: Boolean(jsonData.canDelete),
			isStared: Boolean(jsonData.isStared),
			editRequests: jsonData.editRequests.map((req: any) => ({
				id: +req.id,
				wikiId: +req.wikiId,
				type: +req.type,
				newNamespace: '' + req.newNamespace,
				newTitle: '' + req.newTitle,
				content: '' + req.content,
				log: '' + req.log,
				ipAddress: '' + req.ipAddress,
				status: +req.status,
				reviewedAt: '' + req.reviewedAt,
				reviewLog: '' + req.reviewLog,
				username: '' + (req.user?.username ?? ''),
				createdAt: '' + req.createdAt,
				updatedAt: '' + req.updatedAt
			})),
			parse: additionalData?.parse as
				| {
						value: string;
						categories: string[];
						backlinks: string[];
				  }
				| undefined
		};
	}

	async toggleStar(page: string) {
		const response = await fetch('/api/wiki/' + urlEncoding(page), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				actionType: 'toggle_star'
			})
		});

		return response.ok;
	}

	async getHistory(page: string, index: number = 1) {
		const response = await fetch(
			'/api/history/' + urlEncoding(page) + '?_data=routes%2Fhistory.%24&page=' + index
		);

		const json = await response.json();

		return json as {
			wiki: {
				id: number;
				title: string;
				namespace: string;
				versions: {
					id: number;
					rever: number;
					log: string;
					type: number;
					data: string;
					added: number;
					removed: number;
					content: string;
					createdAt: string;
					wikiId: number;
					userId: number;
					ipAddress: string;
					user?: {
						username: string;
					};
				}[];
			};
			totalPages: number;
		};
	}

	async editDocs(page: string, content: string, log: string) {
		const response = await fetch('/api/wiki/' + urlEncoding(page), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				title: page,
				isDeleting: '0',
				content,
				log
			})
		});

		return response.ok;
	}

	async deleteDocs(page: string, log: string) {
		const response = await fetch('/api/wiki/' + urlEncoding(page), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				title: page,
				isDeleting: '1',
				content: '',
				log
			})
		});

		return response.ok;
	}

	async moveDocs(page: string, title: string, content: string, log: string) {
		const response = await fetch('/api/wiki/' + urlEncoding(page), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				title: title,
				isDeleting: '0',
				content,
				log
			})
		});

		return response.ok;
	}

	async login(username: string, password: string) {
		const response = await fetch('/api/login/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			credentials: 'include',
			body: new URLSearchParams({
				username,
				password
			})
		});

		console.log(response.headers.entries());

		return response.ok;
	}

	async signup(username: string, password: string) {
		const response = await fetch('/api/signup/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				username,
				password
			})
		});

		return response.ok;
	}

	async logout() {
		const response = await fetch('/api/logout/');

		return response.ok;
	}
}
