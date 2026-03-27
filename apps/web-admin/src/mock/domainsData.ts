export interface Domain {
  id: number;
  domain: string;
  projectName: string;
  projectId: number;
  accessStatus: string;
  visitorCount: number;
  sessionWindowOpenCount: number;
  sessionCount: number;
  sessionIndependentVisitorCount: number;
  accessTime: string;
  lastVisitorMessageTime: string;
}

export const domainsData: Domain[] = [
  {
    id: 1,
    domain: "http://twt.test2.jishu666.com",
    projectName: "测试app档案",
    projectId: 572,
    accessStatus: "已接入",
    visitorCount: 5,
    sessionWindowOpenCount: 13,
    sessionCount: 12,
    sessionIndependentVisitorCount: 3,
    accessTime: "2026-03-26",
    lastVisitorMessageTime: "2026-03-27",
  },
  {
    id: 2,
    domain: "http://twt.test2.jishu666.com",
    projectName: "我是缓存另一个项目",
    projectId: 564,
    accessStatus: "已接入",
    visitorCount: 1,
    sessionWindowOpenCount: 0,
    sessionCount: 1,
    sessionIndependentVisitorCount: 0,
    accessTime: "2026-03-23",
    lastVisitorMessageTime: "2026-03-24",
  },
  {
    id: 3,
    domain: "http://twt.test2.jishu666.com",
    projectName: "缓存测试",
    projectId: 563,
    accessStatus: "已接入",
    visitorCount: 7,
    sessionWindowOpenCount: 2,
    sessionCount: 0,
    sessionIndependentVisitorCount: 0,
    accessTime: "2026-03-23",
    lastVisitorMessageTime: "-",
  },
];