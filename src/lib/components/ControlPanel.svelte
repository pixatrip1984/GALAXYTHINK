<script lang="ts">
  import { knowledgeBase, selectedEntity } from '../store';

  // Mapas de estilos (mismo que en Scene3D)
  const domainColors = {
    SUJETO: '#007bff',
    OBJETO: '#28a745',
    SÍMBOLO: '#e83e8c',
  };

  let searchTerm = '';

  // Declaración reactiva para filtrar las entidades
  $: filteredEntities = [...$knowledgeBase.values()].filter(entity =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function selectEntity(entity: any) {
    selectedEntity.set(entity);
  }

  // Función para deseleccionar
  function clearSelection() {
    selectedEntity.set(null);
  }
</script>

<div class="control-panel">
  <!-- Sección Superior (60%) -->
  <div class="upper-section">
    <h3>Knowledge Inspector</h3>
    <div class="search-bar">
      <input 
        type="text" 
        bind:value={searchTerm} 
        placeholder="Search entities..." 
      />
    </div>
    <ul class="entity-list">
      {#each filteredEntities as entity (entity.name)}
        <li class="entity-item" class:selected={$selectedEntity?.name === entity.name}>
          <button on:click={() => selectEntity(entity)}>
            {entity.name}
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Panel de Detalles (40%) - Solo visible cuando hay selección -->
  {#if $selectedEntity}
    <div class="details-panel">
      <div class="details-header">
        <h4>Panel de Detalles</h4>
        <button class="close-btn" on:click={clearSelection}>×</button>
      </div>
      
      <div class="details-content">
        <h3 class="entity-name">{$selectedEntity.name}</h3>
        
        <div class="detail-section">
          <span class="detail-label">Dominio:</span>
          <span class="detail-value domain-{($selectedEntity.domains?.primary || 'default').toLowerCase()}">
            {$selectedEntity.domains?.primary || 'Sin dominio'}
          </span>
        </div>
        
        {#if $selectedEntity.abstraction}
          <div class="detail-section">
            <span class="detail-label">Abstracción:</span>
            <span class="detail-value">{$selectedEntity.abstraction}</span>
          </div>
        {/if}
        
        {#if $selectedEntity.domains?.secondary && $selectedEntity.domains.secondary.length > 0}
          <div class="detail-section">
            <span class="detail-label">Dominios Secundarios:</span>
            <div class="secondary-domains">
              {#each $selectedEntity.domains.secondary as domain}
                <span class="domain-tag domain-{domain.toLowerCase()}">{domain}</span>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Información visual sobre el vector -->
        <div class="detail-section">
          <span class="detail-label">Orientación:</span>
          <div class="orientation-info">
            <div class="vector-indicator" style="background-color: {($selectedEntity.domains?.primary ? domainColors[$selectedEntity.domains.primary] : '#6c757d')}">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"/>
                <line x1="20" y1="20" x2="20" y2="5" stroke="currentColor" stroke-width="2"/>
                <polygon points="20,2 16,8 24,8" fill="currentColor"/>
              </svg>
            </div>
            <span class="orientation-text">Vector direccional visible en la esfera</span>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .control-panel {
    display: flex;
    flex-direction: column;
    background-color: #2a2a2a;
    border: 1px solid #444;
    border-radius: 8px;
    color: #eee;
    height: 100%;
    overflow: hidden;
  }

  /* Sección Superior - 60% */
  .upper-section {
    flex: 0 0 30%;
    display: flex;
    flex-direction: column;
    padding: 15px;
    border-bottom: 1px solid #444;
    overflow: hidden;
  }

  h3 {
    margin: 0 0 15px 0;
    text-align: center;
    font-size: 1.2rem;
  }

  .search-bar input {
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border-radius: 4px;
    border: 1px solid #555;
    background-color: #333;
    color: #eee;
    font-size: 0.9rem;
  }

  .search-bar input:focus {
    outline: none;
    border-color: #007bff;
  }

  .entity-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    flex-grow: 1;
  }

  .entity-item {
    padding: 0;
    border-bottom: 1px solid #444;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .entity-item.selected {
    background-color: #3a3a3a;
  }

  .entity-item button {
    width: 100%;
    padding: 10px;
    background: none;
    border: none;
    color: #eee;
    text-align: left;
    cursor: pointer;
    font: inherit;
    transition: background-color 0.2s;
  }

  .entity-item button:hover {
    background-color: #3a3a3a;
  }

  .entity-item:last-child {
    border-bottom: none;
  }

  /* Panel de Detalles - 40% */
  .details-panel {
    flex: 0 0 70%;
    display: flex;
    flex-direction: column;
    padding: 15px;
    background-color: #242424;
    overflow-y: auto;
  }

  .details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #444;
  }

  .details-header h4 {
    margin: 0;
    font-size: 1rem;
    color: #999;
  }

  .close-btn {
    background: none;
    border: none;
    color: #999;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }

  .close-btn:hover {
    color: #fff;
  }

  .details-content {
    flex-grow: 1;
  }

  .entity-name {
    margin: 0 0 20px 0;
    font-size: 1.4rem;
    color: #fff;
    text-align: left;
  }

  .detail-section {
    margin-bottom: 15px;
  }

  .detail-label {
    display: block;
    font-size: 0.85rem;
    color: #999;
    margin-bottom: 5px;
  }

  .detail-value {
    display: inline-block;
    font-size: 1rem;
    color: #eee;
    padding: 4px 8px;
    background-color: #333;
    border-radius: 4px;
  }

  /* Colores para dominios */
  .domain-sujeto {
    background-color: #007bff !important;
    color: white !important;
  }

  .domain-objeto {
    background-color: #28a745 !important;
    color: white !important;
  }

  .domain-símbolo {
    background-color: #e83e8c !important;
    color: white !important;
  }

  .domain-default {
    background-color: #6c757d !important;
    color: white !important;
  }

  .secondary-domains {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 5px;
  }

  .domain-tag {
    font-size: 0.85rem;
    padding: 2px 8px;
    border-radius: 12px;
    color: white;
  }

  /* Indicador de orientación */
  .orientation-info {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 5px;
  }

  .vector-indicator {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
  }

  .vector-indicator svg {
    color: white;
  }

  .orientation-text {
    font-size: 0.85rem;
    color: #999;
    font-style: italic;
  }

  /* Scrollbar personalizado */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1e1e1e;
  }

  ::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #666;
  }
</style>