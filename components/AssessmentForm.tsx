import React, { useState } from 'react';
import { UserProfile, Airline } from '../types';
import { CheckCircle2, Circle, Users, BrainCircuit, HeartPulse, ChevronRight, ChevronLeft, Flame, Compass } from 'lucide-react';
import { AIRLINE_INFO } from '../constants';

interface AssessmentFormProps {
  onSubmit: (profile: UserProfile, airline: Airline) => void;
  isLoading: boolean;
}

type TraitKey = keyof UserProfile['opq32'];
type MotivationKey = keyof UserProfile['motivation'];

interface QuestionOPQ {
  id: number;
  text: string;
  trait: TraitKey;
  domain: 'Pessoas' | 'Pensamento' | 'Emoções';
}

interface QuestionMQ {
  id: number;
  text: string;
  factor: MotivationKey;
}

interface QuestionSJT {
  id: number;
  scenario: string;
  options: {
    id: string;
    text: string;
    score: number;
  }[];
}

const OPQ_QUESTIONS: QuestionOPQ[] = [
  { id: 1, text: "Gosto de assumir a liderança e convencer os outros sobre minhas ideias.", trait: 'influence', domain: 'Pessoas' },
  { id: 2, text: "Em situações de grupo, prefiro negociar e influenciar a decisão final.", trait: 'influence', domain: 'Pessoas' },
  { id: 3, text: "Preocupo-me genuinamente com os problemas pessoais dos meus colegas.", trait: 'empathy', domain: 'Pessoas' },
  { id: 4, text: "Priorizo o bem-estar dos outros, mesmo que isso atrase minhas tarefas.", trait: 'empathy', domain: 'Pessoas' },
  { id: 5, text: "Sinto-me energizado ao conhecer pessoas novas e iniciar conversas.", trait: 'sociability', domain: 'Pessoas' },
  { id: 6, text: "Prefiro trabalhar em equipe e interagir constantemente a trabalhar isolado.", trait: 'sociability', domain: 'Pessoas' },
  { id: 7, text: "Prefiro seguir regras e procedimentos estabelecidos a improvisar soluções.", trait: 'structure', domain: 'Pensamento' },
  { id: 8, text: "Sinto-me desconfortável quando não há um plano ou manual claro a seguir.", trait: 'structure', domain: 'Pensamento' },
  { id: 9, text: "Adapto-me rapidamente quando a rotina ou a escala muda de última hora.", trait: 'adaptability', domain: 'Pensamento' },
  { id: 10, text: "Gosto de variedade e de lidar com situações novas todos os dias.", trait: 'adaptability', domain: 'Pensamento' },
  { id: 11, text: "Tomo decisões baseadas estritamente em fatos e lógica, evitando a intuição.", trait: 'analysis', domain: 'Pensamento' },
  { id: 12, text: "Gosto de analisar profundamente os dados antes de chegar a uma conclusão.", trait: 'analysis', domain: 'Pensamento' },
  { id: 13, text: "Consigo manter a calma e a expressão serena mesmo em momentos de crise.", trait: 'emotionalControl', domain: 'Emoções' },
  { id: 14, text: "Raramente deixo transparecer minha irritação ou frustração em público.", trait: 'emotionalControl', domain: 'Emoções' },
  { id: 15, text: "Recupero-me rapidamente após receber uma crítica dura ou passar por um fracasso.", trait: 'resilience', domain: 'Emoções' },
  { id: 16, text: "Consigo trabalhar sob forte pressão sem perder o foco ou a qualidade.", trait: 'resilience', domain: 'Emoções' },
  { id: 17, text: "Sou competitivo e gosto de trabalhar em um ritmo acelerado para atingir metas.", trait: 'dynamism', domain: 'Emoções' },
  { id: 18, text: "Sinto-me motivado por ambientes desafiadores e cheios de atividade.", trait: 'dynamism', domain: 'Emoções' },
];

const MQ_QUESTIONS: QuestionMQ[] = [
  { id: 101, text: "Ter a oportunidade de ajudar pessoas diretamente e fazer a diferença no dia delas.", factor: 'service' },
  { id: 102, text: "Ter estabilidade financeira, benefícios claros e segurança no emprego.", factor: 'stability' },
  { id: 103, text: "Receber elogios públicos e reconhecimento pelo meu bom desempenho.", factor: 'recognition' },
  { id: 104, text: "Superar metas difíceis e desafios que testam minhas habilidades.", factor: 'challenge' },
];

const SJT_SCENARIOS: QuestionSJT[] = [
  {
    id: 201,
    scenario: "Durante o serviço de bordo, passamos por uma turbulência repentina. O sinal de atar cintos acende, mas um passageiro insiste agressivamente que quer terminar sua bebida. O que você faz?",
    options: [
      { id: 'A', text: "Sirvo a bebida rapidamente para evitar conflito e depois peço para ele sentar.", score: 0 },
      { id: 'B', text: "Explico firmemente que, por segurança, o serviço está suspenso e solicito que sente imediatamente.", score: 1 },
      { id: 'C', text: "Ignoro o pedido e continuo recolhendo o carrinho sem falar com ele.", score: 0 },
    ]
  },
  {
    id: 202,
    scenario: "Você percebe que um colega de tripulação está visivelmente cansado e cometeu um pequeno erro no procedimento de segurança (que não coloca o voo em risco imediato, mas é incorreto).",
    options: [
      { id: 'A', text: "Reporto imediatamente ao chefe de cabine para que ele tome providências.", score: 0 },
      { id: 'B', text: "Ignoro, pois todos têm dias ruins e não foi grave.", score: 0 },
      { id: 'C', text: "Converso discretamente com o colega, alerto sobre o erro e ofereço ajuda.", score: 1 },
    ]
  },
  {
    id: 203,
    scenario: "Dois passageiros estão discutindo alto sobre o recline da poltrona. A situação está incomodando os demais.",
    options: [
      { id: 'A', text: "Intervenho com calma, escuto ambos e proponho uma solução intermediária (meio termo).", score: 1 },
      { id: 'B', text: "Aviso que se não pararem, chamarei a polícia federal no pouso.", score: 0 },
      { id: 'C', text: "Peço para o passageiro da frente não reclinar a cadeira para acabar com a briga.", score: 0 },
    ]
  }
];

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1); 
  const totalSteps = 7;
  
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [name, setName] = useState('');
  
  const [opqAnswers, setOpqAnswers] = useState<Record<number, number>>({});
  const [mqAnswers, setMqAnswers] = useState<Record<number, number>>({});
  const [sjtAnswers, setSjtAnswers] = useState<Record<number, string>>({});

  const handleOpqAnswer = (questionId: number, value: number) => {
    setOpqAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleMqAnswer = (questionId: number, value: number) => {
    setMqAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSjtAnswer = (questionId: number, optionId: string) => {
    setSjtAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 7) return selectedAirline !== null;

    if (step >= 2 && step <= 4) {
      const domain = step === 2 ? 'Pessoas' : step === 3 ? 'Pensamento' : 'Emoções';
      const questions = OPQ_QUESTIONS.filter(q => q.domain === domain);
      return questions.every(q => opqAnswers[q.id] !== undefined);
    }

    if (step === 5) return MQ_QUESTIONS.every(q => mqAnswers[q.id] !== undefined);
    if (step === 6) return SJT_SCENARIOS.every(q => sjtAnswers[q.id] !== undefined);

    return false;
  };

  const calculateOpqScore = (trait: TraitKey): number => {
    const traitQuestions = OPQ_QUESTIONS.filter(q => q.trait === trait);
    if (traitQuestions.length === 0) return 0;
    const sum = traitQuestions.reduce((acc, q) => acc + (opqAnswers[q.id] || 3), 0);
    const average = sum / traitQuestions.length;
    return Math.round(((average - 1) / 4) * 100);
  };

  const calculateMqScore = (factor: MotivationKey): number => {
    const q = MQ_QUESTIONS.find(q => q.factor === factor);
    if (!q) return 0;
    const val = mqAnswers[q.id] || 3;
    return Math.round(((val - 1) / 4) * 100);
  };

  const calculateSjtScore = (): number => {
    let score = 0;
    SJT_SCENARIOS.forEach(q => {
      const selectedOptionId = sjtAnswers[q.id];
      const option = q.options.find(o => o.id === selectedOptionId);
      if (option) score += option.score;
    });
    return Math.round((score / SJT_SCENARIOS.length) * 100);
  };

  const handleSubmit = () => {
    if (selectedAirline) {
      const profile: UserProfile = {
        name,
        opq32: {
          influence: calculateOpqScore('influence'),
          empathy: calculateOpqScore('empathy'),
          sociability: calculateOpqScore('sociability'),
          structure: calculateOpqScore('structure'),
          adaptability: calculateOpqScore('adaptability'),
          analysis: calculateOpqScore('analysis'),
          emotionalControl: calculateOpqScore('emotionalControl'),
          resilience: calculateOpqScore('resilience'),
          dynamism: calculateOpqScore('dynamism'),
        },
        motivation: {
          service: calculateMqScore('service'),
          stability: calculateMqScore('stability'),
          recognition: calculateMqScore('recognition'),
          challenge: calculateMqScore('challenge'),
        },
        sjtScore: calculateSjtScore()
      };
      onSubmit(profile, selectedAirline);
    }
  };

  const LikertScale = ({ id, currentVal, onChange, labels }: { id: number, currentVal?: number, onChange: (id: number, v: number) => void, labels?: boolean }) => (
    <div>
      {labels && (
        <div className="flex justify-between text-xs text-slate-400 px-1 mb-1">
          <span>Discordo</span>
          <span>Concordo</span>
        </div>
      )}
      <div className="flex justify-between items-center gap-2 mt-2 mb-6 bg-slate-50 p-3 rounded-lg">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => onChange(id, val)}
            className={`
              w-10 h-10 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center transition-all duration-200
              ${currentVal === val 
                ? 'bg-sky-600 text-white shadow-md scale-110 ring-2 ring-offset-2 ring-sky-300' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-sky-300'}
            `}
          >
            <span className="text-sm font-bold">{val}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
        <div className="flex justify-between items-center mb-2">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Passo {step} de {totalSteps}</span>
           <span className="text-xs font-semibold text-sky-600">
             {step === 1 ? 'Identificação' : 
              step <= 4 ? 'Personalidade (OPQ)' : 
              step === 5 ? 'Motivação (MQ)' : 
              step === 6 ? 'Julgamento (SJT)' : 'Empresa'}
           </span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-sky-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {step === 1 && (
          <div className="animate-fade-in text-center py-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Bem-vindo a Bordo!</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Realizaremos uma avaliação completa para mapear seu perfil comportamental.
            </p>
            
            <div className="max-w-md mx-auto text-left space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Como devemos te chamar?</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome Completo"
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition"
                />
              </div>
            </div>
            
            <div className="mt-10">
              <button 
                onClick={() => setStep(2)}
                disabled={!canProceed()}
                className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-full font-bold transition disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                Iniciar Avaliação <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step >= 2 && step <= 4 && (
          <div className="animate-fade-in">
             <div className="mb-6 flex items-center gap-3">
               {step === 2 && <div className="p-2 bg-sky-100 rounded-lg text-sky-700"><Users size={24} /></div>}
               {step === 3 && <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700"><BrainCircuit size={24} /></div>}
               {step === 4 && <div className="p-2 bg-rose-100 rounded-lg text-rose-700"><HeartPulse size={24} /></div>}
               <h2 className="text-xl font-bold text-slate-800">
                 {step === 2 ? 'Relacionamento' : step === 3 ? 'Estilo de Pensamento' : 'Sentimentos e Emoções'}
               </h2>
             </div>
             <div className="space-y-8">
               {OPQ_QUESTIONS.filter(q => q.domain === (step === 2 ? 'Pessoas' : step === 3 ? 'Pensamento' : 'Emoções')).map((q) => (
                 <div key={q.id} className="border-b border-slate-100 pb-6 last:border-0">
                   <p className="text-slate-800 font-medium text-lg mb-2">{q.text}</p>
                   <LikertScale id={q.id} currentVal={opqAnswers[q.id]} onChange={handleOpqAnswer} labels={true} />
                 </div>
               ))}
             </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fade-in">
            <div className="mb-6 flex items-center gap-3 text-amber-600">
              <div className="p-2 bg-amber-100 rounded-lg"><Flame size={24} /></div>
              <h2 className="text-xl font-bold">Motivação (MQ)</h2>
            </div>
            <div className="space-y-8">
              {MQ_QUESTIONS.map((q) => (
                <div key={q.id} className="border-b border-slate-100 pb-6 last:border-0">
                  <p className="text-slate-800 font-medium text-lg mb-2">{q.text}</p>
                  <LikertScale id={q.id} currentVal={mqAnswers[q.id]} onChange={handleMqAnswer} labels={true} />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="animate-fade-in">
            <div className="mb-6 flex items-center gap-3 text-emerald-600">
              <div className="p-2 bg-emerald-100 rounded-lg"><Compass size={24} /></div>
              <h2 className="text-xl font-bold">Julgamento Situacional (SJT)</h2>
            </div>
            <div className="space-y-8">
              {SJT_SCENARIOS.map((q) => (
                <div key={q.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                   <p className="font-bold text-slate-800 mb-4">{q.scenario}</p>
                   <div className="space-y-3">
                     {q.options.map((opt) => (
                       <div 
                         key={opt.id}
                         onClick={() => handleSjtAnswer(q.id, opt.id)}
                         className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start gap-3
                           ${sjtAnswers[q.id] === opt.id ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-200'}
                         `}
                       >
                         <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0
                            ${sjtAnswers[q.id] === opt.id ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'}
                         `}>
                           {sjtAnswers[q.id] === opt.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                         </div>
                         <span className="text-sm text-slate-700">{opt.text}</span>
                       </div>
                     ))}
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Destino Final</h2>
            <div className="grid grid-cols-1 gap-4 mb-8">
              {(Object.keys(AIRLINE_INFO) as Airline[]).map((airline) => {
                 const info = AIRLINE_INFO[airline];
                 const isSelected = selectedAirline === airline;
                 return (
                  <div 
                    key={airline}
                    onClick={() => setSelectedAirline(airline)}
                    className={`cursor-pointer border-2 rounded-xl p-5 transition-all
                      ${isSelected ? 'border-sky-500 bg-sky-50 shadow-md' : 'border-slate-200 bg-white hover:border-sky-300'}
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold ${info.color}`}>
                        {info.logo}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900">{airline}</h3>
                        <p className="text-sm text-slate-500 mt-1">{info.culture.substring(0, 90)}...</p>
                      </div>
                    </div>
                  </div>
                 );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
           {step > 1 && (
             <button type="button" onClick={() => setStep(step - 1)} className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1">
               <ChevronLeft size={18}/> Voltar
             </button>
           )}
           <div className="ml-auto">
             {step < totalSteps ? (
               <button 
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50 flex items-center gap-2"
                >
                  Próximo <ChevronRight size={18}/>
                </button>
             ) : (
                <button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canProceed() || isLoading}
                  className="bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition flex items-center gap-2"
                >
                  {isLoading ? 'Analisando...' : 'Finalizar Análise'}
                </button>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentForm;