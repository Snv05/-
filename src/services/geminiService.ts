
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const generateActivityContent = async (topic: string, type: 'text' | 'image' | 'table' | 'curve' | 'experiment') => {
  if (type === 'image') {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `رسم تخطيطي علمي لمادة العلوم الطبيعية حول: ${topic}. يجب أن يكون الرسم واضحا، تعليميا، وبخلفية بيضاء.`,
            },
          ],
        },
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return "تعذر توليد الصورة.";
    } catch (error) {
      console.error("Image Generation Error:", error);
      return "حدث خطأ أثناء توليد الصورة.";
    }
  }

  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
    أنت مساعد ذكي ألستاذ علوم طبيعية في التعليم المتوسط بالجزائر.
    قم بتوليد محتوى لنشاط تعليمي حول الموضوع: "${topic}".
    نوع النشاط المطلوب: ${type}.
    يجب أن يكون المحتوى دقيقا علميا، متوافقا مع المنهاج الجزائري، وباللغة العربية الفصحى.
    إذا كان النوع 'experiment'، صف التجربة، األدوات، والمالحظة المتوقعة.
    إذا كان 'table'، قم بإنشاء جدول بيانات.
    إذا كان 'curve'، صف المنحنى البياني وتغيراته.
    إذا كان 'image'، صف الرسم التخطيطي المطلوب بدقة ليتمكن األستاذ من تصوره أو رسمه.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذرا، حدث خطأ في توليد المحتوى. يرجى المحاولة مرة أخرى.";
  }
};

export const searchEducationalResources = async (query: string) => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    ابحث عن موارد تعليمية ومواقع مفيدة لألستاذ حول: "${query}".
    قدم قائمة بروابط أو أسماء مواقع تعليمية جزائرية أو عربية موثوقة.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return "تعذر االتصال بمحرك البحث حاليا.";
  }
};
