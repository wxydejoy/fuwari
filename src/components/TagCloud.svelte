<script lang="ts">
export let tags: Array<{ name: string; count: number }> = [];

	// Calculate font size based on tag count
	function getTagSize(count: number): string {
		const minSize = 0.875; // 14px
		const maxSize = 1.5;   // 24px
		
		if (tags.length === 0) {
			return `${minSize}rem`;
		}
		
		const tagCounts = tags.map(tag => tag.count);
		const minCount = Math.min(...tagCounts);
		const maxCount = Math.max(...tagCounts);

		if (minCount === maxCount) {
			return `${minSize}rem`;
		}

		const ratio = (count - minCount) / (maxCount - minCount);
		const size = minSize + ratio * (maxSize - minSize);
		return `${size}rem`;
	}
	
	// Generate tag URL with proper encoding
	function getTagUrl(tag: string): string {
		// Create URLSearchParams object
		const params = new URLSearchParams();
		params.append('tag', tag);
		
		// Return encoded URL
		return `/archive/?${params.toString()}#`;
	}
</script>

<div class="card-base px-8 py-6 mb-6">
	<div class="flex flex-wrap gap-3 gap-y-4 justify-center">
		{#each tags as tag}
			<a
				href={getTagUrl(tag.name)}
				class="inline-block px-3 py-1 text-primary hover:bg-primary hover:text-white rounded-full transition-all duration-300 ease-in-out hover:scale-105"
				style={`font-size: ${getTagSize(tag.count)};`}
				title={`查看包含标签 "${tag.name}" 的所有文章`}
			>
				{tag.name}
			</a>
		{/each}
	</div>
</div>
