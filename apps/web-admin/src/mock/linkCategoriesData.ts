export interface SubCategoryRecord {
  id: number;
  name: string;
}

export interface CategoryRecord {
  id: number;
  name: string;
  icon: string;
  slug: string;
  order: number;
  subCategories: SubCategoryRecord[];
  createdAt: string;
}

export const linkCategoriesData: CategoryRecord[] = [
  {
    id: 1, name: "网络资源", icon: "🌐", slug: "network", order: 1,
    subCategories: [
      { id: 11, name: "静态代理" }, { id: 12, name: "动态代理" },
      { id: 13, name: "国内代理" }, { id: 14, name: "TIKTOK直播专线" },
      { id: 15, name: "指纹检测" }, { id: 16, name: "代理检测" },
    ],
    createdAt: "2026-03-01 10:00:00",
  },
  {
    id: 2, name: "TikTok", icon: "🎵", slug: "tiktok", order: 2,
    subCategories: [
      { id: 21, name: "平台入口" }, { id: 22, name: "网红平台" },
      { id: 23, name: "培训机构" }, { id: 24, name: "ERP" }, { id: 25, name: "TK选品" },
    ],
    createdAt: "2026-03-01 10:00:00",
  },
  {
    id: 3, name: "跨境金融", icon: "💳", slug: "finance", order: 3,
    subCategories: [
      { id: 31, name: "虚拟信用卡" }, { id: 32, name: "跨境支付" },
      { id: 33, name: "财税合规" }, { id: 34, name: "跨境贷款" },
    ],
    createdAt: "2026-03-01 10:00:00",
  },
  {
    id: 4, name: "国际信息", icon: "📧", slug: "international-info", order: 4,
    subCategories: [
      { id: 41, name: "虚拟邮箱" }, { id: 42, name: "国际短信" },
      { id: 43, name: "虚拟资料生成器" },
    ],
    createdAt: "2026-03-02 10:00:00",
  },
  {
    id: 5, name: "跨境资讯", icon: "📊", slug: "cross-border-news", order: 5,
    subCategories: [
      { id: 51, name: "国内论坛" }, { id: 52, name: "国外论坛" }, { id: 53, name: "aFFarm联盟" },
    ],
    createdAt: "2026-03-02 10:00:00",
  },
  {
    id: 6, name: "广告工具", icon: "📢", slug: "ad-tools", order: 6,
    subCategories: [
      { id: 61, name: "广告投放" }, { id: 62, name: "素材制作" }, { id: 63, name: "数据分析" },
    ],
    createdAt: "2026-03-03 10:00:00",
  },
  {
    id: 7, name: "海外推广", icon: "🚀", slug: "overseas-promotion", order: 7,
    subCategories: [
      { id: 71, name: "SEO工具" }, { id: 72, name: "社媒营销" }, { id: 73, name: "红人营销" },
    ],
    createdAt: "2026-03-03 10:00:00",
  },
  {
    id: 8, name: "独立站", icon: "🏪", slug: "independent-site", order: 8,
    subCategories: [
      { id: 81, name: "建站工具" }, { id: 82, name: "支付集成" }, { id: 83, name: "物流服务" },
    ],
    createdAt: "2026-03-04 10:00:00",
  },
];
