/**
 * 统一的日志工具
 * 在生产环境中自动禁用调试日志，仅保留错误日志
 */

type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
	private isDev = import.meta.env.DEV;
	private isProd = import.meta.env.PROD;

	/**
	 * 调试日志 - 仅在开发环境输出
	 */
	debug(message: string, ...args: unknown[]): void {
		if (this.isDev) {
			console.debug(`[DEBUG] ${message}`, ...args);
		}
	}

	/**
	 * 信息日志 - 仅在开发环境输出
	 */
	info(message: string, ...args: unknown[]): void {
		if (this.isDev) {
			console.info(`[INFO] ${message}`, ...args);
		}
	}

	/**
	 * 警告日志 - 开发和生产环境都输出
	 */
	warn(message: string, ...args: unknown[]): void {
		console.warn(`[WARN] ${message}`, ...args);
	}

	/**
	 * 错误日志 - 开发和生产环境都输出
	 */
	error(message: string, error?: unknown, ...args: unknown[]): void {
		if (error instanceof Error) {
			console.error(`[ERROR] ${message}`, error, ...args);
		} else {
			console.error(`[ERROR] ${message}`, error, ...args);
		}
	}

	/**
	 * 条件日志 - 根据环境决定是否输出
	 */
	log(level: LogLevel, message: string, ...args: unknown[]): void {
		switch (level) {
			case "debug":
				this.debug(message, ...args);
				break;
			case "info":
				this.info(message, ...args);
				break;
			case "warn":
				this.warn(message, ...args);
				break;
			case "error":
				this.error(message, ...args);
				break;
		}
	}
}

// 导出单例
export const logger = new Logger();
