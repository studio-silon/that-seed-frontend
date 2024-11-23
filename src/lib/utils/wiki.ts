export function urlEncoding(url: string) {
	return encodeURI(url).replace(/\?/gm, '%3F').replace(/&/gm, '%25').replace(/#/gm, '%23');
}

export function splitName(name: string): [string, string] {
	const splitedName = name.split(':');
	if (splitedName.length < 2) return ['', splitedName[0]];

	const namespace = splitedName[0];
	const title = splitedName.slice(1).join(':');

	return [namespace, title];
}

export function joinName(namespace: string, title: string) {
	return namespace ? namespace + ':' + title : title;
}

export function ReverTypeToMessage(rever: {type: number; data: string}) {
    try {
        switch (rever.type) {
            case 0:
                return '';

            case 1:
                const name = JSON.parse(rever.data) as [string, string];
                return `'${name[0]}'에서 '${name[1]}'로 이동`;

            case 2:
                return '삭제';

            case 3:
                const ver = JSON.parse(rever.data)[0] as number;

                return `r${ver}로 되돌림`;
        }
    } catch (error) {
        return '';
    }
}
