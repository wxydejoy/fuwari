<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { onMount } from "svelte";

// 定义搜索结果类型
interface SearchResult {
  url: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
}

let keywordDesktop = "";
let keywordMobile = "";
let result: SearchResult[] = [];
let isSearching = false;
let initialized = false;
let searchData: SearchResult[] = [];
let isPanelOpen = false;

// 添加防抖功能
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const togglePanel = () => {
  const panel = document.getElementById("search-panel");
  if (panel) {
    const isClosed = panel.classList.contains("float-panel-closed");
    if (isClosed) {
      panel.classList.remove("float-panel-closed");
      isPanelOpen = true;
    } else {
      panel.classList.add("float-panel-closed");
      isPanelOpen = false;
    }
  }
};

const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
  if (!isDesktop) return;
  
  const panel = document.getElementById("search-panel");
  if (!panel) return;

  if (show && !isPanelOpen) {
    panel.classList.remove("float-panel-closed");
    isPanelOpen = true;
  } else if (!show && isPanelOpen) {
    panel.classList.add("float-panel-closed");
    isPanelOpen = false;
  }
};

// 搜索函数，只检索标题、标签和分类
const search = (keyword: string, isDesktop: boolean): void => {
  if (!keyword) {
    setPanelVisibility(false, isDesktop);
    result = [];
    return;
  }

  if (!initialized) {
    return;
  }

  isSearching = true;

  try {
    const lowercaseKeyword = keyword.toLowerCase();
    
    // 过滤搜索结果，只匹配标题、标签或分类
    result = searchData.filter(post => {
      const titleMatch = post.title.toLowerCase().includes(lowercaseKeyword);
      const categoryMatch = post.category && post.category.toLowerCase().includes(lowercaseKeyword);
      const tagsMatch = post.tags.some(tag => tag.toLowerCase().includes(lowercaseKeyword));
      
      return titleMatch || categoryMatch || tagsMatch;
    });

    setPanelVisibility(result.length > 0, isDesktop);
  } catch (error) {
    console.error("Search error:", error);
    result = [];
    setPanelVisibility(false, isDesktop);
  } finally {
    isSearching = false;
  }
};

// 防抖搜索函数
const debouncedSearch = (keyword: string, isDesktop: boolean): void => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  searchTimeout = setTimeout(() => {
    search(keyword, isDesktop);
  }, 200); // 200ms 防抖延迟
};

onMount(async () => {
  try {
    // 加载搜索数据
    const response = await fetch("/search-data.json");
    if (response.ok) {
      searchData = await response.json();
      initialized = true;
      console.log("Search data loaded successfully:", searchData.length, "posts");
    } else {
      throw new Error("Failed to load search data");
    }
  } catch (error) {
    console.error("Error initializing search:", error);
    // 开发环境下使用模拟数据
    if (import.meta.env.DEV) {
      searchData = [
        {
          url: url("/"),
          title: "This Is a Fake Search Result",
          description: "Because the search cannot work in the dev environment.",
          tags: ["dev", "search"],
          category: "test"
        },
        {
          url: url("/"),
          title: "If You Want to Test the Search",
          description: "Try running npm build && npm preview instead.",
          tags: ["build", "preview"],
          category: "test"
        }
      ];
      initialized = true;
      console.log("Using mock search data in dev environment");
    }
  }
});

// 使用防抖搜索，避免每次按键都触发搜索
$: if (initialized && keywordDesktop) {
  debouncedSearch(keywordDesktop, true);
}

$: if (initialized && keywordMobile) {
  debouncedSearch(keywordMobile, false);
}
</script>

<!-- search bar for desktop view -->
<div id="search-bar" class="hidden lg:flex transition-all items-center h-11 mr-2 rounded-lg
      bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
">
    <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"></Icon>
    <input placeholder="{i18n(I18nKey.search)}" bind:value={keywordDesktop} on:focus={() => search(keywordDesktop, true)}
           class="transition-all pl-10 text-sm bg-transparent outline-0
         h-full w-40 active:w-60 focus:w-60 text-black/50 dark:text-white/50"
    >
</div>

<!-- toggle btn for phone/tablet view -->
<button on:click={togglePanel} aria-label="Search Panel" id="search-switch"
        class="btn-plain scale-animation lg:!hidden rounded-lg w-11 h-11 active:scale-90">
    <Icon icon="material-symbols:search" class="text-[1.25rem]"></Icon>
</button>

<!-- search panel -->
<div id="search-panel" class="float-panel float-panel-closed search-panel absolute md:w-[30rem]
top-20 left-4 md:left-[unset] right-4 shadow-2xl rounded-2xl p-2">

    <!-- search bar inside panel for phone/tablet -->
    <div id="search-bar-inside" class="flex relative lg:hidden transition-all items-center h-11 rounded-xl
      bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
  ">
        <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"></Icon>
        <input placeholder="Search" bind:value={keywordMobile}
               class="pl-10 absolute inset-0 text-sm bg-transparent outline-0
               focus:w-60 text-black/50 dark:text-white/50"
        >
    </div>

    <!-- search results -->
    {#each result as item}
        <a href={item.url}
           class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
       rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]"
           on:click={() => {
               // 清除搜索内容
               keywordDesktop = "";
               keywordMobile = "";
               result = [];
               // 关闭搜索面板
               const panel = document.getElementById("search-panel");
               if (panel) {
                   panel.classList.add("float-panel-closed");
               }
           }}>
            <div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
                {item.title}<Icon icon="fa6-solid:chevron-right" class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"></Icon>
            </div>
            <div class="transition text-sm text-50">
                {item.description}
            </div>
        </a>
    {/each}
</div>

<style>
  input:focus {
    outline: 0;
  }
  .search-panel {
    max-height: calc(100vh - 100px);
    overflow-y: auto;
  }
</style>
