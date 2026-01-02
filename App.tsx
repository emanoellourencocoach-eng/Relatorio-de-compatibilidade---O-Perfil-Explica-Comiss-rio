import React, { useState } from 'react';
import Header from './components/Header';
import AssessmentForm from './components/AssessmentForm';
import ResultsView from './components/ResultsView';
import { UserProfile, Airline, AnalysisResult } from './types';
import { analyzeProfile } from './services/geminiService';
import { AlertTriangle } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'form' | 'results'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [targetAirline, setTargetAirline] = useState<Airline | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAssessmentSubmit = async (profile: UserProfile, airline: Airline) => {
    setIsLoading(true);
    setError(null);
    try {
      // Set state immediately to show context while loading if needed, though mostly for Results view
      setUserProfile(profile);
      setTargetAirline(airline);

      const result = await analyzeProfile(profile, airline);
      setAnalysisResult(result);
      setCurrentView('results');
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao processar a análise.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentView('form');
    setAnalysisResult(null);
    setUserProfile(null);
    setTargetAirline(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* API Key Warning for Demo */}
        {!process.env.API_KEY && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded shadow-sm">
             <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">
                  <strong>Configuração necessária:</strong> A chave de API do Gemini (process.env.API_KEY) não foi detectada. 
                  A análise via IA não funcionará sem ela.
                </p>
             </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 relative" role="alert">
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        )}

        {currentView === 'form' && (
          <div className="flex flex-col items-center">
            <div className="text-center mb-10 max-w-2xl">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Pronto para decolar?
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Mapeie seu perfil comportamental e descubra sua compatibilidade com as maiores companhias aéreas do Brasil. 
                Utilizamos IA para analisar profundamente seu perfil através de <strong>metodologias avançadas</strong>.
              </p>
            </div>
            
            <div className="w-full">
              <AssessmentForm onSubmit={handleAssessmentSubmit} isLoading={isLoading} />
            </div>
          </div>
        )}

        {currentView === 'results' && userProfile && targetAirline && analysisResult && (
          <ResultsView 
            profile={userProfile} 
            airline={targetAirline} 
            result={analysisResult} 
            onReset={handleReset}
          />
        )}

      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} SkyProfile. Ferramenta de demonstração para fins educacionais.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;