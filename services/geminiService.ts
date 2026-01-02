import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Airline, AnalysisResult } from "../types";
import { JOB_DESCRIPTION_SUMMARY, AIRLINE_INFO } from "../constants";

// Helper to initialize the client safely within the function
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeProfile = async (
  profile: UserProfile, 
  targetAirline: Airline
): Promise<AnalysisResult> => {
  const ai = getAiClient();
  
  const prompt = `
    Aja como um especialista sênior em Psicologia Organizacional e Recrutamento para Aviação, certificado em avaliações SHL (OPQ32, MQ e SJT).
    
    Analise o candidato para a vaga de **Comissário de Voo** na **${targetAirline}**.

    === DADOS DA AVALIAÇÃO DO CANDIDATO ===

    1. PERSONALIDADE (OPQ32) [Escala 0-100%]:
    - Pessoas: Influência (${profile.opq32.influence}), Empatia (${profile.opq32.empathy}), Sociabilidade (${profile.opq32.sociability}).
    - Pensamento: Estrutura/Regras (${profile.opq32.structure}), Adaptação (${profile.opq32.adaptability}), Análise (${profile.opq32.analysis}).
    - Emoções: Controle (${profile.opq32.emotionalControl}), Resiliência (${profile.opq32.resilience}), Dinamismo (${profile.opq32.dynamism}).

    2. MOTIVAÇÃO (MQ) [O que impulsiona o candidato, 0-100%]:
    - Serviço/Altruísmo: ${profile.motivation.service}
    - Estabilidade/Segurança: ${profile.motivation.stability}
    - Reconhecimento: ${profile.motivation.recognition}
    - Desafios/Metas: ${profile.motivation.challenge}

    3. JULGAMENTO SITUACIONAL (SJT):
    - Score de Decisões Corretas (Segurança/CRM): ${profile.sjtScore}%

    === INSTRUÇÕES DE SAÍDA ===
    Analise a combinação dos 3 testes e gere um JSON completo com a análise detalhada, pontos fortes, gaps e plano de ação.
    
    Retorne a resposta EXCLUSIVAMENTE em formato JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallMatch: { type: Type.NUMBER },
            cultureMatch: { type: Type.NUMBER },
            technicalMatch: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            detailedAnalysis: { type: Type.STRING },
            airlineSpecifics: { type: Type.STRING },
            motivationAnalysis: { type: Type.STRING },
            sjtAnalysis: { type: Type.STRING },
            idealProfile: {
              type: Type.OBJECT,
              properties: {
                influence: { type: Type.NUMBER },
                empathy: { type: Type.NUMBER },
                sociability: { type: Type.NUMBER },
                structure: { type: Type.NUMBER },
                adaptability: { type: Type.NUMBER },
                analysis: { type: Type.NUMBER },
                emotionalControl: { type: Type.NUMBER },
                resilience: { type: Type.NUMBER },
                dynamism: { type: Type.NUMBER },
              },
              required: ["influence", "empathy", "sociability", "structure", "adaptability", "analysis", "emotionalControl", "resilience", "dynamism"]
            },
            actionPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  priority: { type: Type.STRING }
                },
                required: ["title", "description", "priority"]
              }
            }
          },
          required: ["overallMatch", "cultureMatch", "technicalMatch", "strengths", "gaps", "detailedAnalysis", "airlineSpecifics", "motivationAnalysis", "sjtAnalysis", "idealProfile", "actionPlan"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response text from Gemini");

    return JSON.parse(resultText) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Falha ao analisar o perfil.");
  }
};