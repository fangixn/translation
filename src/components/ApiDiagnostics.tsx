import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { API_CONFIGS } from '../utils/apiConfig';

interface ApiDiagnosticsProps {
  apiKeys: Record<string, string>;
  onClose: () => void;
}

interface TestResult {
  api: string;
  status: 'testing' | 'success' | 'error' | 'idle';
  message: string;
  responseTime?: number;
}

export default function ApiDiagnostics({ apiKeys, onClose }: ApiDiagnosticsProps) {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [isTestingAll, setIsTestingAll] = useState(false);

  const testSingleApi = async (apiName: string) => {
    const config = API_CONFIGS[apiName as keyof typeof API_CONFIGS];
    const apiKey = apiKeys[apiName];

    if (!apiKey) {
      setTestResults(prev => ({
        ...prev,
        [apiName]: {
          api: apiName,
          status: 'error',
          message: 'API密钥未配置'
        }
      }));
      return;
    }

    setTestResults(prev => ({
      ...prev,
      [apiName]: {
        api: apiName,
        status: 'testing',
        message: '测试中...'
      }
    }));

    const startTime = Date.now();

    try {
      const testPrompt = 'Hello, this is a test.';
      const url = 'getApiUrl' in config && config.getApiUrl ? 
        config.getApiUrl(apiKey) : config.apiUrl;
      
      const headers = config.buildHeaders(apiKey);
      const body = config.buildBody(testPrompt);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒测试超时

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();
      const result = config.parseResponse(data);

      if (!result) {
        throw new Error('API返回格式错误');
      }

      setTestResults(prev => ({
        ...prev,
        [apiName]: {
          api: apiName,
          status: 'success',
          message: '连接正常',
          responseTime
        }
      }));

    } catch (error) {
      const responseTime = Date.now() - startTime;
      let message = '连接失败';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          message = '连接超时（>10秒）';
        } else if (error.message.includes('401') || error.message.includes('403')) {
          message = 'API密钥无效';
        } else if (error.message.includes('429')) {
          message = '请求频率过高';
        } else if (error.message.includes('500') || error.message.includes('502')) {
          message = '服务器错误';
        } else {
          message = error.message.substring(0, 50);
        }
      }

      setTestResults(prev => ({
        ...prev,
        [apiName]: {
          api: apiName,
          status: 'error',
          message,
          responseTime
        }
      }));
    }
  };

  const testAllApis = async () => {
    setIsTestingAll(true);
    const availableApis = Object.keys(apiKeys).filter(key => apiKeys[key]);
    
    for (const apiName of availableApis) {
      await testSingleApi(apiName);
      // 添加延迟避免API限流
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsTestingAll(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'testing':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const configuredApis = Object.keys(apiKeys).filter(key => apiKeys[key]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">API连接诊断</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={testAllApis}
            disabled={isTestingAll || configuredApis.length === 0}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-4 w-4 mr-2" />
            {isTestingAll ? '测试中...' : '测试所有API'}
          </button>
        </div>

        <div className="space-y-3">
          {configuredApis.length === 0 ? (
            <p className="text-gray-500">请先配置至少一个API密钥</p>
          ) : (
            configuredApis.map(apiName => {
              const config = API_CONFIGS[apiName as keyof typeof API_CONFIGS];
              const result = testResults[apiName];
              
              return (
                <div key={apiName} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result?.status || 'idle')}
                      <span className="font-medium">{config?.name || apiName}</span>
                    </div>
                    <button
                      onClick={() => testSingleApi(apiName)}
                      disabled={result?.status === 'testing'}
                      className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
                    >
                      测试
                    </button>
                  </div>
                  
                  {result && (
                    <div className="text-sm">
                      <div className={`${
                        result.status === 'success' ? 'text-green-600' : 
                        result.status === 'error' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {result.message}
                      </div>
                      {result.responseTime && (
                        <div className="text-gray-500 mt-1">
                          响应时间: {result.responseTime}ms
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">🔍 诊断说明:</p>
            <ul className="space-y-1 text-xs">
              <li>• 测试会发送简单的翻译请求来验证API连接</li>
              <li>• 响应时间超过10秒将被标记为超时</li>
              <li>• 如果所有API都失败，请检查网络连接</li>
              <li>• API密钥错误通常返回401或403状态码</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 