export enum Airline {
  LATAM = 'Latam Airlines',
  GOL = 'Gol Linhas Aéreas',
  AZUL = 'Azul Linhas Aéreas'
}

// Expanded OPQ32 structure focusing on 3 domains relevant to aviation
export interface UserProfile {
  name: string;
  opq32: {
    // Domain: Relationships with People
    influence: number;    // Persuasive, Controlling
    empathy: number;      // Caring, Democratic
    sociability: number;  // Outgoing, Socially Confident

    // Domain: Thinking Style
    structure: number;    // Rule Following, Data Rational (Compliance)
    adaptability: number; // Variety Seeking, Adaptable
    analysis: number;     // Evaluative, Behavioral

    // Domain: Feelings and Emotions
    emotionalControl: number; // Emotionally Controlled
    resilience: number;       // Relaxed, Tough Minded
    dynamism: number;         // Vigorous, Competitive, Achieving
  };
  // Motivation Questionnaire (MQ)
  motivation: {
    service: number;     // Vontade de ajudar/servir
    stability: number;   // Segurança financeira/rotina
    recognition: number; // Status/Elogios
    challenge: number;   // Metas difíceis
  };
  // Situational Judgement Test (SJT) - Score 0-100 based on correct answers
  sjtScore: number;
}

export interface ActionItem {
  title: string;
  description: string;
  priority: 'Alta' | 'Média';
}

export interface AnalysisResult {
  overallMatch: number;
  cultureMatch: number;
  technicalMatch: number;
  strengths: string[];
  gaps: string[];
  detailedAnalysis: string;
  airlineSpecifics: string;
  // Perfil ideal gerado pela IA para comparação
  idealProfile: UserProfile['opq32'];
  actionPlan: ActionItem[];
  // Novos campos de análise
  motivationAnalysis: string;
  sjtAnalysis: string;
}