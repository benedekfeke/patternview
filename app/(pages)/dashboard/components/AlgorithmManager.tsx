'use client';

import { useState } from "react";
import AlgorithmEditor from "./AlgorithmEditor";

export interface AlgorithmConfig {
  title: string,
  description: string,
  modalDescription: Array<{text: string; link?: string}>;
  operations: string[];
  pseudocodes: Array<{title:string; code:string}>;
  explanationRules?: Record<string, string>;
}

interface AlgorithmManagerProps {
  algorithms: Record<string, AlgorithmConfig>;
  onSave: (name: string, config: AlgorithmConfig) => void;
}

export default function AlgorithmManager({algorithms, onSave}: AlgorithmManagerProps){
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);

  const algorithmList = Object.keys(algorithms);

  return (
    <div className="flex flex-1 h-full">
      {/* Algorithm list */}
      <div className="w-48 bg-white/10 backdrop-blur-md rounded-l-lg border-r border-white/20 p-4">
        <h3 className="text-white font-bold mb-4 text-lg">Algorithms</h3>
        <ul className="space-y-2">
          {algorithmList.map((name) => (
            <li key={name}>
              <button onClick={() => setSelectedAlgorithm(name)}
                className={`w-full text-left px-3 py-2 rounded-md transition-all
                  ${selectedAlgorithm === name ? 'bg-black text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              >
                {algorithms[name].title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Editor Panel */}
      <div className="flex-1 bg-white/5 backdrop-blur-lg rounded-r-lg p-6 overflow-y-auto">
          {selectedAlgorithm ? (
            <AlgorithmEditor name={selectedAlgorithm} config={algorithms[selectedAlgorithm]}
            onSave={(config) => onSave(selectedAlgorithm, config)} onClose={() => setSelectedAlgorithm(null)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white/50">
              <p>Select an algorithm to edit</p>
            </div>
          )}
      </div>    
    </div>
  )

}
