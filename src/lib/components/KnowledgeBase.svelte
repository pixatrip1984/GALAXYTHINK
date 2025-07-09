<script lang="ts">
  import { knowledgeBase } from '../store';
</script>

<div class="knowledge-base">
  <h2>Knowledge Base</h2>
  {#if $knowledgeBase.size === 0}
    <p>No entities extracted yet. Start chatting!</p>
  {:else}
    <ul>
      {#each [...$knowledgeBase.values()] as entity}
        <li>
          <div class="name">{entity.name}</div>
          <div class="details">
            <span class="badge abstraction-{entity.abstraction.toLowerCase()}">{entity.abstraction}</span>
            <span class="badge domain-{entity.domains.primary.toLowerCase()}">{entity.domains.primary}</span>
            {#each entity.domains.secondary as secondaryDomain}
              <span class="badge domain-secondary">{secondaryDomain}</span>
            {/each}
          </div>
          <p class="description">{entity.description}</p>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .knowledge-base {
    width: 300px;
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #444;
    border-radius: 8px;
    background-color: #2a2a2a;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    background-color: #333;
    color: #eee;
    margin-bottom: 12px;
    padding: 12px;
    border-radius: 6px;
    border-left: 5px solid #007bff;
    transition: background-color 0.2s;
  }
  li:hover {
    background-color: #3a3a3a;
  }
  .name {
    font-weight: bold;
    font-size: 1.1em;
    margin-bottom: 8px;
  }
  .details {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }
  .badge {
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: bold;
    color: white;
  }
  .abstraction-instancia { background-color: #28a745; }
  .abstraction-específico { background-color: #17a2b8; }
  .abstraction-abstracto { background-color: #6f42c1; }
  .domain-objeto { background-color: #dc3545; }
  .domain-sujeto { background-color: #ffc107; color: #333; }
  .domain-símbolo { background-color: #007bff; }
  .domain-secondary { background-color: #6c757d; }

  .description {
    margin-top: 8px;
    margin-bottom: 0;
    font-size: 0.95em;
    color: #ccc;
  }
</style>
