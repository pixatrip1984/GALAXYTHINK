<script lang="ts">
  import { Canvas } from '@threlte/core';
  import GraphScene from './GraphScene.svelte';
</script>

<div class="graph-container">
  <Canvas>
    <GraphScene />
  </Canvas>
</div>

<style>
  .graph-container {
    width: 100%;
    height: 100%; /* Ocupa toda la altura del wrapper */
    border-radius: 8px;
    overflow: hidden;
  }
</style>
