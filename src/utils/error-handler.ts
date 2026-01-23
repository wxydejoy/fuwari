/**
 * 错误处理工具
 * 提供统一的错误处理和错误边界支持
 */

import { logger } from "./logger";

/**
 * 错误类型枚举
 */
export enum ErrorType {
	NETWORK = "NETWORK",
	VALIDATION = "VALIDATION",
	NOT_FOUND = "NOT_FOUND",
	UNKNOWN = "UNKNOWN",
}

/**
 * 自定义错误类
 */
export class AppError extends Error {
	constructor(
		public type: ErrorType,
		message: string,
		public originalError?: unknown,
	) {
		super(message);
		this.name = "AppError";
		// 保持正确的原型链
		Object.setPrototypeOf(this, AppError.prototype);
	}
}

/**
 * 安全执行异步函数，捕获并记录错误
 */
export async function safeExecute<T>(
	fn: () => Promise<T>,
	fallback: T,
	errorMessage?: string,
): Promise<T> {
	try {
		return await fn();
	} catch (error) {
		logger.error(
			errorMessage || "Error executing function",
			error,
		);
		return fallback;
	}
}

/**
 * 安全执行同步函数，捕获并记录错误
 */
export function safeExecuteSync<T>(
	fn: () => T,
	fallback: T,
	errorMessage?: string,
): T {
	try {
		return fn();
	} catch (error) {
		logger.error(
			errorMessage || "Error executing function",
			error,
		);
		return fallback;
	}
}

/**
 * 包装异步函数，自动处理错误
 */
export function withErrorHandling<T extends unknown[], R>(
	fn: (...args: T) => Promise<R>,
	fallback: R | ((error: unknown) => R),
) {
	return async (...args: T): Promise<R> => {
		try {
			return await fn(...args);
		} catch (error) {
			logger.error("Error in wrapped function", error);
			if (typeof fallback === "function") {
				return (fallback as (error: unknown) => R)(error);
			}
			return fallback;
		}
	};
}

/**
 * 验证并转换错误为 AppError
 */
export function normalizeError(error: unknown): AppError {
	if (error instanceof AppError) {
		return error;
	}

	if (error instanceof Error) {
		return new AppError(ErrorType.UNKNOWN, error.message, error);
	}

	return new AppError(
		ErrorType.UNKNOWN,
		"An unknown error occurred",
		error,
	);
}
