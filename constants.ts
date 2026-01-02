import { Airline } from './types';

export const AIRLINE_INFO = {
  [Airline.LATAM]: {
    color: 'bg-red-700',
    logo: 'L',
    description: 'Cuidar das pessoas, garantindo um ambiente justo, empático, transparente e simples. Foco em diversidade e desenvolvimento sustentável.',
    culture: 'Pilares: JUSTOS, EMPÁTICOS, TRANSPARENTES E SIMPLES. Segurança em primeiro lugar e inegociável. Caráter empático e gentil. Valorização de equipes multiculturais e diversas. "Um serviço Sem Fronteiras".'
  },
  [Airline.GOL]: {
    color: 'bg-orange-500',
    logo: 'G',
    description: 'Inovação, simplicidade e foco em servir com inteligência.',
    culture: 'Ágil, simples, humana e inovadora ("Simples, Humana e Inteligente"). Foco em baixo custo com alta qualidade.'
  },
  [Airline.AZUL]: {
    color: 'bg-blue-500',
    logo: 'A',
    description: 'Experiência do cliente ("Opa"), calor humano e excelência no atendimento.',
    culture: 'Foco total no cliente, empatia, segurança e consideração ("Onde os sonhos voam"). Cultura de serviço e proximidade.'
  }
};

export const JOB_DESCRIPTION_SUMMARY = `
O Comissário de Voo é o embaixador da segurança e da experiência do cliente a bordo.
Responsabilidades e Competências Chave:
- **Segurança e Atenção**: Garantir normas rígidas (ANAC) e estar sempre atento aos detalhes operacionais e de segurança.
- **Atendimento e Empatia**: Cuidar das pessoas com caráter gentil, empático e simples.
- **Diversidade e Trabalho em Equipe**: Atuar colaborativamente em equipes multiculturais e dinâmicas (cada voo uma equipe diferente).
- **Resiliência e Adaptabilidade**: Lidar com rotinas irregulares, pressão e gestão de conflitos com equilíbrio emocional.
- **Sustentabilidade**: Atuar com consciência ambiental e social, alinhado às práticas ESG das companhias.
`;