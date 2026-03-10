export const AI_AGENT_SETTINGS_STORAGE_KEY = "twt:ai-agent-settings";

export type AgentResponseMode = "always" | "offline-only";
export type AgentTone = "friendly" | "professional" | "humorous" | "concise";
export type AgentReplyMode = "strict" | "creative";

export interface AiAgentDemoSettings {
  agentEnabled: boolean;
  agentResponseMode: AgentResponseMode;
  showMessageAgentLabel: boolean;
  botName: string;
  botIntro: string;
  selectedTone: AgentTone;
  defaultLanguage: string;
  visitorInactiveMinutes: number;
  replyMode: AgentReplyMode;
  offlineMessage: string;
  transferMessage: string;
  unsupportedQuestionMessage: string;
}

const defaultSettings: AiAgentDemoSettings = {
  agentEnabled: true,
  agentResponseMode: "always",
  showMessageAgentLabel: true,
  botName: "智能助手",
  botIntro: "",
  selectedTone: "friendly",
  defaultLanguage: "en",
  visitorInactiveMinutes: 10,
  replyMode: "strict",
  offlineMessage: "很抱歉，当前所有客服均不在线。请留下您的联系方式，我们会尽快回复您。",
  transferMessage: "正在为您转接人工客服，请稍候。",
  unsupportedQuestionMessage: "抱歉，我暂时无法处理图片、文件或这个问题。您可以尝试换一种描述方式，或转接人工客服继续为您服务。"
};

export const languageLabels: Record<string, string> = {
  en: "英语",
  es: "西班牙语",
  fr: "法语",
  de: "德语",
  pt: "葡萄牙语",
  ru: "俄语",
  "zh-CN": "简体中文",
  "zh-TW": "繁体中文",
  ja: "日语",
  ko: "韩语",
  vi: "越南语",
  th: "泰语",
  id: "印尼语",
  ms: "马来西亚语"
};

export const toneLabels: Record<AgentTone, string> = {
  friendly: "友好亲切",
  professional: "专业严谨",
  humorous: "幽默活泼",
  concise: "简洁高效"
};

export const responseModeLabels: Record<AgentResponseMode, string> = {
  always: "始终由 AI Agent 回复",
  "offline-only": "仅客服离线时由 AI 回复"
};

export const replyModeLabels: Record<AgentReplyMode, string> = {
  strict: "严格模式",
  creative: "发散模式"
};

const introTemplates: Record<string, (name: string) => string> = {
  en: (name) => `Hi, I'm ${name}. I'm here to help with your questions.`,
  es: (name) => `Hola, soy ${name}. Estoy aquí para ayudarte con tus preguntas.`,
  fr: (name) => `Bonjour, je suis ${name}. Je suis là pour répondre à vos questions.`,
  de: (name) => `Hallo, ich bin ${name}. Ich helfe Ihnen gern bei Ihren Fragen.`,
  pt: (name) => `Olá, eu sou ${name}. Estou aqui para ajudar com suas dúvidas.`,
  ru: (name) => `Здравствуйте, я ${name}. Я помогу вам с вашими вопросами.`,
  "zh-CN": (name) => `您好，我是${name}，很高兴为您服务。`,
  "zh-TW": (name) => `您好，我是${name}，很高興為您服務。`,
  ja: (name) => `こんにちは、${name}です。ご質問のサポートをいたします。`,
  ko: (name) => `안녕하세요, 저는 ${name}입니다. 문의를 도와드릴게요.`,
  vi: (name) => `Xin chào, tôi là ${name}. Tôi ở đây để hỗ trợ câu hỏi của bạn.`,
  th: (name) => `สวัสดี ฉันคือ ${name} พร้อมช่วยตอบคำถามของคุณ`,
  id: (name) => `Halo, saya ${name}. Saya siap membantu pertanyaan Anda.`,
  ms: (name) => `Hai, saya ${name}. Saya sedia membantu pertanyaan anda.`
};

const aiReplyTemplates: Record<string, string> = {
  en: "Thanks for your message. I can help you with the next step.",
  es: "Gracias por tu mensaje. Puedo ayudarte con el siguiente paso.",
  fr: "Merci pour votre message. Je peux vous aider pour la suite.",
  de: "Danke für Ihre Nachricht. Ich kann Ihnen beim nächsten Schritt helfen.",
  pt: "Obrigado pela sua mensagem. Posso ajudar com o próximo passo.",
  ru: "Спасибо за ваше сообщение. Я могу помочь вам со следующим шагом.",
  "zh-CN": "收到你的消息了，我可以继续帮你处理下一步。",
  "zh-TW": "收到你的訊息了，我可以繼續幫你處理下一步。",
  ja: "メッセージを確認しました。次のステップをご案内できます。",
  ko: "메시지를 확인했어요. 다음 단계를 도와드릴게요.",
  vi: "Tôi đã nhận được tin nhắn của bạn và có thể hỗ trợ bước tiếp theo.",
  th: "ฉันได้รับข้อความของคุณแล้ว และสามารถช่วยในขั้นตอนถัดไปได้",
  id: "Saya sudah menerima pesan anda dan bisa membantu langkah berikutnya.",
  ms: "Saya telah menerima mesej anda dan boleh membantu langkah seterusnya."
};

const humanReplyTemplates: Record<string, string> = {
  en: "A human agent has received your message and will reply shortly.",
  es: "Un agente humano ha recibido tu mensaje y responderá en breve.",
  fr: "Un agent humain a bien reçu votre message et vous répondra bientôt.",
  de: "Ein menschlicher Mitarbeiter hat Ihre Nachricht erhalten und meldet sich bald.",
  pt: "Um atendente humano recebeu sua mensagem e responderá em breve.",
  ru: "Сотрудник получил ваше сообщение и скоро ответит.",
  "zh-CN": "人工客服已收到你的消息，会尽快回复你。",
  "zh-TW": "人工客服已收到你的訊息，會盡快回覆你。",
  ja: "担当者がメッセージを受け取りました。まもなく返信します。",
  ko: "상담원이 메시지를 확인했으며 곧 답변드릴게요.",
  vi: "Nhân viên hỗ trợ đã nhận được tin nhắn của bạn và sẽ phản hồi sớm.",
  th: "เจ้าหน้าที่ได้รับข้อความของคุณแล้ว และจะตอบกลับโดยเร็ว",
  id: "Agen manusia telah menerima pesan anda dan akan segera membalas.",
  ms: "Ejen manusia telah menerima mesej anda dan akan membalas sebentar lagi."
};

const transferConnectedTemplates: Record<string, string> = {
  en: "A human agent has joined the conversation.",
  es: "Un agente humano se ha unido a la conversación.",
  fr: "Un agent humain a rejoint la conversation.",
  de: "Ein menschlicher Mitarbeiter ist dem Gespräch beigetreten.",
  pt: "Um atendente humano entrou na conversa.",
  ru: "К диалогу подключился сотрудник.",
  "zh-CN": "人工客服已加入会话。",
  "zh-TW": "人工客服已加入會話。",
  ja: "担当者が会話に参加しました。",
  ko: "상담원이 대화에 참여했습니다.",
  vi: "Nhân viên hỗ trợ đã tham gia cuộc trò chuyện.",
  th: "เจ้าหน้าที่ได้เข้าร่วมการสนทนาแล้ว",
  id: "Agen manusia telah bergabung ke percakapan.",
  ms: "Ejen manusia telah menyertai perbualan."
};

export const loadAiAgentDemoSettings = (): AiAgentDemoSettings => {
  if (typeof window === "undefined") {
    return { ...defaultSettings };
  }

  try {
    const raw = window.localStorage.getItem(AI_AGENT_SETTINGS_STORAGE_KEY);
    if (!raw) return { ...defaultSettings };

    const parsed = JSON.parse(raw) as Partial<AiAgentDemoSettings> & { visitorInactiveHours?: number };
    const visitorInactiveMinutes = typeof parsed.visitorInactiveMinutes === "number"
      ? parsed.visitorInactiveMinutes
      : typeof parsed.visitorInactiveHours === "number"
        ? parsed.visitorInactiveHours * 60
        : defaultSettings.visitorInactiveMinutes;

    return {
      ...defaultSettings,
      ...parsed,
      visitorInactiveMinutes
    };
  } catch {
    return { ...defaultSettings };
  }
};

export const getLanguageLabel = (languageCode: string) => languageLabels[languageCode] ?? languageCode;
export const getToneLabel = (tone: AgentTone) => toneLabels[tone] ?? toneLabels.friendly;
export const getResponseModeLabel = (mode: AgentResponseMode) => responseModeLabels[mode] ?? responseModeLabels.always;
export const getReplyModeLabel = (mode: AgentReplyMode) => replyModeLabels[mode] ?? replyModeLabels.strict;

export const getAvatarText = (name: string) => {
  const plainName = name.trim();
  if (!plainName) return "A";
  return plainName[0]?.toUpperCase() ?? "A";
};

export const getAvatarGradient = (seed: string) => {
  const palette = [
    ["#2F6BFF", "#69A1FF"],
    ["#00B578", "#00C2B8"],
    ["#7C3AED", "#A78BFA"],
    ["#F97316", "#FB923C"]
  ];

  const score = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const [start, end] = palette[score % palette.length];
  return `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
};

export const getAgentIntro = (settings: AiAgentDemoSettings) => {
  if (settings.botIntro.trim()) return settings.botIntro.trim();
  const template = introTemplates[settings.defaultLanguage] ?? introTemplates.en;
  return template(settings.botName);
};

export const buildAiReply = (settings: AiAgentDemoSettings) => {
  const baseReply = aiReplyTemplates[settings.defaultLanguage] ?? aiReplyTemplates.en;
  return baseReply;
};

export const buildHumanReply = (settings: AiAgentDemoSettings) => {
  return humanReplyTemplates[settings.defaultLanguage] ?? humanReplyTemplates.en;
};

export const buildTransferConnectedReply = (settings: AiAgentDemoSettings) => {
  return transferConnectedTemplates[settings.defaultLanguage] ?? transferConnectedTemplates.en;
};

export const isTransferRequest = (text: string) => /人工|转人工|人工客服|human|agent|person/i.test(text);

export const isUnsupportedRequest = (text: string) => /图片|文件|附件|image|photo|picture|file|attachment|pdf|doc/i.test(text);
