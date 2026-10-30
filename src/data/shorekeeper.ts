/**
 * 守岸人专栏共享数据：页面拆分后由专栏首页与各子页共用。
 * 图片素材位于 public/shorekeeper/gallery。
 *
 * 数据来源：
 * - 站内原有整理（公开资料）
 * - 灰机wiki wuwa.huijiwiki.com（CC BY-NC-SA 4.0）：技能机制、档案、经历、成就等词条内容经缩写整理
 *   （栏目结构对齐 wiki：简介 / 技能详情 / 档案 / 经历 / 画廊）
 */
import type { NavBarLink } from "../types/config";

export const g = "/shorekeeper/gallery";

export interface SkProfileItem {
	label: string;
	value: string;
}

export interface SkShot {
	cat?: string;
	src: string;
	width: number;
	height: number;
	alt: string;
	title: string;
	desc?: string;
}

export interface SkTimelineItem extends SkShot {
	date: string;
}

/** 技能卡:icon 可缺省(常态攻击等无图标) */
export interface SkSkill {
	icon?: string;
	label: string;
	name: string;
	desc: string;
}

export interface SkChain {
	src: string;
	name: string;
	desc: string;
}

export interface SkAchievement {
	name: string;
	version: string;
	desc: string;
}

/** 档案子条目(鉴定报告/珍贵之物/角色故事) */
export interface SkArchiveEntry {
	title: string;
	desc: string;
}

export interface SkArchiveSection {
	title: string;
	entries: SkArchiveEntry[];
}

/** 经历:剧情章节 */
export interface SkStory {
	title: string;
	desc: string;
}

/* ============ 顶栏导航(与 wiki 栏目对齐) ============ */
export const columnNav: NavBarLink[] = [
	{ name: "简介", url: "/shorekeeper/intro/" },
	{ name: "技能详情", url: "/shorekeeper/skills/" },
	{ name: "档案", url: "/shorekeeper/profile/" },
	{ name: "经历", url: "/shorekeeper/history/" },
	{ name: "画廊", url: "/shorekeeper/gallery/" },
	{ name: "时间线", url: "/shorekeeper/timeline/" },
];

/* ============ 简介 ============ */
export const quotes: string[] = [
	"守岸人，这个称呼就很好。它表示，某种因你而有的意义和决心。",
	"这个名字，足够契合我的存在。我的意义，只因你而成立。",
	"此岸是我存在的证明。星海尽头，我会等你。",
	"我希望在属于我们的故事里，我可以是你漂泊之后停驻的海岸。",
];

export const achievements: SkAchievement[] = [
	{ name: "蝴蝶终越沧海", version: "1.3", desc: "第一次进入黑海岸区域。" },
	{ name: "One Last Ocean", version: "1.3", desc: "完成「行至海岸尽头」。" },
	{ name: "独属于我的蒙娜丽莎", version: "1.3", desc: "在「漂泊的终点」里奏响钢琴曲。" },
	{ name: "夜晚的蝴蝶不会起舞", version: "1.3", desc: "使用 100 次守岸人的延奏技能。" },
	{ name: "花海亦有岸", version: "2.0", desc: "发现曾与守岸人一同经过的花海。" },
	{ name: "昔年珍馐", version: "3.5", desc: "听守岸人讲述「厨仙菜」的传承。" },
];

/* ============ 技能详情(共鸣能力: 叙响织构) ============ */
export const skills: SkSkill[] = [
	{
		label: "常态攻击",
		name: "真源构演",
		desc: "至多四段连续攻击造成衍射伤害并生成坍缩核；长按进入「解限状态」，每秒积蓄【演算数据】并可自动采集植物，结束时将演算数据转为【实论数据】；空中攻击与闪避反击同样产出坍缩核与数据。",
	},
	{
		icon: `${g}/skill-resonance.png`,
		label: "共鸣技能",
		name: "混沌理论",
		desc: "回复附近队伍全员生命值，召唤五只自动追踪的黯星·蝶造成衍射伤害；可在空中施放。",
	},
	{
		icon: `${g}/skill-circuit.png`,
		label: "共鸣回路",
		name: "群星漫响",
		desc: "坍缩核六秒后演化为耀星·蝶；攒满五段【实论数据】施放重击（演绎）或空中攻击（衍变），牵引周围目标并让所有坍缩核立即演化。",
	},
	{
		icon: `${g}/skill-liberation.png`,
		label: "共鸣解放",
		name: "终末回环",
		desc: "展开星域三段形态——浅析星域持续治疗；深潜星域在变奏后进入，全队暴击提升（每 0.2% 共鸣效率换 0.01%，上限 12.5%）；解限星域再次变奏后进入，全队暴击伤害提升（上限 25%），变奏技能替换为「洞悉」。",
	},
	{
		icon: `${g}/skill-intro.png`,
		label: "变奏技能",
		name: "故此证明",
		desc: "启迪——入场回复全队生命并召唤五只黯星·蝶；洞悉——解限星域期间替换启迪，星域随之结束，回复全队生命且攻击必定暴击。",
	},
	{
		icon: `${g}/skill-outro.png`,
		label: "延奏技能",
		name: "双联合相",
		desc: "耀星·蝶与黯星·蝶环绕登场角色最多 30 秒，受击时可点按闪避脱离（至多 5 次），队伍全伤害加深 15%。",
	},
	{
		icon: `${g}/skill-innate1.png`,
		label: "固有技能",
		name: "死生流溢",
		desc: "队友受到致死伤害时不会倒下，获得守岸人当前 50% 生命值（由守岸人等量扣除，至少保留 1 点），每 10 分钟触发一次。",
	},
	{
		icon: `${g}/skill-innate2.png`,
		label: "固有技能",
		name: "自我引力",
		desc: "星域内的登场角色共鸣效率 +10%；漂泊者同队时，其共鸣效率额外 +10%。",
	},
	{
		label: "谐度破坏",
		name: "音感仪",
		desc: "目标【偏谐值】蓄满时，可对其造成谐度破坏伤害。",
	},
];

export const chains: SkChain[] = [
	{ src: `${g}/chain-1.png`, name: "不语者假想", desc: "星域治疗与增益范围 +150%，持续 +10 秒；施放洞悉后星域不再结束。" },
	{ src: `${g}/chain-2.png`, name: "夜幕的赠予与拒绝", desc: "浅析星域新增效果——队伍攻击提升 40%。" },
	{ src: `${g}/chain-3.png`, name: "无限正将我等待", desc: "施放终末回环额外回复 20 点协奏能量，每 25 秒可触发一次。" },
	{ src: `${g}/chain-4.png`, name: "万物寂静满溢", desc: "施放混沌理论时治疗加成提升 70%。" },
	{ src: `${g}/chain-5.png`, name: "来自缄默的回声", desc: "普攻第三段牵引范围 +50%，演绎牵引范围 +30%。" },
	{ src: `${g}/chain-6.png`, name: "我所驶向的新世界", desc: "洞悉伤害倍率 +42%，施放时守岸人暴击伤害提升 500%。" },
];

/* ============ 档案 ============ */
export const profile: SkProfileItem[] = [
	{ label: "代号", value: "守岸人 · THE SHOREKEEPER" },
	{ label: "外文名", value: "The Shorekeeper / ショアキーパー / 파수인" },
	{ label: "别称", value: "「第二实例」" },
	{ label: "属性", value: "衍射" },
	{ label: "武器", value: "音感仪" },
	{ label: "所属", value: "黑海岸" },
	{ label: "身份", value: "黑海岸领导者背后的人" },
	{ label: "共鸣能力", value: "叙响织构" },
	{ label: "定位", value: "生存治疗 · 牵引 · 伤害加深" },
	{ label: "生日", value: "2 月 27 日" },
	{ label: "身高", value: "170cm" },
	{ label: "常驻位置", value: "黑海岸花房钢琴前" },
	{ label: "特色料理", value: "雪烩浓汤" },
	{
		label: "配音",
		value: "唐雅菁（汉）· 诹访彩花（日）· Stephanie McKeon（英）· 김보나（韩）",
	},
	{ label: "唤取标题", value: "「直至海水褪色」" },
	{ label: "满链称号", value: "「漫步于星海」" },
	{ label: "实装", value: "V1.3「直至海水褪色」 · 2024-09-29" },
];

export const archiveSections: SkArchiveSection[] = [
	{
		title: "鉴定报告",
		entries: [
			{
				title: "频谱检验报告 · A.A-000",
				desc: "第二实例即守岸人，由高纯度回音能量晶体构成，仿照「耀变体」设置模组锚点，实现能量实体化并预置智识。使用能力时胸口晶体发出淡蓝流光，能量循环类似恒星演化，常伴随蝴蝶星云与星图领域的视觉表征。",
			},
			{
				title: "超频诊断报告 · A.A-311",
				desc: "体内回音能量曾多次溃散、晶体碎裂脱落，推测源于解析悲鸣数据流的损耗。她会以新晶体替换受损部分——肩臂与小腿的弦状波痕，即是愈合的裂口。",
			},
		],
	},
	{
		title: "珍贵之物",
		entries: [
			{
				title: "陨坏死星",
				desc: "从她体内脱出的耗尽晶体。如同忒修斯之船——割舍部分的自己，以换取另一部分的延续。",
			},
			{
				title: "周期时计",
				desc: "漂泊者仿沙漏所赠的计时装置，能量介质以 42 天为周期回旋，对应泰缇斯一次完形、推演的标准周期，为漫长守望提供慰藉。",
			},
			{
				title: "「我们」",
				desc: "附回音能量的唱片，近乎无限存储，收录星球上全部声音——风雨雷雪、鸟鸣鲸歌、五十余种语言的字句。最末段，是她与漂泊者的合奏，内容会持续更新。",
			},
		],
	},
	{
		title: "角色故事",
		entries: [
			{
				title: "最初的守岸人",
				desc: "前世之人以「锚点」聚合回音能量成茧状晶体，被漂泊者（调律者）唤醒后以少女之姿显现——那时的她自称「因你而被制造出的工具」。",
			},
			{
				title: "比活着更重要的",
				desc: "她试图归纳人类却屡屡被颠覆；随调律者下乡时直观目睹悲鸣中的众生。调律者告诉她「可以选择的自由，远比答案更重要」，并邀她视自己为同伴。",
			},
			{
				title: "比等待更漫长的",
				desc: "与德罗涅的相识和诀别——当年她为少女破例申请考核资格，十多年后亲手送别临终的她，并将逝者的频率化作地下数据星河中的「星星」。",
			},
			{
				title: "始于漫响回环",
				desc: "调律者舍弃记忆外出漂泊，她留守黑海岸接手权限，作为介质亲历一切悲鸣数据而濒临碎裂——最终因「我是守岸人」的自我觉醒，挣脱数据海。",
			},
			{
				title: "最后的守岸人",
				desc: "与失忆归来的漂泊者重逢，共同矫正泰缇斯。她宣布名字的新含义——守望着漂泊之人的人，并为两人曾经的合奏创作了新曲。",
			},
		],
	},
];

/* ============ 经历 ============ */
export const storyChapters: SkStory[] = [
	{
		title: "早期经历",
		desc: "作为「第二实例」被创造，因调律者触发共振而显现。长期承受悲鸣数据流的损耗，送别德罗涅后领悟情感，将逝去成员的频率化作数据星河中的「星星」，驻守黑海岸二十余年。",
	},
	{
		title: "「行至海岸尽头」· 第一章第八幕",
		desc: "将遇袭的漂泊者传送至黑海岸；为救其被引力吸走一度消散，留下「这样的情感……能称之为……爱吗？」的疑问。最终被漂泊者从运算堆栈中救回，重新定义自己的名字——守望着漂泊之人的人。",
	},
	{
		title: "「海风中失落的湛蓝回声」· 纪闻任务",
		desc: "与漂泊者观察洄游鱼回归，谈起梦境、幸福与守望，解释当初发动权限传送漂泊者的缘由，以及过去生日宴照片的来历。",
	},
	{
		title: "「异梦聚合」· 深坠异想奇境",
		desc: "在梦中与漂泊者同行，维护濒临瓦解的梦之领域，请漂泊者给予由逝去成员愿望凝聚而成的存在解脱，并约定醒来后再相见。",
	},
	{
		title: "「如一叶小舟穿行于茫茫海洋」· 第二章序幕",
		desc: "找到过去的漂泊者留下的信息（关于英白拉多与约定），介绍黎那汐塔的背景，赠出莫塔里家族狂欢节邀请函。",
	},
	{
		title: "「勇者斗大王」· 活动任务",
		desc: "周年庆团子活动中以团子形态登场解释状况；庆典动画里先误弹《漂泊的终点》，随后改弹《永不结束的歌》。",
	},
	{
		title: "「暗潮将映的黎明」· 第二章第十一幕",
		desc: "黑海岸全员支援黎那汐塔；给出鸣式宝石可分离、由阿布暂存的结论，并以投影在埃弗拉德金库前负责传送作战人员。",
	},
	{
		title: "「曙光停摆于荒地之上」· 第二章第十二幕",
		desc: "泰缇斯扩充频率特征库后发现黑海岸近海的异常频率，将坐标交给漂泊者；漂泊者被拉入穗波市后持续密切观测。",
	},
	{
		title: "「星光流转于眼眸之间」· 第二章幕间",
		desc: "千咲咖啡厅开业派对上讲解超频情况、品评咖啡，介绍拉海洛地区被虚质磁暴遮蔽的情报，承诺协助稳定裂隙。",
	},
	{
		title: "「未知的既感」· 第三章序幕",
		desc: "隧道稳定后，为漂泊者准备入学文书与录取通知书，调制饮品、叮嘱小心，目送其启程。",
	},
	{
		title: "「昨夜群星」· 第三章第五幕",
		desc: "提供隧者与隧锚的关键情报，解释御者与外置设备的关系，与漂泊者约定平安回来。",
	},
	{
		title: "「我们选择天空」· 第三章幕间",
		desc: "洛瑟菈审查中，星炬学院执花请愿担保改变其态度；定调由漂泊者作为真正的审查官查明真相。",
	},
	{
		title: "「失落的味道」· 纪闻任务",
		desc: "协助调查厨仙菜、调制「雪抚星苔冻土冰冰乐」，帮助漂泊者悟出「是周围的一切在变，而非菜变」。",
	},
	{
		title: "「群声共振模拟域」· 战斗活动",
		desc: "3.6 版本中与部分成员接入模拟域，以引导 NPC 的身份提供协助。",
	},
	{
		title: "「梦枢心相由心生」· 第四章第四幕",
		desc: "心的记忆将提交黑海岸分析，她的蝴蝶飞过——暗示由她负责联络。",
	},
	{
		title: "「团团勇者大乱斗」· 活动任务",
		desc: "安可提及写守岸人布置的数学作业时，产生了第二索拉游戏的新灵感。",
	},
];

/* ============ 画廊(仅站内现有数据) ============ */
export const featureShots: SkShot[] = [
	{
		src: `${g}/lihui.webp`,
		width: 1040,
		height: 1675,
		alt: "守岸人官方角色立绘",
		title: "官方立绘",
		desc: "蓝发紫瞳，头纱与蝴蝶是她最鲜明的印记。",
	},
	{
		src: `${g}/promo-horizontal.webp`,
		width: 1916,
		height: 1076,
		alt: "守岸人官方宣传图（横版）",
		title: "官宣图 · 横版",
		desc: "「守岸人，这个称呼就很好。」2024-08 官宣立绘。",
	},
	{
		src: `${g}/promo-vertical.webp`,
		width: 1076,
		height: 1916,
		alt: "守岸人官方宣传图（竖版）",
		title: "官宣图 · 竖版",
		desc: "「某种因你而有的意义和决心。」",
	},
];

/* 图库筛选类别:新增类别只要在这里加一条,再给图片写上对应 cat 即可。 */
export const galleryCats = [
	{ id: "official", label: "官方视觉" },
	{ id: "archive", label: "周边档案" },
];

/* 图库池:后续加图只要往这里添一条(写好 cat),masonry 会自动补位,不用再动版式。 */
export const galleryPool: SkShot[] = [
	// ---- 官方视觉:桌布 / KV / 官宣图 ----
	{
		cat: "official",
		src: `${g}/wallpaper-horizontal.webp`,
		width: 2560,
		height: 1440,
		alt: "守岸人官方横版桌布：星云蝴蝶之海",
		title: "官方桌布 · 横版",
		desc: "「那片海岸，就是我存在的證明。」官网桌布分享 4K 原图。（2024-09）",
	},
	{
		cat: "official",
		src: `${g}/wallpaper-vertical.webp`,
		width: 1440,
		height: 2560,
		alt: "守岸人官方竖版桌布：星云蝴蝶之海",
		title: "官方桌布 · 竖版",
		desc: "官网桌布分享同系列竖版 4K 原图。（2024-09）",
	},
	{
		cat: "official",
		src: `${g}/showcase-horizontal.webp`,
		width: 1920,
		height: 1080,
		alt: "共鸣者展示《寰宇人類注疏：群星交錯》守岸人横版视觉图",
		title: "共鸣者展示 · 横版",
		desc: "《寰宇人類注疏：群星交錯》共鸣者展示官方视觉图。（2024-09）",
	},
	{
		cat: "official",
		src: `${g}/showcase-vertical.webp`,
		width: 1080,
		height: 1920,
		alt: "共鸣者展示守岸人竖版视觉图",
		title: "共鸣者展示 · 竖版",
		desc: "共鸣者展示同系列竖版视觉图。（2024-09）",
	},
	{
		cat: "official",
		src: `${g}/archive-vertical.webp`,
		width: 1080,
		height: 1920,
		alt: "档案公开「敘響織構——守岸人」竖版视觉图",
		title: "档案公开 · 竖版",
		desc: "「檔案公開 | 敘響織構——守岸人」官方竖版视觉图。（2024-09）",
	},
	{
		cat: "official",
		src: `${g}/kv-initial.webp`,
		width: 1920,
		height: 1080,
		alt: "「直至海水褪色」角色活动唤取官方 KV（初回）",
		title: "唤取 KV · 初回",
		desc: "「直至海水褪色」角色活动唤取官方 KV——守岸人初回限定卡池主视觉。（2024-09）",
	},
	{
		cat: "official",
		src: `${g}/kv-rerun.webp`,
		width: 1920,
		height: 1080,
		alt: "「直至海水褪色」唤取复刻官方 KV（全身构图）",
		title: "唤取 KV · 复刻",
		desc: "同名唤取复刻官方 KV，全身构图版本。（2025-04）",
	},

	// ---- 周边档案:珍贵之物 / 头像 / 主页 ----
	{
		cat: "archive",
		src: `${g}/treasure-01.webp`,
		width: 1024,
		height: 1024,
		alt: "守岸人珍贵之物 01",
		title: "珍贵之物 · 一",
	},
	{
		cat: "archive",
		src: `${g}/treasure-02.webp`,
		width: 1024,
		height: 1024,
		alt: "守岸人珍贵之物 02",
		title: "珍贵之物 · 二",
	},
	{
		cat: "archive",
		src: `${g}/treasure-03.webp`,
		width: 1024,
		height: 1024,
		alt: "守岸人珍贵之物 03",
		title: "珍贵之物 · 三",
	},
	{
		cat: "archive",
		src: `${g}/avatar.webp`,
		width: 256,
		height: 256,
		alt: "守岸人角色头像",
		title: "角色头像",
	},
	{
		cat: "archive",
		src: `${g}/home.webp`,
		width: 366,
		height: 731,
		alt: "守岸人首页展示图",
		title: "主页展示",
	},
];

/* ============ 经历:联动历程(站内数据) ============ */
export const collabTimeline: SkTimelineItem[] = [
	{
		date: "2024.09",
		src: "https://i.undf.cn/file/shorekeeper/2024-09-26_梦的解析.jpg.webp",
		width: 2666,
		height: 1500,
		alt: "寰宇频道特别栏目《梦的解析》封面",
		title: "寰宇频道 · 梦的解析",
		desc: "官方考据栏目「寰宇频道特别栏目」守岸人篇《梦的解析》9 月 26 日播出。",
	},
	{
		date: "2024.09",
		src: "https://i.undf.cn/file/shorekeeper/2024-09-26_《鸣潮》2024东京电玩展：男漂泊者、守岸人、秋水、安可.jpg.webp",
		width: 1200,
		height: 675,
		alt: "2024 东京电玩展《鸣潮》展台合影：男漂泊者、守岸人、秋水、安可",
		title: "东京电玩展 2024",
		desc: "《鸣潮》出展 TGS2024（9 月 26 日开幕），守岸人与秋水、安可同台亮相。",
	},
	{
		date: "2024.09",
		src: "https://i.undf.cn/file/shorekeeper/2024-09-27_PV-溯而复始.jpg.webp",
		width: 2560,
		height: 1440,
		alt: "守岸人展示PV《溯而复始》主视觉",
		title: "展示PV · 溯而复始",
		desc: "共鸣者「守岸人」展示PV《溯而复始》9 月 27 日发布。",
	},
	{
		date: "2024.09",
		src: "https://i.undf.cn/file/shorekeeper/2024-09-28_唤取海报.jpg.webp",
		width: 1920,
		height: 1080,
		alt: "守岸人限定唤取海报",
		title: "1.3 版本 · 守岸人实装",
		desc: "1.3 版本 9 月 28 日上线，守岸人实装并开启限定唤取，黑海岸群岛同步开放。",
	},
	{
		date: "2024.09",
		src: "https://i.undf.cn/file/shorekeeper/2024-09_2024年，《鸣潮》确认参展CICF×AGF漫展.jpg.webp",
		width: 2208,
		height: 1242,
		alt: "《鸣潮》确认参展 2024 CICF×AGF 漫展",
		title: "CICF×AGF 2024 参展",
		desc: "《鸣潮》确认参展广州 CICF×AGF 漫展（10 月 2 日–5 日）。",
	},
	{
		date: "2024.10",
		src: "https://i.undf.cn/file/shorekeeper/2024-10_守岸人壁纸.png.webp",
		width: 3840,
		height: 2160,
		alt: "守岸人官方桌布：花海与蝶",
		title: "官方桌布分享",
		desc: "官网与官方 X 配布守岸人官方桌布，含 PC、手机与超宽屏规格（10 月 3 日起）。",
	},
	{
		date: "2024.10",
		src: "https://i.undf.cn/file/shorekeeper/2024-10_韩国首尔龙山快闪：守岸人、釉瑚.jpg.webp",
		width: 1200,
		height: 675,
		alt: "韩国首尔龙山快闪主视觉：守岸人与釉瑚",
		title: "首尔龙山快闪",
		desc: "韩国「띵조파크 in 용산」快闪（10 月 3 日–9 日），守岸人、釉瑚主题打卡与周边。",
	},
	{
		date: "2024.10",
		src: "https://i.undf.cn/file/shorekeeper/2024-10_与你同行《更多的风景》1：_女漂泊者、守岸人.jpg.webp",
		width: 2659,
		height: 1748,
		alt: "官方系列插画《更多的风景》：女漂泊者与守岸人",
		title: "与你同行 · 更多的风景",
		desc: "国庆假期官方插画系列《更多的风景》：漂泊者与守岸人同游山水。",
	},
	{
		date: "2024.10",
		src: "https://i.undf.cn/file/shorekeeper/2024-10_星海拾影拍照活动.jpg.webp",
		width: 1920,
		height: 1080,
		alt: "星海拾影拍照活动",
		title: "星海拾影 · 拍照活动",
		desc: "1.3 期间网页活动「星海拾影」，在黑海岸与守岸人的影子相遇。",
	},
	{
		date: "2024.10",
		src: "https://i.undf.cn/file/shorekeeper/2024-10_黑海岸的日常_共奏一曲：_男漂泊者、守岸人.jpg.webp",
		width: 1920,
		height: 1080,
		alt: "官方Q版日常系列《黑海岸的日常》共奏一曲：男漂泊者与守岸人弹琴",
		title: "黑海岸的日常 · 共奏一曲",
		desc: "官方 Q 版日常系列「黑海岸的日常」共奏一曲篇，与守岸人四手联弹。",
	},
{
		date: "2024.11",
		src: `${g}/collab-rakuspa.webp`,
		width: 1620,
		height: 906,
		alt: "鸣潮×極楽湯 RAKU SPA 温泉联动主视觉",
		title: "極楽湯 RAKU SPA · 温泉装",
		desc: "日本極楽湯联动主视觉，守岸人戴上睡帽、换上浴衣与椿、秧秧、漂泊者同框。",
	},
{
		date: "2024.11",
		src: `${g}/collab-xihu-kv.webp`,
		width: 1482,
		height: 1004,
		alt: "鸣潮×西湖「断云波板糖」主题快闪主视觉",
		title: "西湖 · 断云波板糖",
		desc: "杭州西湖主题联动快闪 KV——守岸人换上蓝白异域风短打装束，与椿执扇同游湖畔。",
	},
{
		date: "2024.11",
		src: `${g}/collab-xihu-standee.webp`,
		width: 1040,
		height: 990,
		alt: "西湖联动守岸人异域装亚克力立牌",
		title: "西湖联动 · 异域装立牌",
		desc: "西湖快闪周边：守岸人 180mm 异域装亚克力立牌，蓝色蝴蝶停驻指尖。",
	},
{
		date: "2024.12",
		src: `${g}/collab-animate.webp`,
		width: 1620,
		height: 912,
		alt: "鸣潮×animate「冬日邀约」主题周边快闪主视觉",
		title: "animate · 冬日邀约",
		desc: "「冬日邀约」主题周边快闪主视觉——吟霖、守岸人、漂泊者、椿、相里要五人冬装同框，守岸人一袭蓝白洋装。",
	},
{
		date: "2025.01",
		src: `${g}/collab-sushiro.webp`,
		width: 1600,
		height: 900,
		alt: "壽司郎×鸣潮「春之鳴饗」联动周边实拍，含守岸人压克力立牌",
		title: "壽司郎 · 春之鳴饗",
		desc: "台湾壽司郎联动现场：守岸人与椿的新春装立牌、徽章与 Q 版插卡。",
	},
	{
		date: "2025.01",
		src: "https://i.undf.cn/file/shorekeeper/2025-01_因你而生2：_男漂泊者、守岸人.jpg.webp",
		width: 3300,
		height: 1856,
		alt: "2.0 官网主题页「因你而生」：男漂泊者与守岸人",
		title: "2.0 官网 · 因你而生",
		desc: "2.0 版本官网主题页「世界·因你而生」上线，守岸人与漂泊者主视觉。",
	},
	{
		date: "2025.01",
		src: "https://i.undf.cn/file/shorekeeper/2025-01_2025年同人特别节目「索拉逐星舞台」特邀嘉宾_Vol.4：守岸人、椿、秋水、男漂泊者.jpg.webp",
		width: 1920,
		height: 1080,
		alt: "索拉逐星舞台特邀嘉宾 Vol.4：守岸人、椿、秋水、男漂泊者",
		title: "索拉逐星舞台 · 特邀嘉宾",
		desc: "2025 同人特别节目「索拉逐星舞台」1 月 18 日开播，守岸人登特邀嘉宾 Vol.4。",
	},
	{
		date: "2025.02",
		src: "https://i.undf.cn/file/shorekeeper/2025-02_“能再次与你一起分享这里的景色，我很高兴……可以再稍微，在这里停留片刻吗？”.jpg.webp",
		width: 1920,
		height: 1080,
		alt: "守岸人生日贺图：花海与蝶",
		title: "生日贺图 · 花海",
		desc: "守岸人生日（2 月 27 日）贺图：能再次与你分享这里的景色。",
	},
	{
		date: "2025.03",
		src: "https://i.undf.cn/file/shorekeeper/2025-03-04_高德地图联动“启程，漂泊者！”：_守岸人、阿布.jpg.webp",
		width: 1920,
		height: 1080,
		alt: "鸣潮×高德地图联动：守岸人与阿布",
		title: "高德地图 · 导航语音",
		desc: "鸣潮×高德地图联动，守岸人定制导航语音包 3 月 4 日上线。",
	},
{
		date: "2025.04",
		src: `${g}/collab-samsung.webp`,
		width: 1620,
		height: 924,
		alt: "鸣潮×三星 Galaxy Store 韩国联动「星海嘉年华」主视觉",
		title: "三星 Galaxy · 星海嘉年华",
		desc: "韩国三星 Galaxy Store 联动 KV「고요한 바다에 빠진 카니발」——守岸人与坎特蕾拉化身深海漫游者。",
	},
	{
		date: "2025.05",
		src: "https://i.undf.cn/file/shorekeeper/2025-05-23_一周年大合影.jpg.webp",
		width: 7373,
		height: 1913,
		alt: "一周年大合影",
		title: "一周年 · 大合影",
		desc: "一周年（5 月 23 日）：周年企划「潮声与群星」守岸人篇《海岸》与众共鸣者大合影。",
	},
	{
		date: "2025.05",
		src: "https://i.undf.cn/file/shorekeeper/2025-05_先约同人-Concerto一周年.jpeg.webp",
		width: 2880,
		height: 2160,
		alt: "Concerto 一周年同人画展守岸人作品",
		title: "Concerto · 一周年同人画展",
		desc: "一周年线上同人画展「Concerto」守岸人参展作品。",
	},
	{
		date: "2025.05",
		src: "https://i.undf.cn/file/shorekeeper/2025-05-30_屈臣氏饮用水联动：相里要、守岸人、布兰特、赞妮.jpg.webp",
		width: 4000,
		height: 2250,
		alt: "屈臣氏饮用水联动主视觉：相里要、守岸人、布兰特、赞妮",
		title: "屈臣氏 · 饮用水联动",
		desc: "鸣潮×屈臣氏蒸馏水「105℃热爱共鸣」联名礼盒 5 月 30 日开售。",
	},
	{
		date: "2025.06",
		src: "https://i.undf.cn/file/shorekeeper/2025-06-21_国际服粉丝创作特别企划「Solaris_Seaside_Story」：椿、男漂泊者、守岸人.jpg.webp",
		width: 1920,
		height: 1080,
		alt: "国际服粉丝创作特别企划 Solaris Seaside Story：椿、男漂泊者、守岸人",
		title: "Solaris Seaside Story",
		desc: "国际服粉丝创作特别企划「Solaris Seaside Story」6 月 21 日直播。",
	},
	{
		date: "2025.11",
		src: "https://i.undf.cn/file/shorekeeper/2025-11-20_时隙废都第二章「曙光停摆于荒地之上」《开业与星愿》：守岸人、男漂泊者、阿布、千咲、椿、卜灵.png.webp",
		width: 2560,
		height: 1440,
		alt: "2.8 剧情CG《开业与星愿》：守岸人与男漂泊者、阿布、千咲、椿、卜灵",
		title: "2.8 时隙废都 · 开业与星愿",
		desc: "2.8 版本「奔往琥珀之都」11 月 20 日上线，时隙废都剧情 CG《开业与星愿》。",
	},
{
		date: "2026.01",
		src: `${g}/collab-kfc-piano.webp`,
		width: 1620,
		height: 708,
		alt: "鸣潮×肯德基联动 PV：守岸人身着白色礼服端坐钢琴前",
		title: "肯德基联动 PV · 礼服",
		desc: "「K-Land 号即将启航」联动 PV 中，守岸人换上白色晚礼服，在宴会厅的钢琴前落座。",
	},
{
		date: "2026.01",
		src: `${g}/collab-kfc-kland.webp`,
		width: 1620,
		height: 722,
		alt: "鸣潮×肯德基 K-Land 号联动主视觉：四位共鸣者的宴会合影",
		title: "肯德基 K-Land 号 · 主视觉",
		desc: "椿、守岸人、卡提希娅、仇远四人盛装出席索拉里斯邮轮惊喜夜。",
	},
{
		date: "2026.01",
		src: `${g}/collab-kfc-poster.webp`,
		width: 1620,
		height: 726,
		alt: "鸣潮×肯德基联动宣传海报",
		title: "肯德基联动 · 官宣海报",
		desc: "「鸣潮启航！肯德基 K-Land 号」联名活动官宣图，全国 685 家主题店同步换装。",
	},
	{
		date: "2026.01",
		src: "https://i.undf.cn/file/shorekeeper/2026-01_同人创作企划Solaris_Supercup™_Series：卜灵、守岸人、布兰特、陆·赫斯.jpg.webp",
		width: 1920,
		height: 1080,
		alt: "同人创作企划 Solaris Supercup™ Series：卜灵、守岸人、布兰特、陆·赫斯",
		title: "索拉里斯超级杯™ Series",
		desc: "2026 同人二创特别节目「索拉里斯超级杯™系列赛」开启。",
	},
	{
		date: "2026.02",
		src: "https://i.undf.cn/file/shorekeeper/2026-02-14_2026日本情人节贺图：男漂泊者、阿布、守岸人、露帕、琳奈、莫宁、陆·赫斯.jpg.webp",
		width: 7111,
		height: 4000,
		alt: "2026 日本情人节贺图：男漂泊者、阿布、守岸人、露帕、琳奈、莫宁、陆·赫斯",
		title: "2026 日本情人节贺图",
		desc: "2026 日本情人节官方贺图（2 月 14 日）。",
	},
{
		date: "2026.04",
		src: `${g}/collab-yinyue-piano.webp`,
		width: 1080,
		height: 1440,
		alt: "鸣潮「鸣乐之时」主题周边守岸人钢琴海报",
		title: "鸣乐之时 · 钢琴海报",
		desc: "「All That Resonates」音乐主题周边系列守岸人款——透明纱衣，静坐琴前。",
	},
	{
		date: "2026.04",
		src: "https://i.undf.cn/file/shorekeeper/2026-04_「致予新世界」.jpg.webp",
		width: 3840,
		height: 2160,
		alt: "巡回演唱会「致予新世界」主视觉",
		title: "巡演 · 致予新世界",
		desc: "巡回演唱会「致予新世界」4 月 17 日公布，7 月 16 日上海首站开唱。",
	},
	{
		date: "2026.05",
		src: "https://i.undf.cn/file/shorekeeper/2026-05-23_二周年大合影.jpg.webp",
		width: 8268,
		height: 3780,
		alt: "二周年大合影",
		title: "二周年 · 大合影",
		desc: "二周年（5 月 23 日）大合影与 X 平台周年贺图。",
	},
	{
		date: "2026.08",
		src: "https://i.undf.cn/file/shorekeeper/2026-08_「致予新世界」首尔站展图：守岸人、莫宁、爱弥斯.jpg.webp",
		width: 11000,
		height: 6189,
		alt: "「致予新世界」首尔站展图：守岸人、莫宁、爱弥斯",
		title: "致予新世界 · 首尔站",
		desc: "巡演首尔站展图：守岸人、莫宁、爱弥斯。",
	},
{
		date: "2026.10",
		src: "https://i.undf.cn/file/shorekeeper/collab-sola.webp",
		width: 511,
		height: 982,
		alt: "鸣潮《第二索拉：未名之梦》预约活动中守岸人的便装立绘",
		title: "第二索拉 · 未名之梦",
		desc: "游戏内虚构游戏《第二索拉：未名之梦》开启预约（Meta Games 开发，计划 2026 年第四季度发行），守岸人以「角色三」身份换上便装亮相官网。",
	},
	{
		date: "2026.10",
		src: "https://i.undf.cn/file/shorekeeper/2026-10-10_「索拉逐星舞台2」应援特辑_Vol.3：男漂泊者、秋水、守岸人、椿.jpg.webp",
		width: 1920,
		height: 1080,
		alt: "「索拉逐星舞台2」应援特辑 Vol.3：男漂泊者、秋水、守岸人、椿",
		title: "索拉逐星舞台2 · 应援特辑",
		desc: "第二季 10 月 11 日开播，守岸人登应援特辑 Vol.3。",
	},
	{
		date: "2026.10",
		src: "https://i.undf.cn/file/shorekeeper/2026-10_「致予新世界」洛杉矶站展图：守岸人、布兰特、爱弥斯.jpg.webp",
		width: 10497,
		height: 5906,
		alt: "「致予新世界」洛杉矶站展图：守岸人、布兰特、爱弥斯",
		title: "致予新世界 · 洛杉矶站",
		desc: "巡演洛杉矶站展图：守岸人、布兰特、爱弥斯。",
	},
];


/* 简介页介绍段落(站内原有) */
export const introParagraphs = [
	{
		strong: "黑海岸的守护者。",
		text: "守岸人，神秘清冷、超然物外。她平日隐于幕后，只有在黑海岸最危急的时刻才会站出来。作为「第二实例」，她的身体由高纯度回音能量晶体构成，拥有操控星云的力量——这种程度的说明，对她便已足够。",
	},
	{
		strong: "异能力「叙响织构」。",
		text: "回音更迭，一如机杼上的丝线，她引导它们缀连，织构出全新的境界。解析、完形、推演……「蝴蝶」的每一次翩跹，都是对生命延续的渴望，也是她守护的证明。",
	},
	{
		strong: "从工具到「人」。",
		text: "她生而没有感情，因职责而存在；但在守护泰缇斯系统与黑海岸的漫长岁月里，情感与渴望逐渐萌生。至于渴望、羁绊、情感……除职责外她所拥有的一切，都丰满于与你相遇之后。",
	},
	{
		strong: "与你相连。",
		text: "在属于你们的故事里，她说自己是「你漂泊之后停驻的海岸」。星海尽头，她会一直等下去。",
	},
];
