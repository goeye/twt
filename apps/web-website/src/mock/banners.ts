import type { Banner } from "../types";

export const banners: Banner[] = [
  {
    id: 1,
    imageUrl: "https://placehold.co/400x200/ff7a00/fff?text=储值加赠+IP圣诞礼",
    linkUrl: "https://www.example.com/promo1",
    altText: "储值加赠 IP 圣诞礼",
    order: 1,
  },
  {
    id: 2,
    imageUrl: "https://placehold.co/400x200/1677ff/fff?text=静态住宅+全球高纯净",
    linkUrl: "https://www.example.com/promo2",
    altText: "静态住宅 全球高纯净原生家宽住宅ISP",
    order: 2,
  },
  {
    id: 3,
    imageUrl: "https://placehold.co/400x200/52c41a/fff?text=海外代理+$0.49/GB",
    linkUrl: "https://www.example.com/promo3",
    altText: "海外代理 $0.49/GB 起",
    order: 3,
  },
];
