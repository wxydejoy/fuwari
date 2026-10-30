/* 首页(深色落地页)离开时的数据传递:把标记写入 sessionStorage,
   供博客页与守岸人专栏页(SkLayout)在非 VT 浏览器上做兜底遮罩。
   pageswap 在导航提交时触发,标记最准;不支持的内核才用点击兜底,
   且要过滤中键/修饰键点击(新标签页打开,当前页留下的标记就是脏数据)。
   支持 View Transition 的浏览器由原生跨文档过渡接管,消费端会在
   pagereveal 里检查 e.viewTransition 后才决定是否放遮罩。 */
(function () {
	var writeFlag = function () {
		try {
			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
			/* from 供消费端区分来路:专栏子页互切不放假遮罩,只有主站落地页出发才需要 */
			sessionStorage.setItem(
				"landing-transition",
				JSON.stringify({ t: Date.now(), from: location.pathname })
			);
		} catch (e) { /* 忽略 sessionStorage 异常 */ }
	};
	if ("onpageswap" in window) {
		window.addEventListener("pageswap", writeFlag);
		return;
	}
	var onClick = function (e) {
		if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		var link = e.currentTarget;
		if (link.target && link.target !== "_self") return;
		writeFlag();
	};
	document.querySelectorAll("a[data-no-swup]").forEach(function (link) {
		link.addEventListener("click", onClick);
	});
})();
