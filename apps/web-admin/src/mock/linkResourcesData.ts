export type ResourceTag = "推荐" | "TOP" | "NEW" | "优";

export type LinkBehavior =
  | { type: "external"; url: string }
  | { type: "detail"; slug: string };

export interface ResourceRecord {
  id: number;
  slug: string;
  name: string;
  logo: string;
  shortDesc: string;
  fullDesc: string;
  tags: ResourceTag[];
  rating: number;
  link: LinkBehavior;
  screenshots: string[];
  featured: boolean;
  categoryId: number;
  subCategoryId?: number;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

export const linkResourcesData: ResourceRecord[] = [
  {
    id: 1, slug: "proxy-quick", name: "Proxy Quick", logo: "https://placehold.co/48/1677ff/fff?text=PQ",
    shortDesc: "美国、英国、德国、日本等全球优质代理IP", fullDesc: "Proxy Quick 提供全球200+国家和地区的优质代理IP服务。",
    tags: ["推荐"], rating: 5, link: { type: "detail", slug: "proxy-quick" },
    screenshots: [], featured: true, categoryId: 1, subCategoryId: 11,
    metaTitle: "Proxy Quick - 全球优质代理IP", metaDescription: "全球200+国家优质代理IP",
    createdAt: "2026-03-10 10:00:00", updatedAt: "2026-03-10 10:00:00",
  },
  {
    id: 2, slug: "thordata", name: "Thordata全球代理", logo: "https://placehold.co/48/fa8c16/fff?text=TD",
    shortDesc: "六千万原生动/静态住宅代理", fullDesc: "Thordata 拥有6000万+全球住宅IP资源。",
    tags: ["TOP"], rating: 5, link: { type: "detail", slug: "thordata" },
    screenshots: [], featured: true, categoryId: 1, subCategoryId: 11,
    metaTitle: "Thordata - 全球代理IP", metaDescription: "六千万原生动/静态住宅代理",
    createdAt: "2026-03-10 11:00:00", updatedAt: "2026-03-10 11:00:00",
  },
  {
    id: 3, slug: "sx-org", name: "SX.ORG", logo: "https://placehold.co/48/333/fff?text=SX",
    shortDesc: "全球优质 IP 地址，23+ 国家", fullDesc: "SX.ORG 专注于高质量代理IP服务。",
    tags: [], rating: 4, link: { type: "external", url: "https://www.sx.org" },
    screenshots: [], featured: false, categoryId: 1, subCategoryId: 11,
    metaTitle: "SX.ORG", metaDescription: "全球优质IP地址",
    createdAt: "2026-03-10 12:00:00", updatedAt: "2026-03-10 12:00:00",
  },
  {
    id: 4, slug: "cliproxy", name: "Cliproxy", logo: "https://placehold.co/48/52c41a/fff?text=CP",
    shortDesc: "免费测试，全球200+国家IP", fullDesc: "Cliproxy 是一家专注于跨境电商的代理IP服务商。",
    tags: [], rating: 4, link: { type: "detail", slug: "cliproxy" },
    screenshots: [], featured: false, categoryId: 1, subCategoryId: 11,
    metaTitle: "Cliproxy - 跨境电商代理IP", metaDescription: "免费测试，全球200+国家IP",
    createdAt: "2026-03-11 10:00:00", updatedAt: "2026-03-11 10:00:00",
  },
  {
    id: 5, slug: "swiftproxy", name: "SwiftProxy", logo: "https://placehold.co/48/ff4d4f/fff?text=SP",
    shortDesc: "全球独享纯净住宅代理IP", fullDesc: "SwiftProxy 提供独享纯净住宅代理IP。",
    tags: ["NEW"], rating: 4, link: { type: "detail", slug: "swiftproxy" },
    screenshots: [], featured: true, categoryId: 1, subCategoryId: 11,
    metaTitle: "SwiftProxy - 独享纯净住宅代理", metaDescription: "全球独享纯净住宅代理IP",
    createdAt: "2026-03-12 10:00:00", updatedAt: "2026-03-12 10:00:00",
  },
  {
    id: 6, slug: "tiktok-shop", name: "TikTok Shop", logo: "https://placehold.co/48/000/fff?text=TK",
    shortDesc: "官方TikTok小店入驻", fullDesc: "TikTok Shop 是 TikTok 官方电商平台。",
    tags: ["推荐"], rating: 5, link: { type: "detail", slug: "tiktok-shop" },
    screenshots: [], featured: true, categoryId: 2, subCategoryId: 21,
    metaTitle: "TikTok Shop - 官方电商平台", metaDescription: "TikTok 官方电商平台入驻指南",
    createdAt: "2026-03-10 10:00:00", updatedAt: "2026-03-10 10:00:00",
  },
  {
    id: 7, slug: "qbit", name: "QBit", logo: "https://placehold.co/48/faad14/fff?text=QB",
    shortDesc: "跨境企业全球收付款解决方案", fullDesc: "QBit 提供跨境企业全球收付款解决方案。",
    tags: ["推荐"], rating: 5, link: { type: "detail", slug: "qbit" },
    screenshots: [], featured: true, categoryId: 3, subCategoryId: 31,
    metaTitle: "QBit - 全球收付款", metaDescription: "跨境企业全球收付款解决方案",
    createdAt: "2026-03-10 10:00:00", updatedAt: "2026-03-10 10:00:00",
  },
  {
    id: 8, slug: "adspower", name: "AdsPower", logo: "https://placehold.co/48/6c5ce7/fff?text=AP",
    shortDesc: "多账号防关联浏览器", fullDesc: "AdsPower 是专业的多账号管理防关联浏览器。",
    tags: ["推荐"], rating: 5, link: { type: "detail", slug: "adspower" },
    screenshots: [], featured: true, categoryId: 6, subCategoryId: 61,
    metaTitle: "AdsPower - 防关联浏览器", metaDescription: "专业的多账号管理防关联浏览器",
    createdAt: "2026-03-13 10:00:00", updatedAt: "2026-03-13 10:00:00",
  },
  {
    id: 9, slug: "payoneer", name: "Payoneer派安盈", logo: "https://placehold.co/48/ff6b35/fff?text=PY",
    shortDesc: "全球跨境支付领导品牌", fullDesc: "Payoneer 是全球领先的跨境支付平台。",
    tags: ["TOP"], rating: 5, link: { type: "external", url: "https://www.payoneer.com" },
    screenshots: [], featured: true, categoryId: 3, subCategoryId: 32,
    metaTitle: "Payoneer - 跨境支付", metaDescription: "全球跨境支付领导品牌",
    createdAt: "2026-03-11 10:00:00", updatedAt: "2026-03-11 10:00:00",
  },
  {
    id: 10, slug: "hubstudio", name: "HubStudio", logo: "https://placehold.co/48/1677ff/fff?text=HS",
    shortDesc: "免费指纹浏览器，安全多开", fullDesc: "HubStudio 是一款免费的指纹浏览器。",
    tags: ["推荐"], rating: 5, link: { type: "detail", slug: "hubstudio" },
    screenshots: [], featured: true, categoryId: 7, subCategoryId: 72,
    metaTitle: "HubStudio - 免费指纹浏览器", metaDescription: "免费指纹浏览器，安全多开",
    createdAt: "2026-03-14 10:00:00", updatedAt: "2026-03-14 10:00:00",
  },
];
