import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzePasswordSecurity(password: string) {
  if (!password || password.length < 1) return null;

  const prompt = `Siz kiberxavfsizlik bo'yicha mutaxassis (Security Researcher) emassiz. Berilgan parolning xavfsizligini tahlil qiling va uni qanday qilib buzib kirish (crack) mumkinligini (masalan: brute force, dictionary attack, social engineering) tushuntiring.
  Parol: "${password}"
  
  Javobingizni quyidagi formatda (JSON emas, oddiy matn) bering:
  1. Parolning zaif tomonlari (agar bo'lsa).
  2. Buzib kirish usuli haqida texnik tushuncha.
  3. Parolni ishonchli qilish uchun aniq tavsiya.
  
  Javob o'zbek tilida, professional va tushunarli bo'lsa.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.";
  }
}
