<script lang="ts">
import { T, useThrelte } from '@threlte/core';
import { onMount, onDestroy } from 'svelte';
import { OrbitControls, Text } from '@threlte/extras';
import { Color, Vector3, PerspectiveCamera, ConeGeometry, CylinderGeometry } from 'three';
import { knowledgeBase, selectedEntity } from '../store';
import { entityToCartesian } from '../utils';
import { gsap } from 'gsap';
import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/controls/OrbitControls';

// --- Mapas de Estilos ---
const domainColors = {
  SUJETO: '#007bff',
  OBJETO: '#28a745',
  SÍMBOLO: '#e83e8c',
};
const abstractionSizes = {
  Instancia: 0.4,
  Específico: 0.6,
  Abstracto: 0.8,
};

// Función para calcular el vector de dirección desde coordenadas esféricas
function sphericalToDirection(theta: number, phi: number): Vector3 {
  // Convertir grados a radianes
  const thetaRad = (theta * Math.PI) / 180;
  const phiRad = (phi * Math.PI) / 180;
  
  // Calcular componentes del vector unitario
  const x = Math.sin(thetaRad) * Math.cos(phiRad);
  const y = Math.sin(thetaRad) * Math.sin(phiRad);
  const z = Math.cos(thetaRad);
  
  return new Vector3(x, y, z);
}

// --- Enriquecimiento de Nodos ---
$: nodes = [...$knowledgeBase.values()].map((entity) => {
  const isSelected = $selectedEntity?.name === entity.name;
  const position = entityToCartesian(entity);
  
  // Calcular dirección del vector
  let direction = new Vector3(0, 1, 0); // Default: apuntando hacia arriba
  if (entity.theta !== undefined && entity.phi !== undefined) {
    direction = sphericalToDirection(entity.theta, entity.phi);
  } else {
    // Si no hay ángulos definidos, usar la posición normalizada como dirección
    direction = new Vector3(...position).normalize();
  }
  
  return {
    ...entity,
    position,
    direction,
    color: domainColors[entity.domains.primary] || '#6c757d',
    size: (abstractionSizes[entity.abstraction] || 0.5) * (isSelected ? 1.5 : 1),
    brightness: isSelected ? 1.2 : 0.6,
    opacity: isSelected ? 0.3 : 0.2, // Más transparente para ver el vector interior
  };
});

// --- Referencias y Estados ---
let cameraRef: PerspectiveCamera;
let controlsRef: OrbitControlsType;
let isAnimating = false;
let currentTween: gsap.core.Tween | null = null;

// Estados de animación
const initialCameraState = { x: 0, y: 15, z: 25 };
const initialTargetState = { x: 0, y: 0, z: 0 };

// Objetos proxy para la animación
const animatedCamera = { ...initialCameraState };
const animatedTarget = { ...initialTargetState };

// --- Funciones de Animación ---
function animateToSelection(name: string) {
  if (!cameraRef || !controlsRef) {
    console.warn('Camera or controls not ready');
    return;
  }

  const targetNode = nodes.find(n => n.name === name);
  if (!targetNode) return;

  // Cancelar animaciones previas
  if (currentTween) currentTween.kill();

  isAnimating = true;
  
  // Deshabilitar controles durante la animación
  controlsRef.enabled = false;

  const targetPosition = new Vector3(...targetNode.position);
  const cameraOffset = new Vector3(0, 2, 4);
  const cameraTargetPosition = new Vector3().addVectors(targetPosition, cameraOffset);

  // Sincronizar estado actual
  animatedCamera.x = cameraRef.position.x;
  animatedCamera.y = cameraRef.position.y;
  animatedCamera.z = cameraRef.position.z;
  animatedTarget.x = controlsRef.target.x;
  animatedTarget.y = controlsRef.target.y;
  animatedTarget.z = controlsRef.target.z;

  // Timeline de animación
  const tl = gsap.timeline({
    onUpdate: () => {
      // Actualizar posición de cámara en cada frame
      cameraRef.position.set(animatedCamera.x, animatedCamera.y, animatedCamera.z);
      controlsRef.target.set(animatedTarget.x, animatedTarget.y, animatedTarget.z);
      controlsRef.update();
    },
    onComplete: () => {
      isAnimating = false;
      controlsRef.enabled = true;
    }
  });

  // Fase 1: Zoom out
  tl.to(animatedCamera, {
    duration: 0.8,
    x: initialCameraState.x,
    y: initialCameraState.y,
    z: initialCameraState.z,
    ease: 'power2.inOut'
  }, 0)
  .to(animatedTarget, {
    duration: 0.8,
    x: initialTargetState.x,
    y: initialTargetState.y,
    z: initialTargetState.z,
    ease: 'power2.inOut'
  }, 0)
  // Fase 2: Zoom in al nuevo nodo
  .to(animatedCamera, {
    duration: 1.2,
    x: cameraTargetPosition.x,
    y: cameraTargetPosition.y,
    z: cameraTargetPosition.z,
    ease: 'power2.inOut'
  }, 0.9)
  .to(animatedTarget, {
    duration: 1.2,
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    ease: 'power2.inOut'
  }, 0.9);
}

// --- Watchers ---
let lastSelectedName: string | null = null;

$: if ($selectedEntity?.name && $selectedEntity.name !== lastSelectedName) {
  lastSelectedName = $selectedEntity.name;
  // Esperar un tick para asegurar que las referencias estén listas
  setTimeout(() => {
    if (cameraRef && controlsRef) {
      animateToSelection($selectedEntity.name);
    }
  }, 0);
}

// Cleanup
onDestroy(() => {
  if (currentTween) currentTween.kill();
});
</script>

<T.Scene background={new Color('#101015')}>
  <T.PerspectiveCamera
    bind:ref={cameraRef}
    makeDefault
    position={[initialCameraState.x, initialCameraState.y, initialCameraState.z]}
  >
    <OrbitControls 
      bind:ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.05}
      target={[initialTargetState.x, initialTargetState.y, initialTargetState.z]}
    />
  </T.PerspectiveCamera>

  <T.AmbientLight intensity={0.4} />
  <T.DirectionalLight intensity={0.7} position={[5, 10, 8]} />

  {#each nodes as node (node.name)}
    <T.Group position={node.position}>
      <!-- Esfera semi-transparente -->
      <T.Mesh>
        <T.SphereGeometry args={[node.size, 32, 16]} />
        <T.MeshStandardMaterial
          color={node.color}
          transparent={true}
          opacity={node.opacity}
          roughness={0.3}
          metalness={0.1}
        />
      </T.Mesh>
      
      <!-- Vector direccional dentro de la esfera -->
      <T.Group 
        rotation={[
          Math.atan2(Math.sqrt(node.direction.x ** 2 + node.direction.y ** 2), node.direction.z),
          Math.atan2(node.direction.y, node.direction.x),
          0
        ]}
      >
        <!-- Cuerpo del vector (cilindro) -->
        <T.Mesh position={[0, node.size * 0.35, 0]}>
          <T.CylinderGeometry args={[node.size * 0.05, node.size * 0.05, node.size * 0.7, 8]} />
          <T.MeshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.5}
          />
        </T.Mesh>
        
        <!-- Punta del vector (cono) -->
        <T.Mesh position={[0, node.size * 0.75, 0]}>
          <T.ConeGeometry args={[node.size * 0.15, node.size * 0.3, 8]} />
          <T.MeshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.7}
          />
        </T.Mesh>
      </T.Group>
      
      <!-- Anillo decorativo alrededor de la esfera -->
      <T.Mesh rotation={[Math.PI / 2, 0, 0]}>
        <T.TorusGeometry args={[node.size * 1.1, node.size * 0.02, 8, 32]} />
        <T.MeshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={0.3}
          transparent={true}
          opacity={0.6}
        />
      </T.Mesh>
      
      <!-- Luz puntual interior -->
      <T.PointLight 
        color={node.color} 
        intensity={node.brightness * 0.5} 
        distance={node.size * 4} 
      />
      
      <!-- Texto del nombre -->
      <Text
        text={node.name}
        anchorX="center"
        anchorY="bottom"
        position={[0, node.size + 0.5, 0]}
        fontSize={0.3}
        color="white"
        outlineWidth={0.05}
        outlineColor={node.color}
      />
    </T.Group>
  {/each}
</T.Scene>