import { createNewChatWithBot, sendMessage as sendFsMessage } from "../services/chatService";
import { aiChat } from "../api/ai";

export async function startSession(uid: string, msg: string) {
  const chatId = await createNewChatWithBot(uid, "therapist-bot");
  await sendFsMessage(chatId, uid, msg);
  const reply = await aiChat(msg, [{ role: "user", content: msg }]);
  await sendFsMessage(chatId, "therapist-bot", reply);
  return chatId;
}