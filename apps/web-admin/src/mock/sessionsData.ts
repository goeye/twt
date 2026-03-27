export interface Session {
  id: number;
  projectName: string;
  projectId: number;
  visitorName: string;
  visitorLabel: string;
  visitorRemark: string;
  customerLabel: string;
  projectNameShort: string;
  status: string;
  messageCount: number;
  assignedStaff: string;
  clientCount: number;
  tags: string;
  sourceChannel: string;
  createTime: string;
  acceptTime: string;
  serviceDuration: string;
  visitorRating: string;
  deleteStatus: string;
}

export const sessionsData: Session[] = [
  {
    id: 1,
    projectName: "测试app档案",
    projectId: 572,
    visitorName: "Visitor2",
    visitorLabel: "",
    visitorRemark: "",
    customerLabel: "",
    projectNameShort: "",
    status: "已回复",
    messageCount: 5,
    assignedStaff: "潘金莲与武大郎的灰姑娘故事",
    clientCount: 2,
    tags: "-",
    sourceChannel: "web",
    createTime: "2026-03-27 12:01:59",
    acceptTime: "2026-03-27 12:02:08",
    serviceDuration: "-",
    visitorRating: "-",
    deleteStatus: "正常",
  },
  {
    id: 2,
    projectName: "&#65308;script&#65310;alert(&#65282;xss&#65282;)&#65308;//script&#65310;//",
    projectId: 103,
    visitorName: "Visitor2",
    visitorLabel: "",
    visitorRemark: "",
    customerLabel: "",
    projectNameShort: "",
    status: "待回复",
    messageCount: 1,
    assignedStaff: "aaaa",
    clientCount: 1,
    tags: "-",
    sourceChannel: "网页插件",
    createTime: "2026-03-27 11:48:16",
    acceptTime: "2026-03-27 11:48:16",
    serviceDuration: "-",
    visitorRating: "-",
    deleteStatus: "正常",
  },
  {
    id: 3,
    projectName: "&#65308;script&#65310;alert(&#65282;xss&#65282;)&#65308;//script&#65310;//",
    projectId: 103,
    visitorName: "Visitor2",
    visitorLabel: "",
    visitorRemark: "",
    customerLabel: "",
    projectNameShort: "",
    status: "待回复",
    messageCount: 1,
    assignedStaff: "aaaa",
    clientCount: 1,
    tags: "-",
    sourceChannel: "Email",
    createTime: "2026-03-27 11:47:15",
    acceptTime: "2026-03-27 11:47:15",
    serviceDuration: "-",
    visitorRating: "-",
    deleteStatus: "正常",
  },
  {
    id: 4,
    projectName: "&#65308;script&#65310;alert(&#65282;xss&#65282;)&#65308;//script&#65310;//",
    projectId: 103,
    visitorName: "Visitor12",
    visitorLabel: "所有人",
    visitorRemark: "",
    customerLabel: "",
    projectNameShort: "",
    status: "已结束",
    messageCount: 6,
    assignedStaff: "&#65308;script&#65310;alert(&#65282;xss&#65282;)&#65308;//script&#65310;//",
    clientCount: 2,
    tags: "-",
    sourceChannel: "web",
    createTime: "2026-03-27 11:46:47",
    acceptTime: "2026-03-27 11:46:47",
    serviceDuration: "13分42秒",
    visitorRating: "-",
    deleteStatus: "正常",
  },
  {
    id: 5,
    projectName: "&#65308;script&#65310;alert(&#65282;xss&#65282;)&#65308;//script&#65310;//",
    projectId: 103,
    visitorName: "Visitor13",
    visitorLabel: "@所有人",
    visitorRemark: "",
    customerLabel: "",
    projectNameShort: "",
    status: "待回复",
    messageCount: 0,
    assignedStaff: "aaaa",
    clientCount: 1,
    tags: "-",
    sourceChannel: "网页插件",
    createTime: "2026-03-27 11:40:38",
    acceptTime: "2026-03-27 11:40:38",
    serviceDuration: "-",
    visitorRating: "-",
    deleteStatus: "正常",
  },
];
