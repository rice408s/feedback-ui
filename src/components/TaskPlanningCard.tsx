import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

export interface TaskPlanningStep {
  title: string;
  description: string;
  substeps?: string[];
  completed?: boolean;
}

export interface TaskPlanningData {
  title: string;
  steps: TaskPlanningStep[];
}

interface TaskPlanningCardProps {
  data: TaskPlanningData;
}

export const TaskPlanningCard: React.FC<TaskPlanningCardProps> = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-200 rounded-lg p-3 md:p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg">📋</span>
        </div>
        <h3 className="text-sm md:text-base font-semibold text-indigo-900">
          {data.title}
        </h3>
      </div>

      {/* Steps */}
      <div className="space-y-2.5">
        {data.steps.map((step, index) => (
          <div
            key={index}
            className="bg-white border border-indigo-100 rounded-lg p-2.5 md:p-3 hover:border-indigo-200 transition-colors"
          >
            {/* Step Header */}
            <div className="flex items-start gap-2">
              <div className="flex items-center justify-center w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-xs md:text-sm font-medium text-zinc-800">
                  {step.title}
                </h4>
              </div>
              {step.completed !== undefined && (
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-300" />
                  )}
                </div>
              )}
            </div>

            {/* Substeps */}
            {step.substeps && step.substeps.length > 0 && (
              <div className="ml-7 mt-1.5 space-y-0.5">
                {step.substeps.map((substep, subIndex) => (
                  <div
                    key={subIndex}
                    className="flex items-start gap-1.5 text-[10px] md:text-[11px] text-zinc-500"
                  >
                    <span className="text-indigo-300">•</span>
                    <span>{substep}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
