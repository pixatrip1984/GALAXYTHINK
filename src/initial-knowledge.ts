// src/initial-knowledge.ts

import type { Entity } from './lib/store';

export const initialKnowledge: Entity[] = [
  // --- FILOSOFÍA Y METAFÍSICA ---
  {
    name: 'Platón',
    abstraction: 'Instancia',
    domains: { primary: 'OBJETO', secondary: ['SÍMBOLO'] },
    description: 'Instancia de una persona histórica. Primario: OBJETO. Secundario: SÍMBOLO por su inmenso legado filosófico (Rule 4).'
  },
  {
    name: 'Mundo de las Ideas',
    abstraction: 'Específico',
    domains: { primary: 'SÍMBOLO', secondary: [] },
    description: 'Concepto específico dentro de la filosofía platónica, un modelo puramente simbólico para explicar la realidad.'
  },
  {
    name: 'Filosofía',
    abstraction: 'Abstracto',
    domains: { primary: 'SÍMBOLO', secondary: ['SUJETO'] },
    description: 'Campo de estudio abstracto. Primario: SÍMBOLO por ser un sistema de razonamiento. Secundario: SUJETO por investigar la experiencia.'
  },
  {
    name: 'Poder',
    abstraction: 'Abstracto',
    domains: { primary: 'OBJETO', secondary: ['SÍMBOLO', 'SUJETO'] },
    description: 'Concepto abstracto. Primario: OBJETO porque su concepto se origina en la observación de dinámicas reales en el mundo (Principle 1).'
  },
  {
    name: 'Justicia Social',
    abstraction: 'Abstracto',
    domains: { primary: 'SÍMBOLO', secondary: ['SUJETO', 'OBJETO'] },
    description: 'Concepto abstracto. Primario: SÍMBOLO porque se origina como un ideal o modelo ético construido (Principle 1).'
  },

  // --- CIENCIA Y TECNOLOGÍA ---
  {
    name: 'Albert Einstein',
    abstraction: 'Instancia',
    domains: { primary: 'OBJETO', secondary: ['SÍMBOLO'] },
    description: 'Instancia de una persona histórica. Primario: OBJETO. Secundario: SÍMBOLO por su revolucionario legado teórico (Rule 4).'
  },
  {
    name: 'Teoría de la Relatividad',
    abstraction: 'Específico',
    domains: { primary: 'SÍMBOLO', secondary: ['OBJETO'] },
    description: 'Modelo científico específico. Primario: SÍMBOLO (Regla 2). Secundario: OBJETO porque describe fenómenos físicos.'
  },
  {
    name: 'Gravedad',
    abstraction: 'Específico',
    domains: { primary: 'OBJETO', secondary: [] },
    description: 'Fenómeno físico fundamental y medible. Es el territorio, no el mapa.'
  },
  {
    name: 'Inteligencia Artificial',
    abstraction: 'Abstracto',
    domains: { primary: 'SÍMBOLO', secondary: ['OBJETO'] },
    description: 'Campo de estudio abstracto. Primario: SÍMBOLO por ser un campo de modelos computacionales. Secundario: OBJETO por sus manifestaciones físicas.'
  },

  // --- ARTE Y CULTURA ---
  {
    name: 'Mona Lisa',
    abstraction: 'Instancia',
    domains: { primary: 'SÍMBOLO', secondary: ['OBJETO', 'SUJETO'] },
    description: 'Instancia única de una obra de arte. Primario: SÍMBOLO (Regla 1). Secundario: OBJETO (artefacto físico) y SUJETO (impacto emocional).'
  },
  {
    name: 'Pálido Punto Azul',
    abstraction: 'Instancia',
    domains: { primary: 'SÍMBOLO', secondary: ['OBJETO', 'SUJETO'] },
    description: 'Instancia de una fotografía y concepto. Primario: SÍMBOLO por su significado. Secundario: OBJETO (imagen real) y SUJETO (emociones que evoca).'
  },
  {
    name: 'El Señor de los Anillos',
    abstraction: 'Instancia',
    domains: { primary: 'SÍMBOLO', secondary: ['OBJETO'] },
    description: 'Instancia de una obra literaria. Primario: SÍMBOLO por su contenido narrativo (Regla 1). Secundario: OBJETO por existir como libros físicos.'
  },

  // --- PSICOLOGÍA Y EXPERIENCIA ---
  {
    name: 'Carl Jung',
    abstraction: 'Instancia',
    domains: { primary: 'OBJETO', secondary: ['SÍMBOLO', 'SUJETO'] },
    description: 'Instancia de una persona histórica. Primario: OBJETO. Secundario: SÍMBOLO (modelo de la psique) y SUJETO (foco de su estudio) (Rule 4).'
  },
  {
    name: 'Inconsciente Colectivo',
    abstraction: 'Específico',
    domains: { primary: 'SÍMBOLO', secondary: ['SUJETO'] },
    description: 'Concepto específico de un modelo psicológico. Primario: SÍMBOLO (Regla 3). Secundario: SUJETO porque explica la experiencia.'
  },
  {
    name: 'Ansiedad',
    abstraction: 'Específico',
    domains: { primary: 'SUJETO', secondary: [] },
    description: 'Una experiencia emocional interna directa y específica.'
  },
  {
    name: 'Humildad',
    abstraction: 'Específico',
    domains: { primary: 'SUJETO', secondary: [] },
    description: 'Un sentimiento específico y una experiencia interna.'
  },
  
  // --- HISTORIA Y SOCIEDAD ---
  {
    name: 'Debate Foucault-Chomsky',
    abstraction: 'Instancia',
    domains: { primary: 'OBJETO', secondary: ['SÍMBOLO'] },
    description: 'Instancia de un evento histórico. Primario: OBJETO por ser un evento fechado. Secundario: SÍMBOLO por el contenido de las ideas debatidas (Rule 4).'
  },
  {
    name: 'Imperio Romano',
    abstraction: 'Instancia',
    domains: { primary: 'OBJETO', secondary: ['SÍMBOLO'] },
    description: 'Instancia de una entidad política histórica. Primario: OBJETO. Secundario: SÍMBOLO por su inmenso legado en leyes y cultura (Rule 4).'
  }
];