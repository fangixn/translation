import React from 'react';
import { Info, Star } from 'lucide-react';

interface WelcomeMessageProps {
  hasSavedConfig: boolean;
  savedKeysCount: number;
  onDismiss: () => void;
}

export default function WelcomeMessage({ hasSavedConfig, savedKeysCount, onDismiss }: WelcomeMessageProps) {
  if (hasSavedConfig) {
    return (
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Star className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-900">欢迎回来！</h4>
              <p className="text-sm text-green-800 mt-1">
                检测到您已保存了 {savedKeysCount} 个API密钥配置，配置已自动加载。
                您可以直接开始翻译，或在设置中管理您的配置。
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-green-600 hover:text-green-800 text-sm"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">首次使用提示</h4>
            <p className="text-sm text-blue-800 mt-1">
              配置完API密钥后，点击"保存配置"可以将设置保存到本地。
              下次访问时会自动加载，无需重复配置。数据仅保存在您的浏览器中，完全安全。
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  );
} 