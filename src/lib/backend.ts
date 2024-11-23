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

	async getRecentChanges() {
		const response = await this.fetch('/api/recentChanges?_data=routes%2FrecentChanges');

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

	async getDocs(page: string) {
		const response = await fetch('/api/wiki/' + page + '?_data=routes%2Fwiki.%24');
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
						discussions?: { id: number }[];
				  }
				| undefined,
			parse: additionalData?.parse as
				| {
						value: string;
						categories: string[];
						backlinks: string[];
				  }
				| undefined
		};
	}
}
