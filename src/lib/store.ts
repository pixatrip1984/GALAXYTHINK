// store.ts

import { writable } from 'svelte/store';

/**
 * Define la estructura de una entidad en el Grafo de Conocimiento.
 * El sistema de clasificación se basa en dos ejes: Abstracción y Dominio.
 */
export interface Entity {
  name: string;
  abstraction: 'Instancia' | 'Específico' | 'Abstracto';
  domains: {
    primary: 'OBJETO' | 'SUJETO' | 'SÍMBOLO';
    secondary: string[];
  };
  description: string;
}

// Usamos un Map para asegurar que cada 'name' sea único.
// La clave del mapa será el nombre de la entidad en minúsculas para evitar duplicados.
export const knowledgeBase = writable<Map<string, Entity>>(new Map());

/**
 * Función auxiliar para añadir nuevas entidades al knowledgeBase.
 * Evita duplicados basados en el nombre de la entidad (insensible a mayúsculas/minúsculas).
 * @param newEntities - Un array de nuevas entidades para añadir.
 */
export function addEntities(newEntities: Entity[]) {
  knowledgeBase.update(currentMap => {
    newEntities.forEach(entity => {
      const key = entity.name.toLowerCase();
      if (!currentMap.has(key)) {
        currentMap.set(key, entity);
      }
    });
    // Devuelve un nuevo Map para asegurar la reactividad de Svelte.
    return new Map(currentMap);
  });
}

// --- Store para la Entidad Seleccionada ---
// Almacena la entidad actualmente seleccionada para la interacción entre componentes.
// Puede ser una Entidad o null si no hay ninguna seleccionada.
export const selectedEntity = writable<Entity | null>(null);