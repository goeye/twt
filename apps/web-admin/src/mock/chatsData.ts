export interface Chat {
  id: number;
  title: string;
  projectName: string;
  projectId: number;
  type: string;
  status: string;
  category: string;
  messageCount: number;
  groupOwner: string;
  visitorCount: number;
  clientCount: number;
  createTime: string;
  lastUpdateTime: string;
  deleteStatus: string;
}

export const chatsData: Chat[] = [
  {
    id: 1,
    title: "潘金莲与武大郎的灰姑娘故事与Visitor5/2...",
    projectName: "测试app档案",
    projectId: 572,
    type: "群聊",
    status: "活跃",
    category: "外部",
    messageCount: 2,
    groupOwner: "潘金莲与武大郎的灰姑娘故事",
    visitorCount: 3,
    clientCount: 2,
    createTime: "2026-03-27 12:01:12",
    lastUpdateTime: "2026-03-27 12:01:26",
    deleteStatus: "正常",
  },
  {
    id: 2,
    title: "潘金莲与武大郎的灰姑娘故事与1的聊天",
    projectName: "测试app档案",
    projectId: 572,
    type: "单聊",
    status: "活跃",
    category: "内部",
    messageCount: 2,
    groupOwner: "潘金莲与武大郎的灰姑娘故事",
    visitorCount: 0,
    clientCount: 2,
    createTime: "2026-03-27 11:42:17",
    lastUpdateTime: "2026-03-27 11:42:25",
    deleteStatus: "正常",
  },
  {
    id: 3,
    title: "AlienWang,Visitor12,Visitor1...",
    projectName: "客上科技有限公司",
    projectId: 29,
    type: "群聊",
    status: "活跃",
    category: "外部",
    messageCount: 0,
    groupOwner: "AlienWang",
    visitorCount: 3,
    clientCount: 1,
    createTime: "2026-03-27 10:39:57",
    lastUpdateTime: "2026-03-27 10:39:57",
    deleteStatus: "正常",
  },
];
