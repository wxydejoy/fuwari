/**
 * 友链数据解析工具
 * 支持解析 Markdown 格式的友链数据，包括 #desc: 注释
 */

export interface Friend {
	name: string;
	url: string;
	avatar: string;
	description: string;
}

/**
 * 解析友链 Markdown 内容
 * 支持的格式：
 * ####  名称
 *   - https://url
 *   - https://avatar-url
 *   - 描述
 * 
 * 或者带 #desc: 注释的格式：
 * ####  名称
 *   - https://url
 *   - https://avatar-url
 *   #desc: 描述（可选）
 *   - 描述
 * 
 * 隐藏友链（使用 #hidden: 标记）：
 * ####  名称
 *   #hidden: true
 *   - https://url
 *   - https://avatar-url
 *   - 描述
 * 
 * @param content - Markdown 内容
 * @returns 解析后的友链数组（已过滤隐藏的友链）
 */
export function parseFriends(content: string): Friend[] {
	const friends: Friend[] = [];
	
	// 移除 HTML 注释包裹的内容（包括多行注释）
	// 匹配 <!-- ... --> 格式的注释，包括跨行的
	let cleanedContent = content.replace(/<!--[\s\S]*?-->/g, '');
	
	// 按 #### 分割成多个友链块
	const friendBlocks = cleanedContent.split(/^####\s+/m).filter(block => block.trim());
	
	for (const block of friendBlocks) {
		const lines = block.split('\n').map(line => line.trim()).filter(line => line);
		
		if (lines.length < 3) continue; // 至少需要名称、URL、头像、描述
		
		// 检查是否有 #hidden: 标记
		const isHidden = lines.some(line => 
			line.startsWith('#hidden:') && 
			(line.replace(/^#hidden:\s*/i, '').trim().toLowerCase() === 'true' || 
			 line.replace(/^#hidden:\s*/i, '').trim() === '1')
		);
		
		// 如果标记为隐藏，则跳过
		if (isHidden) continue;
		
		// 第一行是名称
		const name = lines[0].trim();
		
		// 查找 URL 行（以 - http 开头）
		const urlLine = lines.find(line => line.startsWith('- http'));
		if (!urlLine) continue;
		const url = urlLine.replace(/^-\s*/, '').trim();
		
		// 查找头像 URL 行（在 URL 之后，也是以 - http 开头）
		const urlIndex = lines.indexOf(urlLine);
		const avatarLine = lines.slice(urlIndex + 1).find(line => line.startsWith('- http'));
		if (!avatarLine) continue;
		const avatar = avatarLine.replace(/^-\s*/, '').trim();
		
		// 查找描述
		// 优先查找 #desc: 注释，如果没有则查找最后一个 - 开头的行
		let description = '';
		const descComment = lines.find(line => line.startsWith('#desc:'));
		if (descComment) {
			description = descComment.replace(/^#desc:\s*/, '').trim();
		} else {
			// 查找最后一个 - 开头的行（但不是 URL 或头像）
			const descriptionLines = lines.filter(
				line => line.startsWith('- ') && 
				!line.startsWith('- http') &&
				line !== urlLine &&
				line !== avatarLine
			);
			if (descriptionLines.length > 0) {
				description = descriptionLines[descriptionLines.length - 1]
					.replace(/^-\s*/, '')
					.trim();
			}
		}
		
		// 验证必需字段
		if (name && url && avatar && description) {
			friends.push({
				name,
				url,
				avatar,
				description,
			});
		}
	}
	
	return friends;
}
