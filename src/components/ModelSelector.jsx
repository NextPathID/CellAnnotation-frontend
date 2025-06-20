// eslint-disable-next-line no-unused-vars
import React from "react";
import { useLLM } from "../context/LLMContext";

function ModelSelector() {
  const { selectedModel, handleModelChange } = useLLM();

  return (
    <div className="mb-2 mx-2 relative">
      <select
        value={selectedModel}
        onChange={(e) => handleModelChange(e.target.value)}
        className="w-full px-4 py-1 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
      >
        <option className="text-sm" value="gemini-1.5-pro">
          Gemini 1.5 Pro
        </option>
        <option className="text-sm" value="gpt-4o-mini">
          GPT-4o-mini 🔒 
        </option>
      </select>
    </div>
  );
}

export default ModelSelector;
