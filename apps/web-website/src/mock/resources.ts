import type { ResourceDetail } from "../types";

export const resources: ResourceDetail[] = [
  // ===== 网络资源 (categoryId: 1) =====
  {
    id: 1, slug: "proxy-quick", name: "Proxy Quick", logo: "https://placehold.co/48/1677ff/fff?text=PQ",
    shortDesc: "美国、英国、德国、日本等全球优质代理IP", fullDesc: "Proxy Quick 提供全球200+国家和地区的优质代理IP服务，支持HTTP/HTTPS/SOCKS5协议，适用于跨境电商、数据采集、账号注册等场景。",
    tags: ["推荐"], rating: 5, link: { type: "detail", slug: "proxy-quick" },
    screenshots: [], featured: true, categoryId: 1, subCategoryId: 11,
    metaTitle: "Proxy Quick - 全球优质代理IP服务", metaDescription: "Proxy Quick 提供全球200+国家优质代理IP",
  },
  {
    id: 2, slug: "thordata", name: "Thordata全球代理", logo: "https://placehold.co/48/fa8c16/fff?text=TD",
    shortDesc: "六千万原生动/静态住宅代理", fullDesc: "Thordata 拥有6000万+全球住宅IP资源，覆盖190+国家，支持城市级精准定位。",
    tags: ["TOP"], rating: 5, link: { type: "detail", slug: "thordata" },
    screenshots: [], featured: true, categoryId: 1, subCategoryId: 11,
    metaTitle: "Thordata - 全球代理IP服务商", metaDescription: "Thordata 六千万原生动/静态住宅代理",
  },
  {
    id: 3, slug: "sx-org", name: "SX.ORG", logo: "https://placehold.co/48/333/fff?text=SX",
    shortDesc: "全球优质 IP 地址，23+ 国家", fullDesc: "SX.ORG 专注于提供高质量的代理IP服务，覆盖全球23+国家和地区。",
    tags: [], rating: 4, link: { type: "external", url: "https://www.sx.org" },
    screenshots: [], featured: false, categoryId: 1, subCategoryId: 11,
  },
  {
    id: 4, slug: "cliproxy", name: "Cliproxy", logo: "https://placehold.co/48/52c41a/fff?text=CP",
    shortDesc: "免费测试，全球200+国家IP", fullDesc: "Cliproxy 是一家专注于跨境电商的代理IP服务商，提供高匿名、高速度的代理服务。支持免费测试，全球200+国家IP资源。",
    tags: [], rating: 4, link: { type: "detail", slug: "cliproxy" },
    screenshots: [], featured: false, categoryId: 1, subCategoryId: 11,
    metaTitle: "Cliproxy - 跨境电商代理IP", metaDescription: "免费测试，全球200+国家IP",
  },
  {
    id: 5, slug: "swiftproxy", name: "SwiftProxy", logo: "https://placehold.co/48/ff4d4f/fff?text=SP",
    shortDesc: "全球独享纯净住宅代理IP", fullDesc: "SwiftProxy 提供独享纯净住宅代理IP，支持HTTP/SOCKS5协议。",
    tags: ["NEW"], rating: 4, link: { type: "detail", slug: "swiftproxy" },
    screenshots: [], featured: true, categoryId: 1, subCategoryId: 11,
    metaTitle: "SwiftProxy - 独享纯净住宅代理", metaDescription: "SwiftProxy 全球独享纯净住宅代理IP",
  },
  {
    id: 6, slug: "ipwo", name: "IPWO全球住宅代理", logo: "https://placehold.co/48/722ed1/fff?text=IP",
    shortDesc: "原生住宅$2/IP起", fullDesc: "IPWO 提供全球原生住宅代理IP服务，价格实惠，$2/IP起。",
    tags: ["优"], rating: 4, link: { type: "detail", slug: "ipwo" },
    screenshots: [], featured: false, categoryId: 1, subCategoryId: 11,
    metaTitle: "IPWO - 全球住宅代理", metaDescription: "IPWO 原生住宅$2/IP起",
  },
  {
    id: 7, slug: "ipipgo", name: "IPIPGO海外代理IP", logo: "https://placehold.co/48/13c2c2/fff?text=IG",
    shortDesc: "免费测试，15元起", fullDesc: "IPIPGO 是一家专业的海外代理IP服务商，支持HTTP/HTTPS/SOCKS5协议。",
    tags: ["优"], rating: 4, link: { type: "detail", slug: "ipipgo" },
    screenshots: [], featured: false, categoryId: 1, subCategoryId: 12,
  },
  {
    id: 8, slug: "smartproxy", name: "Smartproxy", logo: "https://placehold.co/48/eb2f96/fff?text=SM",
    shortDesc: "高端住宅代理，覆盖195+国家", fullDesc: "Smartproxy 是全球领先的代理服务提供商。",
    tags: ["推荐"], rating: 5, link: { type: "detail", slug: "smartproxy" },
    screenshots: [], featured: false, categoryId: 1, subCategoryId: 12,
    metaTitle: "Smartproxy - 高端住宅代理", metaDescription: "覆盖195+国家的高端住宅代理",
  },
  {
    id: 9, slug: "luminati", name: "lumiproxy", logo: "https://placehold.co/48/1890ff/fff?text=LM",
    shortDesc: "企业级全球代理网络", fullDesc: "lumiproxy 提供企业级的全球代理网络解决方案。",
    tags: [], rating: 4, link: { type: "external", url: "https://www.lumiproxy.com" },
    screenshots: [], featured: false, categoryId: 1, subCategoryId: 12,
  },

  // ===== TikTok (categoryId: 2) =====
  {
    id: 10, slug: "tiktok-shop", name: "TikTok Shop", logo: "https://placehold.co/48/000/fff?text=TK",
    shortDesc: "官方TikTok小店入驻", fullDesc: "TikTok Shop 是 TikTok 官方电商平台，支持全球多个国家和地区开店。",
    tags: ["推荐"], rating: 5, link: { type: "detail", slug: "tiktok-shop" },
    screenshots: [], featured: true, categoryId: 2, subCategoryId: 21,
    metaTitle: "TikTok Shop - 官方电商平台", metaDescription: "TikTok 官方电商平台入驻指南",
  },
  {
    id: 11, slug: "tiktok-ads", name: "TikTok Ads", logo: "https://placehold.co/48/ff0050/fff?text=TA",
    shortDesc: "TikTok 官方广告平台", fullDesc: "TikTok Ads 是 TikTok 的官方广告投放平台。",
    tags: [], rating: 5, link: { type: "external", url: "https://ads.tiktok.com" },
    screenshots: [], featured: false, categoryId: 2, subCategoryId: 21,
  },
  {
    id: 12, slug: "kalodata", name: "Kalodata", logo: "https://placehold.co/48/6c5ce7/fff?text=KD",
    shortDesc: "TikTok 数据分析，达人营销平台", fullDesc: "Kalodata 是一家专注于TikTok数据分析的平台，帮助品牌发现达人、分析趋势。",
    tags: ["NEW"], rating: 4, link: { type: "detail", slug: "kalodata" },
    screenshots: [], featured: false, categoryId: 2, subCategoryId: 22,
  },

  // ===== 跨境金融 (categoryId: 3) =====
  {
    id: 13, slug: "qbit", name: "QBit", logo: "https://placehold.co/48/faad14/fff?text=QB",
    shortDesc: "跨境企业全球收付款解决方案", fullDesc: "QBit 提供跨境企业全球收付款解决方案，支持多币种收款和付款。",
    tags: ["推荐"], rating: 5, link: { type: "detail", slug: "qbit" },
    screenshots: [], featured: true, categoryId: 3, subCategoryId: 31,
    metaTitle: "QBit - 全球收付款解决方案", metaDescription: "QBit 跨境企业全球收付款",
  },
  {
    id: 14, slug: "vmcard", name: "vmcard虚拟卡", logo: "https://placehold.co/48/a0d911/fff?text=VM",
    shortDesc: "广告投放专用虚拟信用卡", fullDesc: "vmcard 提供广告投放专用的虚拟信用卡服务。",
    tags: [], rating: 4, link: { type: "detail", slug: "vmcard" },
    screenshots: [], featured: false, categoryId: 3, subCategoryId: 31,
    metaTitle: "vmcard - 虚拟信用卡", metaDescription: "广告投放专用虚拟信用卡",
  },
  {
    id: 15, slug: "payoneer", name: "Payoneer派安盈", logo: "https://placehold.co/48/ff6b35/fff?text=PY",
    shortDesc: "全球跨境支付领导品牌", fullDesc: "Payoneer 是全球领先的跨境支付平台，服务数百万企业和专业人士。",
    tags: ["TOP"], rating: 5, link: { type: "external", url: "https://www.payoneer.com" },
    screenshots: [], featured: true, categoryId: 3, subCategoryId: 32,
  },

  // ===== 国际信息 (categoryId: 4) =====
  {
    id: 16, slug: "inboxkitten", name: "InboxKitten", logo: "https://placehold.co/48/00b894/fff?text=IK",
    shortDesc: "临时邮箱，免费使用", fullDesc: "InboxKitten 提供免费临时邮箱服务，适用于注册验证等场景。",
    tags: [], rating: 4, link: { type: "detail", slug: "inboxkitten" },
    screenshots: [], featured: false, categoryId: 4, subCategoryId: 41,
    metaTitle: "InboxKitten - 免费临时邮箱", metaDescription: "InboxKitten 免费临时邮箱服务",
  },
  {
    id: 17, slug: "tempmail", name: "Tempail", logo: "https://placehold.co/48/e17055/fff?text=TM",
    shortDesc: "一次性临时邮箱服务", fullDesc: "Tempail 提供安全的一次性临时邮箱。",
    tags: [], rating: 3, link: { type: "external", url: "https://tempail.com" },
    screenshots: [], featured: false, categoryId: 4, subCategoryId: 41,
  },

  // ===== 跨境资讯 (categoryId: 5) =====
  {
    id: 18, slug: "ame123", name: "AME123", logo: "https://placehold.co/48/d63031/fff?text=AM",
    shortDesc: "跨境电商综合资讯平台", fullDesc: "AME123 是国内知名的跨境电商资讯平台。",
    tags: [], rating: 4, link: { type: "external", url: "https://www.ame123.com" },
    screenshots: [], featured: false, categoryId: 5, subCategoryId: 51,
  },
  {
    id: 19, slug: "marketing-tools", name: "Marketing Tools", logo: "https://placehold.co/48/0984e3/fff?text=MT",
    shortDesc: "海外营销工具集合", fullDesc: "Marketing Tools 汇集海外各类营销工具推荐和教程。",
    tags: ["NEW"], rating: 4, link: { type: "detail", slug: "marketing-tools" },
    screenshots: [], featured: false, categoryId: 5, subCategoryId: 51,
    metaTitle: "Marketing Tools - 海外营销工具", metaDescription: "海外营销工具集合推荐",
  },

  // ===== 广告工具 (categoryId: 6) =====
  {
    id: 20, slug: "adspower", name: "AdsPower", logo: "https://placehold.co/48/6c5ce7/fff?text=AP",
    shortDesc: "多账号防关联浏览器", fullDesc: "AdsPower 是专业的多账号管理防关联浏览器。",
    tags: ["推荐"], rating: 5, link: { type: "detail", slug: "adspower" },
    screenshots: [], featured: true, categoryId: 6, subCategoryId: 61,
    metaTitle: "AdsPower - 多账号防关联浏览器", metaDescription: "专业的多账号管理防关联浏览器",
  },
  {
    id: 21, slug: "vmlogin", name: "VMLogin", logo: "https://placehold.co/48/fdcb6e/333?text=VL",
    shortDesc: "指纹浏览器，安全多开", fullDesc: "VMLogin 提供安全的指纹浏览器服务。",
    tags: [], rating: 4, link: { type: "detail", slug: "vmlogin" },
    screenshots: [], featured: false, categoryId: 6, subCategoryId: 61,
    metaTitle: "VMLogin - 指纹浏览器", metaDescription: "VMLogin 安全指纹浏览器",
  },

  // ===== 海外推广 (categoryId: 7) =====
  {
    id: 22, slug: "hubstudio", name: "HubStudio", logo: "https://placehold.co/48/1677ff/fff?text=HS",
    shortDesc: "免费指纹浏览器，安全多开", fullDesc: "HubStudio 是一款免费的指纹浏览器，适用于跨境电商多账号管理。",
    tags: ["推荐"], rating: 5, link: { type: "detail", slug: "hubstudio" },
    screenshots: [], featured: true, categoryId: 7, subCategoryId: 72,
    metaTitle: "HubStudio - 免费指纹浏览器", metaDescription: "免费指纹浏览器，安全多开",
  },

  // ===== 独立站 (categoryId: 8) =====
  {
    id: 23, slug: "shopify", name: "Shopify", logo: "https://placehold.co/48/96bf48/fff?text=SF",
    shortDesc: "全球领先的独立站建站平台", fullDesc: "Shopify 是全球最受欢迎的独立站建站平台之一。",
    tags: ["TOP"], rating: 5, link: { type: "external", url: "https://www.shopify.com" },
    screenshots: [], featured: false, categoryId: 8, subCategoryId: 81,
  },
  {
    id: 24, slug: "b2proxy", name: "B2Proxy全球代理", logo: "https://placehold.co/48/2196f3/fff?text=B2",
    shortDesc: "1GB免费试用，8000万+IP", fullDesc: "B2Proxy 提供全球高质量代理IP服务。",
    tags: ["NEW"], rating: 4, link: { type: "detail", slug: "b2proxy" },
    screenshots: [], featured: false, categoryId: 1, subCategoryId: 11,
    metaTitle: "B2Proxy - 全球代理", metaDescription: "1GB免费试用，8000万+IP",
  },
  {
    id: 25, slug: "kookeey", name: "kookeey", logo: "https://placehold.co/48/ff9800/fff?text=KK",
    shortDesc: "Hub会员首月9折", fullDesc: "kookeey 提供全球代理IP服务，Hub会员专享优惠。",
    tags: [], rating: 4, link: { type: "external", url: "https://www.kookeey.com" },
    screenshots: [], featured: false, categoryId: 1, subCategoryId: 12,
  },
];
