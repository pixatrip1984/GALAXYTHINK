// src/lib/utils.ts
import type { Entity } from './store';

// Un simple hash para obtener un valor consistente de una cadena de texto.
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convertir a 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Convierte una entidad ontológica a coordenadas cartesianas (x, y, z)
 * para su visualización en el grafo 3D.
 * @param entity La entidad a convertir.
 * @returns Un array de números [x, y, z].
 */
export function entityToCartesian(entity: Entity): [number, number, number] {
  // 1. Calcular las coordenadas esféricas (rho, theta, phi) desde la ontología

  // RHO (ρ): Distancia desde el origen, basada en la Abstracción.
  let rho: number;
  switch (entity.abstraction) {
    case 'Instancia':
      rho = 8;
      break;
    case 'Específico':
      rho = 12;
      break;
    case 'Abstracto':
      rho = 16;
      break;
    default:
      rho = 10;
  }

  // THETA (θ): Ángulo en el plano XY (longitud), basado en el Dominio Primario.
  let theta: number;
  const domainSegment = (2 * Math.PI) / 3;
  const hashJitter = (simpleHash(entity.name) % 100 / 100 - 0.5) * domainSegment * 0.8; // Añade variabilidad dentro del segmento

  switch (entity.domains.primary) {
    case 'OBJETO':
      theta = domainSegment * 0 + hashJitter;
      break;
    case 'SUJETO':
      theta = domainSegment * 1 + hashJitter;
      break;
    case 'SÍMBOLO':
      theta = domainSegment * 2 + hashJitter;
      break;
    default:
      theta = 0;
  }

  // PHI (φ): Ángulo desde el eje Z (latitud).
  // Usamos un hash para distribuirlo verticalmente y evitar que todo quede en un plano.
  // Lo mantenemos entre ~30 y ~150 grados para evitar los polos.
  const phi = Math.PI / 6 + (simpleHash(entity.description) % 100 / 100) * (2 * Math.PI / 3);

  // 2. Convertir de coordenadas esféricas a cartesianas
  const x = rho * Math.sin(phi) * Math.cos(theta);
  const y = rho * Math.sin(phi) * Math.sin(theta);
  const z = rho * Math.cos(phi);

  return [x, y, z];
}
