import React, { useState } from 'react';
import { Film, Clock, Camera, Edit2, Check, X } from 'lucide-react';

export interface StoryboardScene {
  sceneNumber: number;
  title: string;
  description: string;
  shotType?: string;
  duration?: string;
  imageUrl?: string;
}

export interface StoryboardData {
  title: string;
  totalScenes: number;
  scenes: StoryboardScene[];
}

interface StoryboardCardProps {
  data: StoryboardData;
}

export const StoryboardCard: React.FC<StoryboardCardProps> = ({ data }) => {
  const [editingSceneId, setEditingSceneId] = useState<number | null>(null);
  const [editedScenes, setEditedScenes] = useState<Record<number, StoryboardScene>>(
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

  const handleDescriptionChange = (sceneNumber: number, newDescription: string) => {
    setEditedScenes(prev => ({
      ...prev,
      [sceneNumber]: {
        ...prev[sceneNumber],
        description: newDescription
      }
    }));
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3 md:p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Film className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-semibold text-purple-900">
              {data.title}
            </h3>
            <p className="text-[10px] md:text-xs text-purple-600">
              共 {data.totalScenes} 个镜头
            </p>
          </div>
        </div>
      </div>

      {/* Scenes */}
      <div className="space-y-2">
        {data.scenes.map((scene) => {
          const currentScene = editedScenes[scene.sceneNumber];
          const isEditing = editingSceneId === scene.sceneNumber;

          return (
          <div
            key={scene.sceneNumber}
            className="bg-white border border-purple-100 rounded-lg overflow-hidden hover:border-purple-200 transition-colors"
          >
            <div className="flex gap-2 md:gap-3 p-2 md:p-2.5">
              {/* Scene Number Badge */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm md:text-base font-bold text-purple-700">
                    {scene.sceneNumber}
                  </span>
                </div>
              </div>

              {/* Scene Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-xs md:text-sm font-semibold text-zinc-800">
                    {currentScene.title}
                  </h4>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {currentScene.duration && (
                      <div className="flex items-center gap-1 text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{currentScene.duration}</span>
                      </div>
                    )}

                    {/* Edit/Save/Cancel Buttons */}
                    {!isEditing ? (
                      <button
                        onClick={() => handleEdit(scene.sceneNumber)}
                        className="p-1 hover:bg-purple-100 rounded transition-colors"
                        title="编辑描述"
                      >
                        <Edit2 className="w-3 h-3 text-purple-600" />
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
                    className="w-full text-[11px] md:text-xs text-zinc-600 leading-relaxed mb-1.5 p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                    rows={3}
                    autoFocus
                  />
                ) : (
                  <p className="text-[11px] md:text-xs text-zinc-600 leading-relaxed mb-1.5">
                    {currentScene.description}
                  </p>
                )}

                {/* Shot Type */}
                {currentScene.shotType && (
                  <div className="flex items-center gap-1 text-[10px] text-purple-700">
                    <Camera className="w-3 h-3" />
                    <span className="font-medium">{currentScene.shotType}</span>
                  </div>
                )}
              </div>

              {/* Image Thumbnail or Placeholder */}
              <div className="flex-shrink-0">
                {scene.imageUrl ? (
                  <img
                    src={scene.imageUrl}
                    alt={scene.title}
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border border-purple-100"
                  />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-50 border border-dashed border-purple-300 rounded-lg flex flex-col items-center justify-center">
                    <Camera className="w-5 h-5 md:w-6 md:h-6 text-purple-300 mb-0.5" />
                    <span className="text-[8px] md:text-[9px] text-purple-400 font-medium">待生成</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* Timeline Indicator */}
      <div className="flex items-center gap-1 pt-2 border-t border-purple-200">
        <div className="flex-1 h-1.5 bg-purple-200 rounded-full overflow-hidden">
          <div className="h-full bg-purple-600 rounded-full" style={{ width: '0%' }}></div>
        </div>
        <span className="text-[10px] text-purple-600 font-medium">准备开始</span>
      </div>
    </div>
  );
};
