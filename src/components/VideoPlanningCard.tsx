import React, { useState } from 'react';
import { Video, Edit2, Check, X, Camera, Clock } from 'lucide-react';

export interface VideoScene {
  sceneNumber: number;
  title: string;
  description: string;
  duration?: string;
  imageUrl?: string;
  voiceover?: string; // 旁白/解说词（可选）
}

export interface VideoPlanningData {
  title: string;
  totalScenes: number;
  scenes: VideoScene[];
}

interface VideoPlanningCardProps {
  data: VideoPlanningData;
}

export const VideoPlanningCard: React.FC<VideoPlanningCardProps> = ({ data }) => {
  const [editingSceneId, setEditingSceneId] = useState<number | null>(null);
  const [editedScenes, setEditedScenes] = useState<Record<number, VideoScene>>(
    data.scenes.reduce((acc, scene) => ({ ...acc, [scene.sceneNumber]: scene }), {})
  );

  const handleEdit = (sceneNumber: number) => {
    setEditingSceneId(sceneNumber);
  };

  const handleSave = (sceneNumber: number) => {
    setEditingSceneId(null);
    console.log('已保存场景:', editedScenes[sceneNumber]);
  };

  const handleCancel = (sceneNumber: number) => {
    setEditedScenes(prev => ({
      ...prev,
      [sceneNumber]: data.scenes.find(s => s.sceneNumber === sceneNumber)!
    }));
    setEditingSceneId(null);
  };

  const handleDescriptionChange = (sceneNumber: number, newDescription: string) => {
    setEditedScenes(prev => ({
      ...prev,
      [sceneNumber]: {
        ...prev[sceneNumber],
        description: newDescription
      }
    }));
  };

  const handleVoiceoverChange = (sceneNumber: number, newVoiceover: string) => {
    setEditedScenes(prev => ({
      ...prev,
      [sceneNumber]: {
        ...prev[sceneNumber],
        voiceover: newVoiceover
      }
    }));
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 md:p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Video className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm md:text-base font-semibold text-blue-900">
            {data.title}
          </h3>
          <p className="text-[10px] md:text-xs text-blue-600">
            共 {data.totalScenes} 个场景
          </p>
        </div>
      </div>

      {/* Scenes */}
      <div className="space-y-2.5">
        {data.scenes.map((scene) => {
          const currentScene = editedScenes[scene.sceneNumber];
          const isEditing = editingSceneId === scene.sceneNumber;

          return (
            <div
              key={scene.sceneNumber}
              className="bg-white border border-blue-100 rounded-lg overflow-hidden hover:border-blue-200 transition-colors"
            >
              <div className="flex gap-2 md:gap-3 p-2.5 md:p-3">
                {/* Scene Number Badge */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm md:text-base font-bold text-blue-700">
                      {scene.sceneNumber}
                    </span>
                  </div>
                </div>

                {/* Scene Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-xs md:text-sm font-semibold text-zinc-800">
                      {currentScene.title}
                    </h4>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {currentScene.duration && (
                        <div className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{currentScene.duration}</span>
                        </div>
                      )}

                      {/* Edit/Save/Cancel Buttons */}
                      {!isEditing ? (
                        <button
                          onClick={() => handleEdit(scene.sceneNumber)}
                          className="p-1 hover:bg-blue-100 rounded transition-colors"
                          title="编辑场景"
                        >
                          <Edit2 className="w-3 h-3 text-blue-600" />
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

                  {/* Description - Editable */}
                  {isEditing ? (
                    <textarea
                      value={currentScene.description}
                      onChange={(e) => handleDescriptionChange(scene.sceneNumber, e.target.value)}
                      className="w-full text-[11px] md:text-xs text-zinc-600 leading-relaxed mb-2 p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      rows={3}
                      placeholder="场景描述..."
                      autoFocus
                    />
                  ) : (
                    <p className="text-[11px] md:text-xs text-zinc-600 leading-relaxed mb-2">
                      {currentScene.description}
                    </p>
                  )}

                  {/* Voiceover - Editable (Optional) */}
                  {(currentScene.voiceover || isEditing) && (
                    <div className="mt-2 pl-3 border-l-2 border-blue-200">
                      <p className="text-[10px] md:text-xs font-semibold text-blue-700 mb-1">
                        💬 解说词
                      </p>
                      {isEditing ? (
                        <textarea
                          value={currentScene.voiceover || ''}
                          onChange={(e) => handleVoiceoverChange(scene.sceneNumber, e.target.value)}
                          className="w-full text-[11px] md:text-xs text-zinc-700 leading-relaxed p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                          rows={2}
                          placeholder="旁白/解说词（可选）..."
                        />
                      ) : (
                        <p className="text-[11px] md:text-xs text-zinc-700 leading-relaxed italic">
                          {currentScene.voiceover}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Image Thumbnail or Placeholder */}
                <div className="flex-shrink-0">
                  {currentScene.imageUrl ? (
                    <img
                      src={currentScene.imageUrl}
                      alt={currentScene.title}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border border-blue-100"
                    />
                  ) : (
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 border border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center">
                      <Camera className="w-5 h-5 md:w-6 md:h-6 text-blue-300 mb-0.5" />
                      <span className="text-[8px] md:text-[9px] text-blue-400 font-medium">待生成</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-blue-200">
        <p className="text-[10px] md:text-[11px] text-blue-700 font-medium">
          🎬 视频规划已准备就绪
        </p>
      </div>
    </div>
  );
};
