export function formatRelativeDate(date: string) {
	const d = new Date(date);
	const now = new Date();
	const diff = now.getTime() - d.getTime();
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor(diff / (1000 * 60));

	if (days > 0) return `${days}일 전`;
	if (hours > 0) return `${hours}시간 전`;
	return `${minutes}분 전`;
}
