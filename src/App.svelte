<script lang="ts">
  import { onMount } from 'svelte';
  import Chatbot from './lib/components/Chatbot.svelte';
  import KnowledgeGraph from './lib/components/KnowledgeGraph.svelte';
  import ControlPanel from './lib/components/ControlPanel.svelte';
  import { addEntities } from './lib/store';
  import { initialKnowledge } from './initial-knowledge';

  // Load the initial knowledge base when the app starts
  onMount(() => {
    addEntities(initialKnowledge);
  });
</script>

<main>
  <h1>Svelte Knowledge Chatbot</h1>
  <div class="container">
    <div class="panel-wrapper">
      <ControlPanel />
    </div>
    <div class="chatbot-wrapper">
      <Chatbot />
    </div>
    <div class="graph-wrapper">
      <KnowledgeGraph />
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
  .container {
    display: flex;
    gap: 20px;
    align-items: stretch; /* Estira los items para que tengan la misma altura */
    width: 100%;
    max-width: 1600px; /* Aumentamos el ancho máximo */
    padding: 20px;
    height: 85vh; /* Altura fija para el contenedor principal */
  }
  .panel-wrapper {
    flex: 1;
    min-width: 250px;
    display: flex;
  }
  .chatbot-wrapper {
    flex: 1;
    min-width: 320px;
    display: flex;
  }
  .graph-wrapper {
    flex: 3; /* Le damos más espacio al grafo */
    min-width: 0;
    display: flex;
  }
</style>
