import React from 'react';
import { UserProfile, Airline, AnalysisResult } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Brain, Shield, UserCheck, TrendingUp, AlertCircle, ClipboardList, Target, ArrowRight, FileText, CheckCircle, Scale, Flame, Compass } from 'lucide-react';
import { AIRLINE_INFO } from '../constants';
import { Logo } from './Logo';

interface ResultsViewProps {
  profile: UserProfile;
  airline: Airline;
  result: AnalysisResult;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ profile, airline, result, onReset }) => {
  const airlineInfo = AIRLINE_INFO[airline];

  // Data for Radar Chart (Candidate Only) and Comparison Chart (Candidate vs Ideal)
  const chartData = [
    { subject: 'Influência', A: profile.opq32.influence, B: result.idealProfile.influence, fullMark: 100, domain: 'Pessoas' },
    { subject: 'Empatia', A: profile.opq32.empathy, B: result.idealProfile.empathy, fullMark: 100, domain: 'Pessoas' },
    { subject: 'Sociabilidade', A: profile.opq32.sociability, B: result.idealProfile.sociability, fullMark: 100, domain: 'Pessoas' },
    { subject: 'Estrutura', A: profile.opq32.structure, B: result.idealProfile.structure, fullMark: 100, domain: 'Pensamento' },
    { subject: 'Adaptação', A: profile.opq32.adaptability, B: result.idealProfile.adaptability, fullMark: 100, domain: 'Pensamento' },
    { subject: 'Análise', A: profile.opq32.analysis, B: result.idealProfile.analysis, fullMark: 100, domain: 'Pensamento' },
    { subject: 'Controle', A: profile.opq32.emotionalControl, B: result.idealProfile.emotionalControl, fullMark: 100, domain: 'Emoções' },
    { subject: 'Resiliência', A: profile.opq32.resilience, B: result.idealProfile.resilience, fullMark: 100, domain: 'Emoções' },
    { subject: 'Dinamismo', A: profile.opq32.dynamism, B: result.idealProfile.dynamism, fullMark: 100, domain: 'Emoções' },
  ];

  const motivationData = [
    { name: 'Serviço', val: profile.motivation.service },
    { name: 'Estabilidade', val: profile.motivation.stability },
    { name: 'Reconhecimento', val: profile.motivation.recognition },
    { name: 'Desafio', val: profile.motivation.challenge },
  ];

  const ScoreCard = ({ title, score, icon: Icon }: { title: string, score: number, icon: any }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center break-inside-avoid">
      <div className="bg-slate-50 p-3 rounded-full mb-3 text-sky-600 print:hidden">
        <Icon size={24} />
      </div>
      <h3 className="text-slate-500 font-medium text-sm mb-1">{title}</h3>
      <div className="relative flex items-center justify-center">
        <svg className="w-24 h-24 transform -rotate-90 print:hidden">
          <circle cx="48" cy="48" r="36" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
          <circle 
            cx="48" cy="48" r="36" 
            stroke={score > 75 ? '#22c55e' : score > 50 ? '#eab308' : '#ef4444'} 
            strokeWidth="8" 
            fill="transparent" 
            strokeDasharray={226} 
            strokeDashoffset={226 - (226 * score) / 100} 
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-2xl font-bold text-slate-800 print:hidden">{score}%</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
         <div className="flex items-center gap-2 text-slate-600">
            <CheckCircle className="text-green-500" size={20} />
            <span className="font-medium">Análise Concluída com Sucesso</span>
         </div>
         <div className="flex gap-3">
            <button onClick={onReset} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-medium transition">
              Nova Análise
            </button>
         </div>
      </div>

      {/* Report Container */}
      <div id="report-content" className="bg-white p-8 sm:p-12 rounded-3xl shadow-lg border border-slate-100 text-slate-900">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b-2 border-slate-100 pb-6 mb-8 break-inside-avoid">
           <div className="flex flex-col gap-4">
              <Logo className="mb-2" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 uppercase tracking-tight">RELATÓRIO DE COMPATIBILIDADE</h1>
                <p className="text-slate-500 text-sm">Descubra seu alinhamento com as principais companhias aéreas.</p>
              </div>
           </div>
           <div className="text-right flex flex-col items-end gap-2">
              <div className="text-sm text-slate-400 mb-1">Data: {new Date().toLocaleDateString()}</div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-bold ${airlineInfo.color}`}>
                 {airlineInfo.logo} {airline}
              </div>
           </div>
        </div>

        {/* Candidate Info */}
        <div className="mb-8 break-inside-avoid">
           <h2 className="text-lg font-semibold text-slate-800 mb-2">Candidato(a): <span className="text-sky-700 text-2xl block sm:inline sm:ml-2">{profile.name}</span></h2>
        </div>

        {/* Scores Summary */}
        <div className="grid grid-cols-3 gap-4 mb-10 break-inside-avoid">
          <ScoreCard title="Match Geral" score={result.overallMatch} icon={Brain} />
          <ScoreCard title="Fit Cultural" score={result.cultureMatch} icon={UserCheck} />
          <ScoreCard title="Técnico" score={result.technicalMatch} icon={Shield} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 break-inside-avoid">
              <h3 className="font-bold text-slate-800 mb-4 text-center">Radar de Personalidade (OPQ)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    <Radar name="Candidato" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
             <div className="bg-green-50 p-5 rounded-xl border border-green-100 break-inside-avoid">
                <h4 className="font-bold text-green-800 mb-3 text-sm uppercase tracking-wide">Pontos Fortes</h4>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 break-inside-avoid">
                <h4 className="font-bold text-amber-800 mb-3 text-sm uppercase tracking-wide">Pontos de Atenção</h4>
                <ul className="space-y-2">
                  {result.gaps.map((g, i) => (
                    <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                       <span className="mt-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="border-b border-slate-100 pb-6 break-inside-avoid">
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <FileText size={20} className="text-sky-600"/> Análise OPQ (Personalidade)
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed text-justify whitespace-pre-line">
                {result.detailedAnalysis}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 break-inside-avoid">
                  <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <Flame size={18} /> Motivação (MQ)
                  </h3>
                  <div className="h-24 w-full mb-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={motivationData}>
                        <XAxis dataKey="name" hide />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="val" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify">
                    {result.motivationAnalysis}
                  </p>
               </div>
               <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 break-inside-avoid">
                  <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                    <Compass size={18} /> Julgamento (SJT)
                  </h3>
                  <div className="mb-3 flex items-center gap-3">
                     <span className="text-3xl font-bold text-emerald-700">{profile.sjtScore}%</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify">
                    {result.sjtAnalysis}
                  </p>
               </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8 border border-slate-200 rounded-2xl p-8 bg-white break-inside-avoid">
           <div className="flex items-center gap-2 mb-6">
              <Scale className="text-sky-600" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">Comparativo: Você vs. Perfil Ideal ({airline})</h3>
                <p className="text-xs text-slate-500">Benchmarking baseado na cultura organizacional da companhia.</p>
              </div>
           </div>
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 20 }} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#475569' }} interval={0} dy={10}/>
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} cursor={{fill: '#f1f5f9'}}/>
                    <Legend />
                    <Bar name="Candidato" dataKey="A" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={15} />
                    <Bar name="Ideal Estimado" dataKey="B" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={15} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-sky-50 rounded-2xl overflow-hidden border border-sky-100 break-inside-avoid">
           <div className="bg-sky-100 px-8 py-4 border-b border-sky-200">
              <h3 className="text-lg font-bold text-sky-900 flex items-center gap-2">
                <ClipboardList className="text-sky-700" />
                Plano de Voo: Ações Recomendadas
              </h3>
           </div>
           <div className="p-8 space-y-4">
              {result.actionPlan?.map((action, index) => (
                <div key={index} className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-sky-100 break-inside-avoid">
                  <div className="mt-1 p-2 bg-sky-50 rounded-lg text-sky-600">
                    <Target size={16} />
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-800 text-sm">{action.title}</h4>
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded-full font-bold bg-sky-100 text-sky-700">
                          {action.priority}
                        </span>
                     </div>
                     <p className="text-xs text-slate-600 leading-relaxed">{action.description}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-200 text-center text-xs text-slate-400 break-inside-avoid">
           <p className="font-medium mb-1">Relatório gerado automaticamente por SkyProfile AI.</p>
           <p className="text-[10px] text-slate-300 max-w-2xl mx-auto leading-tight mt-4 italic">
             Este documento serve apenas para fins de autoconhecimento e desenvolvimento profissional.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;