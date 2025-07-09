<script lang="ts">
  import { getBotResponse } from '../gemini';
  import { knowledgeBase, addEntities } from '../store';

  // Definimos un tipo para nuestros mensajes para mayor claridad y robustez.
  type Message = { text: string; sender: 'user' | 'bot' };

  let messages: Message[] = [];
  let userInput = '';
  let isLoading = false;

  async function sendMessage() {
    if (!userInput.trim()) return;

    const userMessage: Message = { text: userInput, sender: 'user' };
    messages = [...messages, userMessage];
    
    const historyForAPI = messages.map(m => `${m.sender}: ${m.text}`).join('\\n');
    
    userInput = '';
    isLoading = true;

    // Format the existing knowledge to pass as context
    let contextKnowledge = '';
    $knowledgeBase.forEach(entity => {
      contextKnowledge += `- ${entity.name} (${entity.abstraction}, ${entity.domains.primary})\\n`;
    });

    const botResponse = await getBotResponse(historyForAPI, contextKnowledge);
    
    // Add the bot's text response to the chat
    const botMessage: Message = { text: botResponse.responseText, sender: 'bot' };
    messages = [...messages, botMessage];
    
    // Si la respuesta del bot incluye nuevas entidades, añádelas a la base de conocimiento
    if (botResponse.entities && botResponse.entities.length > 0) {
      addEntities(botResponse.entities);
    }

    isLoading = false;
  }
</script>
<!-- TU HTML Y ESTILOS (sin cambios) -->
<div class="chatbot-container">
  <div class="messages">
    {#each messages as message}
      <div class="message {message.sender}">
        {message.text}
      </div>
    {/each}
    {#if isLoading}
      <div class="message bot">Escribiendo...</div>
    {/if}
  </div>
  <div class="input-area">
    <input type="text" bind:value={userInput} on:keydown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." disabled={isLoading} />
    <button on:click={sendMessage} disabled={isLoading}>Send</button>
  </div>
</div>

<style>
  /* Tus estilos permanecen exactamente iguales */
  .chatbot-container {
    display: flex;
    flex-direction: column;
    height: 400px;
    width: 300px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
  }
  .messages {
    flex-grow: 1;
    padding: 10px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .message {
    padding: 8px 12px;
    border-radius: 18px;
    max-width: 70%;
  }
  .user {
    background-color: #007bff;
    color: white;
    align-self: flex-end;
  }
  .bot {
    background-color: #f1f1f1;
    color: black;
    align-self: flex-start;
  }
  .input-area {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ccc;
  }
  input {
    flex-grow: 1;
    border: 1px solid #ccc;
    border-radius: 18px;
    padding: 8px 12px;
    margin-right: 10px;
  }
  button {
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 18px;
    padding: 8px 12px;
    cursor: pointer;
  }
</style>