import React, { useState } from 'react';
import { Save, Download, Trash2, Clock, Shield, AlertTriangle } from 'lucide-react';
import { getSaveTime, getSavedApiKeysCount, hasSavedData, clearAllSavedData } from '../utils/storage';

interface SaveConfigPanelProps {
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  hasUnsavedChanges: boolean;
  savedKeysCount: number;
}

export default function SaveConfigPanel({ 
  onSave, 
  onLoad, 
  onClear, 
  hasUnsavedChanges,
  savedKeysCount 
}: SaveConfigPanelProps) {
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const saveTime = getSaveTime();
  const hasSaved = hasSavedData();

  const handleSave = () => {
    onSave();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleClear = () => {
    if (clearAllSavedData()) {
      onClear();
      setShowConfirmClear(false);
    }
  };

  const formatSaveTime = (timeString: string | null) => {
    if (!timeString) return '';
    try {
      const date = new Date(timeString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-sm font-medium text-gray-900 flex items-center">
          <Shield className="h-4 w-4 mr-2 text-blue-600" />
          配置管理
        </h5>
        {hasSaved && (
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            上次保存: {formatSaveTime(saveTime)}
          </div>
        )}
      </div>

      {/* 状态信息 */}
      <div className="mb-4 p-3 bg-white border border-gray-200 rounded">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">已保存的API密钥:</span>
          <span className="font-medium text-gray-900">{savedKeysCount} 个</span>
        </div>
        {hasUnsavedChanges && (
          <div className="mt-2 flex items-center text-xs text-orange-600">
            <AlertTriangle className="h-3 w-3 mr-1" />
            有未保存的更改
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleSave}
          className={`flex items-center justify-center px-3 py-2 text-sm rounded transition-all ${
            saveSuccess 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          disabled={saveSuccess}
        >
          <Save className="h-3 w-3 mr-1" />
          {saveSuccess ? '已保存' : '保存配置'}
        </button>

        <button
          onClick={onLoad}
          disabled={!hasSaved}
          className="flex items-center justify-center px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Download className="h-3 w-3 mr-1" />
          加载配置
        </button>

        <button
          onClick={() => setShowConfirmClear(true)}
          disabled={!hasSaved}
          className="flex items-center justify-center px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          清除配置
        </button>
      </div>

      {/* 确认清除对话框 */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">确认清除配置</h3>
            <p className="text-gray-600 text-sm mb-4">
              此操作将清除所有保存的API密钥和设置，且无法恢复。您确定要继续吗？
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleClear}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded text-sm hover:bg-red-700 transition-colors"
              >
                确认清除
              </button>
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm hover:bg-gray-400 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 安全提示 */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <div className="flex items-start space-x-2">
          <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">数据安全说明：</p>
            <ul className="space-y-1">
              <li>• API密钥加密保存在您的浏览器本地存储中</li>
              <li>• 数据不会上传到任何服务器</li>
              <li>• 清除浏览器数据会同时清除保存的配置</li>
              <li>• 建议定期备份重要的API密钥</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 