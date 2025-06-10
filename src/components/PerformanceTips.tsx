import React from 'react';
import { Clock, Zap, AlertCircle } from 'lucide-react';

interface PerformanceTipsProps {
  isTranslating: boolean;
  selectedModels: string[];
  showTips: boolean;
  onToggleTips: () => void;
}

export default function PerformanceTips({ isTranslating, selectedModels, showTips, onToggleTips }: PerformanceTipsProps) {
  const getTips = () => {
    const tips = [];
    
    if (selectedModels.length > 3) {
      tips.push({
        icon: <Clock className="h-4 w-4 text-orange-500" />,
        text: `当前选择了${selectedModels.length}个模型，建议选择2-3个模型以获得最佳速度`
      });
    }
    
    if (selectedModels.length === 1) {
      tips.push({
        icon: <Zap className="h-4 w-4 text-blue-500" />,
        text: "选择多个模型进行对比可以获得更准确的翻译结果"
      });
    }
    
    tips.push({
      icon: <AlertCircle className="h-4 w-4 text-green-500" />,
      text: "翻译结果会实时显示，无需等待所有模型完成"
    });
    
    return tips;
  };

  if (!showTips) {
    return (
      <button
        onClick={onToggleTips}
        className="text-xs text-gray-500 hover:text-gray-700 underline"
      >
        性能提示
      </button>
    );
  }

  return (
    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <h6 className="text-sm font-medium text-blue-900">性能优化建议</h6>
        <button
          onClick={onToggleTips}
          className="text-blue-600 hover:text-blue-800"
        >
          <span className="text-xs">收起</span>
        </button>
      </div>
      <div className="space-y-2">
        {getTips().map((tip, index) => (
          <div key={index} className="flex items-start space-x-2">
            {tip.icon}
            <span className="text-xs text-blue-800">{tip.text}</span>
          </div>
        ))}
      </div>
      {isTranslating && (
        <div className="mt-2 p-2 bg-blue-100 rounded">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            <span className="text-xs text-blue-800">正在并行处理翻译请求...</span>
          </div>
        </div>
      )}
    </div>
  );
} 