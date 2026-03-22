export interface BannerRecord {
  id: number;
  imageUrl: string;
  linkUrl: string;
  altText: string;
  order: number;
  status: "active" | "inactive";
  createdAt: string;
}

export const bannersData: BannerRecord[] = [
  {
    id: 1,
    imageUrl: "https://placehold.co/400x200/ff7a00/fff?text=储值加赠+IP圣诞礼",
    linkUrl: "https://www.example.com/promo1",
    altText: "储值加赠 IP 圣诞礼",
    order: 1,
    status: "active",
    createdAt: "2026-03-10 10:00:00",
  },
  {
    id: 2,
    imageUrl: "https://placehold.co/400x200/1677ff/fff?text=静态住宅+全球高纯净",
    linkUrl: "https://www.example.com/promo2",
    altText: "静态住宅 全球高纯净原生家宽住宅ISP",
    order: 2,
    status: "active",
    createdAt: "2026-03-11 14:30:00",
  },
  {
    id: 3,
    imageUrl: "https://placehold.co/400x200/52c41a/fff?text=海外代理+$0.49/GB",
    linkUrl: "https://www.example.com/promo3",
    altText: "海外代理 $0.49/GB 起",
    order: 3,
    status: "active",
    createdAt: "2026-03-12 09:15:00",
  },
  {
    id: 4,
    imageUrl: "https://placehold.co/400x200/722ed1/fff?text=年终特惠",
    linkUrl: "https://www.example.com/promo4",
    altText: "年终特惠大促",
    order: 4,
    status: "inactive",
    createdAt: "2026-03-08 16:00:00",
  },
  {
    id: 5,
    imageUrl: "https://placehold.co/400x200/eb2f96/fff?text=新用户注册送流量",
    linkUrl: "https://www.example.com/promo5",
    altText: "新用户注册送流量",
    order: 5,
    status: "active",
    createdAt: "2026-03-15 11:00:00",
  },
];
