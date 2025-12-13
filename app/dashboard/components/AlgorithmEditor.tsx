'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AlgorithmConfig } from './AlgorithmManager';

interface AlgorithmEditorProps {
  name: string;
  config: AlgorithmConfig;
  onSave: (config: AlgorithmConfig) => void;
  onClose: () => void;
}

export default function AlgorithmEditor({ name, config, onSave, onClose }: AlgorithmEditorProps) {
  const [editedConfig, setEditedConfig] = useState<AlgorithmConfig>(config);
  const [activeTab, setActiveTab] = useState<'general' | 'description' | 'pseudocode'>('general');

  const handleSave = () => {
    onSave(editedConfig);
    // TODO: Persist to database or API
    alert(`Saved ${name} configuration!`);
  };

  const updateField = <K extends keyof AlgorithmConfig>(field: K, value: AlgorithmConfig[K]) => {
    setEditedConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col h-full pointer-events-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{config.title}</h2>
        <Button
          onClick={onClose}
          className="bg-red-300 text-black border-white/20 hover:bg-red-600 hover:text-white"
        >
          ✕
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        {(['general', 'description', 'pseudocode'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2 rounded-t-lg capitalize transition-all
              ${activeTab === tab
                ? 'bg-black text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-white/10 rounded-lg p-4 overflow-y-auto">
        {activeTab === 'general' && (
          <div className="space-y-4">            
            <div>
              <label className="block text-white/70 text-sm mb-1">Title</label>
              <input
                type="text"
                value={editedConfig.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/40"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1">Operations (comma-separated)</label>
              <input
                type="text"
                value={editedConfig.operations.join(', ')}
                onChange={(e) => updateField('operations', e.target.value.split(',').map(s => s.trim()))}
                className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/40"
              />
            </div>
          </div>
        )}

        {activeTab === 'description' && (
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-1">Short Description (HTML)</label>
              <textarea
                value={editedConfig.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/40 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1">Modal Description Segments</label>
              <div className="space-y-2">
                {editedConfig.modalDescription.map((segment, index) => (
                  <div key={index} className="flex gap-2 ">
                    <input
                      type="text"
                      value={segment.text}
                      onChange={(e) => {
                        const newSegments = [...editedConfig.modalDescription];
                        newSegments[index] = { ...segment, text: e.target.value };
                        updateField('modalDescription', newSegments);
                      }}
                      placeholder="Text"
                      className="flex-1 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40 focus:bg-black focus:text-white"
                    />
                    <input
                      type="text"
                      value={segment.link || ''}
                      onChange={(e) => {
                        const newSegments = [...editedConfig.modalDescription];
                        newSegments[index] = { ...segment, link: e.target.value || undefined };
                        updateField('modalDescription', newSegments);
                      }}
                      placeholder="Link (optional)"
                      className="w-64 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40  focus:bg-black focus:text-white"
                    />
                    <Button
                      onClick={() => {
                        const newSegments = editedConfig.modalDescription.filter((_, i) => i !== index);
                        updateField('modalDescription', newSegments);
                      }}
                      size="icon"
                      className="bg-red-300 text-black border-red-400/30 hover:bg-red-500/70 hover:text-white"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => {
                    updateField('modalDescription', [...editedConfig.modalDescription, { text: '' }]);
                  }}
                  size="lg"
                  className="bg-purple-300 text-black border-white/20 hover:bg-purple-800 hover:text-white hover:mt-2"
                >
                  + Add Segment
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pseudocode' && (
          <div className="space-y-4">
            {editedConfig.pseudocodes.map((pseudo, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 space-y-2">
                <input
                  type="text"
                  value={pseudo.title}
                  onChange={(e) => {
                    const newPseudocodes = [...editedConfig.pseudocodes];
                    newPseudocodes[index] = { ...pseudo, title: e.target.value };
                    updateField('pseudocodes', newPseudocodes);
                  }}
                  placeholder="Title"
                  className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/40"
                />
                <textarea
                  value={pseudo.code}
                  onChange={(e) => {
                    const newPseudocodes = [...editedConfig.pseudocodes];
                    newPseudocodes[index] = { ...pseudo, code: e.target.value };
                    updateField('pseudocodes', newPseudocodes);
                  }}
                  placeholder="Code (HTML supported)"
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-white/40"
                />
              </div>
            ))}
            <Button
              onClick={() => {
                updateField('pseudocodes', [...editedConfig.pseudocodes, { title: '', code: '' }]);
              }}
              size="lg"
              className="bg-purple-300 text-black border-white/20 hover:bg-purple-800 hover:text-white hover:mt-2"
            >
              + Add Pseudocode
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          onClick={() => setEditedConfig(config)}
          className="bg-red-300 text-black border-white/20 hover:bg-red-600 hover:text-white hover:mr-4"
        >
          Reset
        </Button>
        <Button
          onClick={handleSave}
          className="bg-blue-300 text-black hover:bg-blue-800 hover:text-white hover:ml-4"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
