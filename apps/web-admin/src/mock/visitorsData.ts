export interface Visitor {
  id: number;
  name: string;
  customerLabel: string;
  email: string;
  phone: string;
  firstVisit: string;
  lastVisit: string;
  trackCount: number;
  sourceUrl: string;
  sessionCount: number;
  ip: string;
  os: string;
  browser: string;
  tracks: Array<{
    title: string;
    url: string;
    time: string;
    duration: string;
    online: boolean;
  }>;
}

export const visitorsData: Visitor[] = [
  {
    id: 1,
    name: "Visitor6",
    customerLabel: "",
    email: "",
    phone: "",
    firstVisit: "2026-03-27 17:53",
    lastVisit: "2026-03-27 17:53",
    trackCount: 1,
    sourceUrl: "https://twt.test2.jishu666.com/zh-cn?appid=e34...",
    sessionCount: 1,
    ip: "220.180.34.126 安徽 合肥 蜀山 电信",
    os: "Mac OS X",
    browser: "Chrome 130.0.0.0",
    tracks: [
      {
        title: "TWT-即刻启...",
        url: "https://twt.test2.jishu666.com/zh-cn?appi...",
        time: "2小时 2029 16秒",
        duration: "1分钟",
        online: true,
      },
    ],
  },
  {
    id: 2,
    name: "Visitor5",
    customerLabel: "",
    email: "",
    phone: "",
    firstVisit: "2026-03-26 15:43",
    lastVisit: "2026-03-26 15:43",
    trackCount: 1,
    sourceUrl: "https://twt.test2.jishu666.com/zh-cn?appid=e34...",
    sessionCount: 1,
    ip: "220.180.34.126 安徽 合肥 蜀山 电信",
    os: "Mac OS X",
    browser: "Chrome 130.0.0.0",
    tracks: [],
  },
  {
    id: 3,
    name: "Visitor4",
    customerLabel: "",
    email: "",
    phone: "",
    firstVisit: "2026-03-26 15:43",
    lastVisit: "2026-03-26 15:43",
    trackCount: 1,
    sourceUrl: "https://twt.test2.jishu666.com/zh-cn?appid=e34...",
    sessionCount: 1,
    ip: "220.180.34.126 安徽 合肥 蜀山 电信",
    os: "Mac OS X",
    browser: "Chrome 130.0.0.0",
    tracks: [],
  },
  {
    id: 4,
    name: "Visitor3",
    customerLabel: "",
    email: "",
    phone: "",
    firstVisit: "2026-03-26 15:29",
    lastVisit: "2026-03-26 15:29",
    trackCount: 1,
    sourceUrl: "https://twt.test2.jishu666.com/zh-cn?appid=e34...",
    sessionCount: 1,
    ip: "220.180.34.126 安徽 合肥 蜀山 电信",
    os: "Mac OS X",
    browser: "Chrome 130.0.0.0",
    tracks: [],
  },
  {
    id: 5,
    name: "Visitor2",
    customerLabel: "VIP客户",
    email: "visitor2@example.com",
    phone: "13800138002",
    firstVisit: "2026-03-26 15:29",
    lastVisit: "2026-03-27 12:01",
    trackCount: 2,
    sourceUrl: "https://twt.test2.jishu666.com/zh-cn?appid=e34...",
    sessionCount: 2,
    ip: "220.180.34.126 安徽 合肥 蜀山 电信",
    os: "Mac OS X",
    browser: "Chrome 130.0.0.0",
    tracks: [],
  },
  {
    id: 6,
    name: "Visitor1",
    customerLabel: "企业客户",
    email: "visitor1@example.com",
    phone: "13800138001",
    firstVisit: "2026-03-26 15:28",
    lastVisit: "2026-03-27 17:27",
    trackCount: 37,
    sourceUrl: "https://twt.test2.jishu666.com/zh-cn?appid=e34...",
    sessionCount: 37,
    ip: "220.180.34.126 安徽 合肥 蜀山 电信",
    os: "Mac OS X",
    browser: "Chrome 130.0.0.0",
    tracks: [],
  },
];
