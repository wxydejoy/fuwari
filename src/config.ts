import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "沐印",
	subtitle: "漂泊者的休憩之地，守岸人的灯塔。用文字抵抗遗忘，用开源连接彼此。",
	lang: "zh_CN", // Language code, e.g. "en", "zh_CN", "ja", etc.
	themeColor: {
		hue: 210, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: [
			"https://img.undf.top/ob/616b27741d92418019d973e0e79add48.png",
		], // Support multiple images for carousel
		position: "center", // Equivalent to object-position, only supports "top", "center", "bottom". "center" by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist"s page=
		},
		carousel: {
			enable: true,
			interval: 5000, // Interval in milliseconds
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 3, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		{
			src: "/favicon/favicon.ico", // Path of the favicon, relative to the /public directory
			theme: "light", // (Optional) Either "light" or "dark", set only if you have different favicons for light and dark mode
			sizes: "32x32", // (Optional) Size of the favicon, set only if you have favicons of different sizes
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Archive,
		{
			name: "摄影",
			url: "/photography/",
		},
		{
			name: "友链",
			url: "/friends/",
		},
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/wxydejoy", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "https://img.undf.top/ob/6667b59a3589d70694579a2fddce4ddc.png", // Relative to the /src directory. Relative to the /public directory if it starts with "/"
	name: "沐印",
	bio: "这里是漂泊者的休憩之地，也是守岸人的灯塔。",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/wxydejoy",
		},
		{
			name: "Bilibili",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/380525356",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
