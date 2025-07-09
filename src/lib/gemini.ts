// getBotResponse.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Entity } from "./store";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export interface BotResponse {
  responseText: string;
  entities: Entity[];
}

export async function getBotResponse(
  conversationHistory: string,
  contextKnowledge: string
): Promise<BotResponse> {
  const prompt = `
    You are a master ontologist and Knowledge Graph Architect. Your task is to conduct a natural conversation while performing a deep semantic analysis. You will identify and classify ONLY NEW concepts using the advanced multi-domain system below.

    **CONTEXT: EXISTING KNOWLEDGE**
    The following entities are already classified. Use this information for context but **DO NOT re-classify them or include them in your output's "entities" array.**
    ---
    ${contextKnowledge.trim() ? contextKnowledge : "No existing knowledge provided."}
    ---

    **CONVERSATION HISTORY**
    The user's last message is the final line.
    ---
    ${conversationHistory}
    ---

    **YOUR TASK**
    1.  Provide a context-aware "responseText".
    2.  In the "entities" array, classify **ONLY THE NEW CONCEPTS** from the conversation.
    3.  Apply the SCU system with the following principles and rules with rigorous consistency.

    **The Unified Classification System (SCU)**

    **AXIS 1: LEVEL OF ABSTRACTION**
    - **Abstracto:** Broad fields, categories, principles.
    - **Específico:** Concrete types, sub-categories, well-defined concepts.
    - **Instancia:** Unique, singular examples with a proper name.

    **AXIS 2: DOMAIN (Multi-Domain)**
    - **SUJETO:** The realm of internal, first-person experience (consciousness, feelings).
    - **OBJETO:** The realm of external, observable reality (physical phenomena, historical events).
    - **SÍMBOLO:** The realm of representation (language, logic, art, scientific theories, models).

    **Key Principles and Rules for Domain Assignment**

    - **Principle 1: The Origin Principle (For Primary Domain):** The primary domain is determined by the concept's **conceptual origin and main function**. For abstract concepts, ask: Does it originate as an observable phenomenon (**OBJETO**), a subjective experience (**SUJETO**), or a constructed ideal/model (**SÍMBOLO**)?
      - 'Power' originates from observing objective dynamics, so its primary is **OBJETO**.
      - 'Justice' originates as a constructed ethical ideal, so its primary is **SÍMBOLO**.

    - **Rule 2: Model vs. Phenomenon:** A theory is a SÍMBOLO; what it describes is an OBJETO.
    - **Rule 3: Experience vs. Model of Experience:** A feeling is a SUJETO; a therapeutic model is a SÍMBOLO.
    - **Rule 4: The Impact & Legacy Rule (For O3 Instances):** For an Instancia with primary OBJETO (person, event), you MUST add secondary domains if their main cultural contribution lies there (e.g., 'Carl Sagan' has a SÍMBOLO legacy).

    **JSON Output Structure**
    {
      "name": "Entity Name",
      "abstraction": "'Abstracto', 'Específico', or 'Instancia'",
      "domains": { "primary": "...", "secondary": ["..."] },
      "description": "A concise justification for the classification, referencing a principle/rule if applicable."
    }

    **Master Example:**
    {
      "responseText": "That's a profound thought. Justice is an ideal we strive for, but power dynamics often shape its application in the real world.",
      "entities": [
        {
          "name": "Justice",
          "abstraction": "Abstracto",
          "domains": { "primary": "SÍMBOLO", "secondary": ["SUJETO", "OBJETO"] },
          "description": "Abstract concept. Primary: SÍMBOLO as it originates as a constructed ethical ideal (Principle 1). Secondary: SUJETO (deeply felt value) and OBJETO (implemented in legal systems)."
        },
        {
          "name": "Power",
          "abstraction": "Abstracto",
          "domains": { "primary": "OBJETO", "secondary": ["SÍMBOLO", "SUJETO"] },
          "description": "Abstract concept. Primary: OBJETO as it originates from observing real-world dynamics (Principle 1). Secondary: SÍMBOLO (theorized about) and SUJETO (experienced)."
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonString = text.replace(/```json|```/g, '').trim();
    const parsedResponse: BotResponse = JSON.parse(jsonString);
    return parsedResponse;
  } catch (error) {
    const rawText = (error as any).response?.text() || 'No raw text available';
    console.error("Error getting bot response or parsing JSON:", error, "Raw text received:", rawText);
    return {
      responseText: "I apologize, my thought process was disrupted. Could you please rephrase that?",
      entities: []
    };
  }
}