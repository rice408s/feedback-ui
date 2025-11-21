import React, { useState } from 'react';
import { FileText, Edit2, Check, X } from 'lucide-react';

export interface ScriptScene {
  sceneNumber: number;
  heading: string;
  sceneType?: '内景' | '外景';
  location?: string;
  timeOfDay?: '白天' | '夜晚' | '黄昏' | '清晨' | '傍晚';
  action?: string;
  dialogue?: Array<{
    character: string;
    line: string;
  }>;
}

export interface ScriptData {
  title: string;
  totalScenes: number;
  scenes: ScriptScene[];
}

interface ScriptCardProps {
  data: ScriptData;
}

export const ScriptCard: React.FC<ScriptCardProps> = ({ data }) => {
  const [editingSceneId, setEditingSceneId] = useState<number | null>(null);
  const [editedScenes, setEditedScenes] = useState<Record<number, ScriptScene>>(
    data.scenes.reduce((acc, scene) => ({ ...acc, [scene.sceneNumber]: scene }), {})
  );

  const handleEdit = (sceneNumber: number) => {
    setEditingSceneId(sceneNumber);
  };

  const handleSave = (sceneNumber: number) => {
    setEditingSceneId(null);
    console.log('Saved scene:', editedScenes[sceneNumber]);
  };

  const handleCancel = (sceneNumber: number) => {
    setEditedScenes(prev => ({
      ...prev,
      [sceneNumber]: data.scenes.find(s => s.sceneNumber === sceneNumber)!
    }));
    setEditingSceneId(null);
  };

  const handleActionChange = (sceneNumber: number, newAction: string) => {
    setEditedScenes(prev => ({
      ...prev,
      [sceneNumber]: {
        ...prev[sceneNumber],
        action: newAction
      }
    }));
  };

  const handleSceneTypeChange = (sceneNumber: number, newSceneType: '内景' | '外景') => {
    setEditedScenes(prev => ({
      ...prev,
      [sceneNumber]: {
        ...prev[sceneNumber],
        sceneType: newSceneType
      }
    }));
  };

  const handleLocationChange = (sceneNumber: number, newLocation: string) => {
    setEditedScenes(prev => ({
      ...prev,
      [sceneNumber]: {
        ...prev[sceneNumber],
        location: newLocation
      }
    }));
  };

  const handleTimeOfDayChange = (sceneNumber: number, newTimeOfDay: '白天' | '夜晚' | '黄昏' | '清晨' | '傍晚') => {
    setEditedScenes(prev => ({
      ...prev,
      [sceneNumber]: {
        ...prev[sceneNumber],
        timeOfDay: newTimeOfDay
      }
    }));
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 md:p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm md:text-base font-semibold text-amber-900">
            {data.title}
          </h3>
          <p className="text-[10px] md:text-xs text-amber-600">
            共 {data.totalScenes} 场
          </p>
        </div>
      </div>

      {/* Scenes */}
      <div className="space-y-3">
        {data.scenes.map((scene) => {
          const currentScene = editedScenes[scene.sceneNumber];
          const isEditing = editingSceneId === scene.sceneNumber;

          return (
            <div
              key={scene.sceneNumber}
              className="bg-white border border-amber-100 rounded-lg p-2.5 md:p-3 hover:border-amber-200 transition-colors"
            >
              {/* Scene Heading */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-start gap-2 flex-1">
                  <div className="flex items-center justify-center w-6 h-6 bg-amber-100 text-amber-700 rounded flex-shrink-0">
                    <span className="text-xs font-bold">{scene.sceneNumber}</span>
                  </div>

                  {!isEditing ? (
                    <h4 className="text-xs md:text-sm font-bold text-zinc-800 uppercase tracking-wide">
                      {currentScene.heading}
                    </h4>
                  ) : (
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                      {/* Scene Type Dropdown */}
                      <select
                        value={currentScene.sceneType || '内景'}
                        onChange={(e) => handleSceneTypeChange(scene.sceneNumber, e.target.value as '内景' | '外景')}
                        className="px-2 py-1 text-xs border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                      >
                        <option value="内景">内景</option>
                        <option value="外景">外景</option>
                      </select>

                      {/* Location Input */}
                      <input
                        type="text"
                        value={currentScene.location || ''}
                        onChange={(e) => handleLocationChange(scene.sceneNumber, e.target.value)}
                        placeholder="地点"
                        className="px-2 py-1 text-xs border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />

                      {/* Time of Day Dropdown */}
                      <select
                        value={currentScene.timeOfDay || '白天'}
                        onChange={(e) => handleTimeOfDayChange(scene.sceneNumber, e.target.value as '白天' | '夜晚' | '黄昏' | '清晨' | '傍晚')}
                        className="px-2 py-1 text-xs border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                      >
                        <option value="白天">白天</option>
                        <option value="夜晚">夜晚</option>
                        <option value="黄昏">黄昏</option>
                        <option value="清晨">清晨</option>
                        <option value="傍晚">傍晚</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Edit/Save/Cancel Buttons */}
                <div className="flex-shrink-0">
                  {!isEditing ? (
                    <button
                      onClick={() => handleEdit(scene.sceneNumber)}
                      className="p-1 hover:bg-amber-100 rounded transition-colors"
                      title="编辑场景"
                    >
                      <Edit2 className="w-3 h-3 text-amber-600" />
                    </button>
                  ) : (
                    <div className="flex gap-0.5">
                      <button
                        onClick={() => handleSave(scene.sceneNumber)}
                        className="p-1 hover:bg-green-100 rounded transition-colors"
                        title="保存"
                      >
                        <Check className="w-3 h-3 text-green-600" />
                      </button>
                      <button
                        onClick={() => handleCancel(scene.sceneNumber)}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                        title="取消"
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action - Editable */}
              {currentScene.action && (
                <div className="mb-2">
                  {isEditing ? (
                    <textarea
                      value={currentScene.action}
                      onChange={(e) => handleActionChange(scene.sceneNumber, e.target.value)}
                      className="w-full text-[11px] md:text-xs text-zinc-700 leading-relaxed p-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                      rows={3}
                      autoFocus
                    />
                  ) : (
                    <p className="text-[11px] md:text-xs text-zinc-700 leading-relaxed">
                      {currentScene.action}
                    </p>
                  )}
                </div>
              )}

              {/* Dialogue */}
              {currentScene.dialogue && currentScene.dialogue.length > 0 && (
                <div className="space-y-2 pl-3 border-l-2 border-amber-200">
                  {currentScene.dialogue.map((line, idx) => (
                    <div key={idx}>
                      <p className="text-[10px] md:text-xs font-semibold text-amber-700 uppercase mb-0.5">
                        {line.character}
                      </p>
                      <p className="text-[11px] md:text-xs text-zinc-700 leading-relaxed">
                        {line.line}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-amber-200">
        <p className="text-[10px] md:text-[11px] text-amber-700 font-medium">
          📝 完整叙事脚本已就绪
        </p>
      </div>
    </div>
  );
};
