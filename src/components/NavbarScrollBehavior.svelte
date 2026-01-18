<script>
    import { onMount, onDestroy } from 'svelte';
    
    let lastScrollTop = 0;
    let isScrollingDown = false;
    let scrollOpacity = 1;
    let navbarHeight = 0;
    
    // 配置参数
    const OPACITY_CHANGE_THRESHOLD = 100; // 开始改变透明度的滚动距离
    const FULL_OPACITY_THRESHOLD = 50; // 完全不透明的滚动距离
    const HIDE_THRESHOLD = 200; // 开始隐藏navbar的滚动距离
    const SCROLL_DEBOUNCE = 10; // 滚动事件防抖时间(ms)
    
    let scrollTimeout;
    
    function handleScroll() {
        // 防抖处理
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const navbarElement = document.getElementById('navbar-wrapper');
            
            if (navbarElement) {
                navbarHeight = navbarElement.offsetHeight;
                
                // 检测滚动方向
                isScrollingDown = scrollTop > lastScrollTop;
                
                // 计算透明度
                if (scrollTop < FULL_OPACITY_THRESHOLD) {
                    // 滚动距离较小时，完全不透明
                    scrollOpacity = 1;
                } else if (scrollTop < OPACITY_CHANGE_THRESHOLD) {
                    // 在阈值范围内，根据滚动距离计算透明度
                    scrollOpacity = 1 - (scrollTop - FULL_OPACITY_THRESHOLD) / (OPACITY_CHANGE_THRESHOLD - FULL_OPACITY_THRESHOLD);
                } else {
                    // 超过阈值，保持最低透明度
                    scrollOpacity = 0.8;
                }
                
                // 应用样式
                if (isScrollingDown && scrollTop > HIDE_THRESHOLD) {
                    // 向下滚动且超过阈值，隐藏navbar
                    navbarElement.style.transform = `translateY(-${navbarHeight}px)`;
                } else {
                    // 向上滚动或未超过阈值，显示navbar
                    navbarElement.style.transform = 'translateY(0)';
                }
                
                // 设置透明度
                navbarElement.style.opacity = scrollOpacity;
                
                // 更新最后滚动位置
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // 防止出现负值
            }
        }, SCROLL_DEBOUNCE);
    }
    
    onMount(() => {
        // 初始化
        const navbarElement = document.getElementById('navbar-wrapper');
        if (navbarElement) {
            navbarHeight = navbarElement.offsetHeight;
            navbarElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        }
        
        // 添加滚动事件监听
        window.addEventListener('scroll', handleScroll);
        
        // 初始执行一次
        handleScroll();
    });
    
    onDestroy(() => {
        // 移除事件监听
        window.removeEventListener('scroll', handleScroll);
        
        // 清理定时器
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
    });
</script>

<!-- 这个组件不需要渲染任何HTML内容，只处理滚动事件 -->
