/** 预警列表 Mock 数据 */

export type SenderRole = "visitor" | "agent";
export type AlertType = "session" | "chat";

export interface AlertRecord {
  id: number;
  content: string;
  triggerKeywords: string[];
  type: AlertType;
  sender: string;
  senderRole: SenderRole;
  sessionTitle: string;
  projectName: string;
  projectId: number;
  triggerTime: string;
}

export const alertTypeOptions = [
  { label: "全部", value: "all" },
  { label: "会话", value: "session" },
  { label: "聊天", value: "chat" },
];

export const alertsData: AlertRecord[] = [
  { id: 1, content: "我可以先转账给你，你把银行卡号发我", triggerKeywords: ["转账", "银行卡号"], type: "session", sender: "张伟", senderRole: "visitor", sessionTitle: "咨询产品退款流程", projectName: "延珠烧烤", projectId: 554, triggerTime: "2026-03-10 09:12:34" },
  { id: 2, content: "你把银行卡信息发过来，我安排打款", triggerKeywords: ["银行卡", "打款"], type: "chat", sender: "傅晓康", senderRole: "agent", sessionTitle: "询问付款方式", projectName: "TWT Chat", projectId: 352, triggerTime: "2026-03-10 10:45:12" },
  { id: 3, content: "合同我已经签好了，你看一下协议内容", triggerKeywords: ["合同", "协议"], type: "session", sender: "林小雨", senderRole: "visitor", sessionTitle: "合同签署确认", projectName: "test3", projectId: 489, triggerTime: "2026-03-11 14:23:08" },
  { id: 4, content: "麻烦把身份证正反面拍照发给我", triggerKeywords: ["身份证"], type: "session", sender: "马素强", senderRole: "agent", sessionTitle: "实名认证协助", projectName: "延珠烧烤", projectId: 554, triggerTime: "2026-03-11 16:05:41" },
  { id: 5, content: "定金已经汇过去了，请确认收款", triggerKeywords: ["定金", "汇"], type: "chat", sender: "陈思远", senderRole: "visitor", sessionTitle: "订单定金支付", projectName: "测试app的项目", projectId: 538, triggerTime: "2026-03-12 08:30:55" },
  { id: 6, content: "护照号码是 G12345678", triggerKeywords: ["护照号码"], type: "session", sender: "王丽华", senderRole: "visitor", sessionTitle: "出境资料提交", projectName: "TWT Chat", projectId: 352, triggerTime: "2026-03-12 11:18:29" },
  { id: 7, content: "用支付宝转到这个账号就行", triggerKeywords: ["支付宝", "转"], type: "chat", sender: "赵明辉", senderRole: "visitor", sessionTitle: "线上支付咨询", projectName: "test3", projectId: 489, triggerTime: "2026-03-13 09:44:17" },
  { id: 8, content: "签约协议需要盖章吗？", triggerKeywords: ["签约", "协议"], type: "session", sender: "刘婷婷", senderRole: "visitor", sessionTitle: "企业合作签约", projectName: "延珠烧烤", projectId: 554, triggerTime: "2026-03-13 13:56:03" },
  { id: 9, content: "押金和保证金一起付可以吗", triggerKeywords: ["押金", "保证金"], type: "session", sender: "孙浩然", senderRole: "visitor", sessionTitle: "租赁押金确认", projectName: "测试app的项目", projectId: 538, triggerTime: "2026-03-14 10:22:48" },
  { id: 10, content: "驾照上面的地址需要更新", triggerKeywords: ["驾照"], type: "chat", sender: "李四", senderRole: "agent", sessionTitle: "证件信息变更", projectName: "TWT Chat", projectId: 352, triggerTime: "2026-03-14 15:07:36" },
  { id: 11, content: "汇款到你们公司的对公账户对吧", triggerKeywords: ["汇款", "对公账户"], type: "session", sender: "周敏", senderRole: "visitor", sessionTitle: "对公汇款咨询", projectName: "延珠烧烤", projectId: 554, triggerTime: "2026-03-15 08:55:22" },
  { id: 12, content: "这份协议第三条有歧义", triggerKeywords: ["协议"], type: "session", sender: "吴晓峰", senderRole: "visitor", sessionTitle: "协议条款疑问", projectName: "test3", projectId: 489, triggerTime: "2026-03-15 14:33:19" },
  { id: 13, content: "PayPal 付款后截图给你", triggerKeywords: ["PayPal", "付款"], type: "chat", sender: "黄嘉琪", senderRole: "visitor", sessionTitle: "海外支付确认", projectName: "测试app的项目", projectId: 538, triggerTime: "2026-03-16 09:10:05" },
  { id: 14, content: "社保号要提供完整的吗", triggerKeywords: ["社保号"], type: "session", sender: "杨文博", senderRole: "visitor", sessionTitle: "社保信息采集", projectName: "TWT Chat", projectId: 352, triggerTime: "2026-03-16 11:42:51" },
  { id: 15, content: "预付款打了一半，剩下的月底结", triggerKeywords: ["预付款"], type: "chat", sender: "傅晓康", senderRole: "agent", sessionTitle: "分期付款安排", projectName: "延珠烧烤", projectId: 554, triggerTime: "2026-03-16 14:28:37" },
];
