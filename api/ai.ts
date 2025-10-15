import { THERAPIST_BUDDY_SYSTEM, THERAPY_FEWSHOTS } from '../prompts/therapistBuddy';

type ChatMsg = { role: 'user' | 'assistant'; content: string };

const AI_BASE  = process.env.EXPO_PUBLIC_AI_BASE  ?? 'https://api.groq.com/openai/v1';
const AI_MODEL = process.env.EXPO_PUBLIC_AI_MODEL ?? 'llama-3.1-8b-instant';
const AI_TOKEN = process.env.EXPO_PUBLIC_AI_TOKEN ?? '';

function trim(t?: string) {
  const out = (t ?? '').trim();
  return out || "I'm here with you. Take your time; we can go slowly.";
}

export async function aiChat(userText: string, history: ChatMsg[]) {
  if (!AI_TOKEN) throw new Error('AI_TOKEN_MISSING');

  const messages = [
    { role: 'system', content: THERAPIST_BUDDY_SYSTEM },
    ...THERAPY_FEWSHOTS,                                 
    ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userText },
  ];

  const res = await fetch(`${AI_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages,
      max_tokens: 320,          
      temperature: 0.6,         
      top_p: 0.9,
      presence_penalty: 0.2,    
      frequency_penalty: 0.3,  
      stop: ["User:"], 
    }),
  });

  const raw = await res.text();
  let data: any; try { data = JSON.parse(raw); } catch { data = raw; }
  if (!res.ok) {
    console.error('[Groq AI]', res.status, res.statusText, data);
    throw new Error(`AI_${res.status}`);
  }

  const content =
    data?.choices?.[0]?.message?.content ??
    data?.choices?.[0]?.delta?.content ?? '';

  return trim(content);
}
