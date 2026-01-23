/**
 * URL 验证和清理工具
 * 用于验证外部 URL 的安全性
 */

/**
 * 允许的 URL 协议白名单
 */
const ALLOWED_PROTOCOLS = ["http:", "https:"];

/**
 * URL 主机白名单（可选，如果为空则不限制）
 * 可以根据需要添加允许的域名
 */
const ALLOWED_HOSTS: string[] = [
	// 添加允许的域名，例如：
	// "img.undf.top",
	// "imgchr.com",
	// "s41.ax1x.com",
];

/**
 * 验证 URL 是否安全
 * @param urlString - 要验证的 URL 字符串
 * @returns 如果 URL 安全则返回 true，否则返回 false
 */
export function isValidUrl(urlString: string): boolean {
	if (!urlString || typeof urlString !== "string") {
		return false;
	}

	try {
		const url = new URL(urlString);

		// 检查协议
		if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
			return false;
		}

		// 如果配置了主机白名单，则检查主机
		if (ALLOWED_HOSTS.length > 0) {
			const hostname = url.hostname.toLowerCase();
			const isAllowed = ALLOWED_HOSTS.some(
				(allowedHost) =>
					hostname === allowedHost.toLowerCase() ||
					hostname.endsWith(`.${allowedHost.toLowerCase()}`),
			);
			if (!isAllowed) {
				return false;
			}
		}

		return true;
	} catch {
		// URL 解析失败
		return false;
	}
}

/**
 * 清理和验证 URL
 * @param urlString - 要清理的 URL 字符串
 * @param fallback - 验证失败时返回的默认值
 * @returns 清理后的 URL 或 fallback
 */
export function sanitizeUrl(
	urlString: string,
	fallback: string = "",
): string {
	if (!urlString || typeof urlString !== "string") {
		return fallback;
	}

	const trimmed = urlString.trim();

	// 如果是相对路径，直接返回
	if (trimmed.startsWith("/") || trimmed.startsWith("./")) {
		return trimmed;
	}

	// 验证绝对 URL
	if (isValidUrl(trimmed)) {
		return trimmed;
	}

	return fallback;
}

/**
 * 批量验证 URL 数组
 * @param urls - URL 数组
 * @returns 过滤后的有效 URL 数组
 */
export function filterValidUrls(urls: string[]): string[] {
	return urls.filter((url) => {
		const trimmed = url.trim();
		// 允许相对路径
		if (trimmed.startsWith("/") || trimmed.startsWith("./")) {
			return true;
		}
		// 验证绝对 URL
		return isValidUrl(trimmed);
	});
}
