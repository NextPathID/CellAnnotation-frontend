// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext, useState } from 'react';

const LLMContext = createContext();

// eslint-disable-next-line react/prop-types
export function LLMProvider({ children }) {
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-pro');
  const [pin, setPin] = useState('');
  const [isPinValid, setIsPinValid] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  const validatePin = (enteredPin) => {
    const correctPin = '1234'; // In a real app, this should be stored securely
    return enteredPin === correctPin;
  };

  const handleModelChange = (model) => {
    if (model === 'gpt-4o-mini' && !isPinValid) {
      setShowPinModal(true);
      return;
    }
    setSelectedModel(model);
  };

  const handlePinSubmit = (enteredPin) => {
    if (validatePin(enteredPin)) {
      setIsPinValid(true);
      setSelectedModel('gpt-4o-mini');
      setShowPinModal(false);
    } else {
      alert('Invalid PIN');
    }
  };

  return (
    <LLMContext.Provider 
      value={{ 
        selectedModel, 
        handleModelChange,
        showPinModal,
        setShowPinModal,
        handlePinSubmit,
        isPinValid
      }}
    >
      {children}
      {showPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Enter PIN for GPT-4O-mini</h3>
            <input
              type="password"
              maxLength="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Enter 4-digit PIN"
              onChange={(e) => setPin(e.target.value)}
              value={pin}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPin('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePinSubmit(pin)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </LLMContext.Provider>
  );
}

export function useLLM() {
  const context = useContext(LLMContext);
  if (!context) {
    throw new Error('useLLM must be used within an LLMProvider');
  }
  return context;
}