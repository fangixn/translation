import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Target, Award, Settings, Key, Eye, EyeOff, LayoutGrid, Columns } from 'lucide-react';
import { API_CONFIGS, AVAILABLE_MODELS, ANALYSIS_API_PRIORITY, PERFORMANCE_SETTINGS } from '../utils/apiConfig';
import PerformanceTips from './PerformanceTips';
import SaveConfigPanel from './SaveConfigPanel';
import WelcomeMessage from './WelcomeMessage';
import { 
  saveApiKeys, 
  loadApiKeys, 
  saveSelectedModels, 
  loadSelectedModels, 
  saveUserPreferences, 
  loadUserPreferences,
  getSavedApiKeysCount,
  type ApiKeys 
} from '../utils/storage';

export default function Hero() {
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedModels, setSelectedModels] = useState(['openai', 'deepseek', 'gemini']);
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    deepseek: '',
    gemini: '',
    claude: '',
    qwen: ''
  });
  const [showApiKeys, setShowApiKeys] = useState({
    openai: false,
    deepseek: false,
    gemini: false,
    claude: false,
    qwen: false
  });
  const [translations, setTranslations] = useState([]);
  const [showPerformanceTips, setShowPerformanceTips] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savedKeysCount, setSavedKeysCount] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isVerticalLayout, setIsVerticalLayout] = useState(true); // 默认使用上下布局

  // 使用导入的配置

  // 初始化时加载保存的配置
  useEffect(() => {
    const loadSavedConfig = () => {
      try {
        // 加载API密钥
        const savedKeys = loadApiKeys();
        if (savedKeys && Object.keys(savedKeys).length > 0) {
          setApiKeys(prev => ({
            ...prev,
            ...savedKeys
          }));
        }

        // 加载选中的模型
        const savedModels = loadSelectedModels();
        setSelectedModels(savedModels);

        // 加载用户偏好
        const preferences = loadUserPreferences();
        setShowPerformanceTips(preferences.showPerformanceTips);
        setIsVerticalLayout(preferences.isVerticalLayout !== false); // 默认为true

        // 更新保存的密钥数量
        setSavedKeysCount(getSavedApiKeysCount());
      } catch (error) {
        console.error('加载保存的配置失败:', error);
      }
    };

    loadSavedConfig();
  }, []);

  // 监听配置变化，标记为未保存
  useEffect(() => {
    const savedKeys = loadApiKeys();
    const savedModels = loadSelectedModels();
    
    const currentKeysStr = JSON.stringify(apiKeys);
    const savedKeysStr = JSON.stringify({ ...apiKeys, ...savedKeys });
    const modelsChanged = JSON.stringify(selectedModels) !== JSON.stringify(savedModels);
    
    setHasUnsavedChanges(currentKeysStr !== savedKeysStr || modelsChanged);
  }, [apiKeys, selectedModels]);

  // 保存配置函数
  const handleSaveConfig = () => {
    try {
      const success = saveApiKeys(apiKeys) && saveSelectedModels(selectedModels);
      const preferences = loadUserPreferences();
      saveUserPreferences({
        ...preferences,
        showPerformanceTips,
        isVerticalLayout
      });
      
      if (success) {
        setHasUnsavedChanges(false);
        setSavedKeysCount(getSavedApiKeysCount());
      }
    } catch (error) {
      console.error('保存配置失败:', error);
      alert('保存配置失败，请重试');
    }
  };

  // 加载配置函数
  const handleLoadConfig = () => {
    try {
      const savedKeys = loadApiKeys();
      const savedModels = loadSelectedModels();
      const preferences = loadUserPreferences();

      setApiKeys(prev => ({
        ...prev,
        ...savedKeys
      }));
      setSelectedModels(savedModels);
      setShowPerformanceTips(preferences.showPerformanceTips);
      setIsVerticalLayout(preferences.isVerticalLayout !== false);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('加载配置失败:', error);
      alert('加载配置失败，请重试');
    }
  };

  // 清除配置函数
  const handleClearConfig = () => {
    setApiKeys({
      openai: '',
      deepseek: '',
      gemini: '',
      claude: '',
      qwen: ''
    });
    setSelectedModels(['openai', 'deepseek', 'gemini']);
    setShowPerformanceTips(false);
    setIsVerticalLayout(true);
    setHasUnsavedChanges(false);
    setSavedKeysCount(0);
  };

  // AI综合分析功能（增强版）
  const callJudge = async (originalPrompt: string, translationResults: any[]) => {
    console.log('🔍 开始AI综合分析...');
    
    // 优先使用可用的API密钥，不只依赖OpenAI
    let judgeApiKey = '';
    let judgeConfig: any = null;
    let selectedApi = '';
    
    // 按优先级尝试不同的API
    const preferredApis = ANALYSIS_API_PRIORITY;
    for (const apiName of preferredApis) {
      if (apiKeys[apiName as keyof typeof apiKeys]) {
        judgeApiKey = apiKeys[apiName as keyof typeof apiKeys];
        judgeConfig = API_CONFIGS[apiName as keyof typeof API_CONFIGS];
        selectedApi = apiName;
        break;
      }
    }

    if (!judgeApiKey || !judgeConfig) {
      throw new Error('没有可用的API密钥进行综合分析');
    }

    console.log(`📡 使用 ${selectedApi} API 进行分析`);

    let comparisonText = `原始英文文本:\n"${originalPrompt}"\n\n`;
    comparisonText += "以下是多个AI模型的中文翻译结果:\n\n";
    translationResults.forEach((t, index) => {
      comparisonText += `${index + 1}. ${t.name}:\n"${t.translation}"\n\n`;
    });

    const judgePrompt = `作为翻译评审专家，请简要分析以下翻译：

${comparisonText}

请用中文简洁回答：
1. 最佳翻译：哪个最好及原因
2. 主要差异：各翻译的优缺点
3. 推荐建议：给用户的建议

限制在300字内。`;

    try {
      // 添加超时控制和重试机制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), PERFORMANCE_SETTINGS.ANALYSIS_TIMEOUT);

      const url = 'getApiUrl' in judgeConfig && judgeConfig.getApiUrl ? 
        judgeConfig.getApiUrl(judgeApiKey) : judgeConfig.apiUrl;
      
      const headers = judgeConfig.buildHeaders(judgeApiKey);
      const body = judgeConfig.buildBody(judgePrompt);

      console.log(`🚀 发送分析请求到: ${url.substring(0, 50)}...`);
      console.log(`📝 Prompt长度: ${judgePrompt.length} 字符`);

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log(`📬 收到响应: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Analysis API Error:', response.status, errorText);
        throw new Error(`分析请求失败: ${response.status} - ${errorText.substring(0, 200)}`);
      }

      const data = await response.json();
      console.log('📦 API响应数据:', data);
      
      const result = judgeConfig.parseResponse(data);
      console.log(`✅ 解析结果长度: ${result?.length || 0} 字符`);
      
      if (!result || result.trim() === '') {
        throw new Error('API返回的分析结果为空');
      }

      return result;
    } catch (error) {
      console.error('❌ Judge Error Details:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`分析请求超时（${PERFORMANCE_SETTINGS.ANALYSIS_TIMEOUT/1000}秒），请稍后重试`);
        } else if (error.message.includes('fetch')) {
          throw new Error('网络连接错误，请检查网络设置');
        } else if (error.message.includes('401') || error.message.includes('403')) {
          throw new Error(`API密钥无效或权限不足（${selectedApi}）`);
        } else if (error.message.includes('429')) {
          throw new Error(`API请求频率过高（${selectedApi}），请稍后重试`);
        } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
          throw new Error(`${selectedApi} 服务器暂时不可用，请换个API或稍后重试`);
        } else {
          throw new Error(`分析失败（${selectedApi}）: ${error.message}`);
        }
      } else {
        throw new Error('分析过程中发生未知错误');
      }
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    // 检查选中的模型是否都有API密钥
    const missingKeys = selectedModels.filter(model => !apiKeys[model as keyof typeof apiKeys]);
    if (missingKeys.length > 0) {
      const modelNames = missingKeys.map(id => API_CONFIGS[id as keyof typeof API_CONFIGS]?.name || id);
      alert(`请先配置以下模型的API密钥：${modelNames.join(', ')}`);
      setShowSettings(true);
      return;
    }

    setIsTranslating(true);
    setTranslations([]);

    // 创建一个实时更新的翻译结果函数
    const updateTranslation = (result: any) => {
      setTranslations(prev => {
        const newTranslations = [...prev];
        const existingIndex = newTranslations.findIndex(t => t.id === result.id);
        if (existingIndex >= 0) {
          newTranslations[existingIndex] = result;
        } else {
          newTranslations.push(result);
        }
        return newTranslations;
      });
    };

    // 并行执行所有翻译任务，但立即显示每个完成的结果
    const promises = selectedModels.map(async (modelId) => {
      const config = API_CONFIGS[modelId as keyof typeof API_CONFIGS];
      const apiKey = apiKeys[modelId as keyof typeof apiKeys];
      
      try {
                 // 添加超时控制，避免单个API拖慢整体速度
         const controller = new AbortController();
         const apiTimeout = config.timeout || PERFORMANCE_SETTINGS.DEFAULT_TIMEOUT;
         const timeoutId = setTimeout(() => controller.abort(), apiTimeout);

        const url = 'getApiUrl' in config && config.getApiUrl ? config.getApiUrl(apiKey) : config.apiUrl;
        const headers = config.buildHeaders(apiKey);
        const body = config.buildBody(inputText, apiKey);

        const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const translation = config.parseResponse(data);
        if (!translation) throw new Error("API返回内容为空或格式不正确");
        
        const result = { 
          id: modelId, 
          name: config.name, 
          status: 'fulfilled', 
          translation,
          quality: Math.floor(Math.random() * 10) + 90 // 模拟质量评分
        };

        // 立即更新UI显示这个翻译结果
        updateTranslation(result);
        return result;
        
      } catch (error) {
        console.error(`Error with ${config.name}:`, error);
        const errorResult = { 
          id: modelId, 
          name: config.name, 
          status: 'rejected', 
          reason: error instanceof Error ? error.message : '未知错误'
        };
        
        // 也可以选择显示错误信息
        // updateTranslation({ ...errorResult, translation: `翻译失败: ${errorResult.reason}`, isError: true });
        return errorResult;
      }
    });

    try {
      // 等待所有翻译完成
      const results = await Promise.allSettled(promises.map(p => p.catch(e => e)));
      const resolvedResults = await Promise.all(promises);
      
      const successfulTranslations = resolvedResults.filter(result => result.status === 'fulfilled');
      const failedTranslations = resolvedResults.filter(result => result.status === 'rejected');

      // 如果有多个成功的翻译，进行AI分析
      if (successfulTranslations.length > 1) {
        try {
          // 显示分析进度
          updateTranslation({
            id: 'analysis',
            name: 'AI 综合分析',
            translation: '正在进行AI综合分析，请稍候...',
            quality: 100,
            isAnalysis: true,
            isLoading: true
          });

          const analysis = await callJudge(inputText, successfulTranslations);
          if (analysis) {
            updateTranslation({
              id: 'analysis',
              name: 'AI 综合分析',
              translation: analysis,
              quality: 100,
              isAnalysis: true
            });
          } else {
            updateTranslation({
              id: 'analysis',
              name: 'AI 综合分析',
              translation: '分析功能暂时不可用，请稍后再试',
              quality: 100,
              isAnalysis: true,
              isError: true
            });
          }
        } catch (analysisError) {
          console.error('Analysis error:', analysisError);
          updateTranslation({
            id: 'analysis',
            name: 'AI 综合分析',
            translation: `分析失败: ${analysisError instanceof Error ? analysisError.message : '未知错误'}`,
            quality: 100,
            isAnalysis: true,
            isError: true
          });
        }
      }

      // 显示失败的翻译
      if (failedTranslations.length > 0) {
        failedTranslations.forEach(failure => {
          console.error(`${failure.name} 翻译失败:`, failure.reason);
        });
      }

    } catch (error) {
      console.error('Translation error:', error);
      alert('翻译过程中出现错误，请检查网络连接和API密钥配置');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleModelToggle = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleApiKeyChange = (model: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [model]: value
    }));
  };

  const toggleApiKeyVisibility = (model: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [model]: !prev[model]
    }));
  };

  // 为每个翻译结果生成颜色
  const getQualityColor = (quality: number) => {
    if (quality >= 95) return 'bg-green-500';
    if (quality >= 90) return 'bg-blue-500';
    if (quality >= 85) return 'bg-purple-500';
    return 'bg-orange-500';
  };

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            专业级<span className="text-blue-600">AI翻译</span><br />
            多模型对比分析
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            汇聚ChatGPT、DeepSeek、Gemini等顶级AI模型，为您提供最准确、最专业的翻译对比服务。
            一次输入，多重验证，让每一次翻译都精准无误。
          </p>
          
          <div className="flex justify-center space-x-8 mb-12">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700">极速翻译</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700">精准对比</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700">专业分析</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* 欢迎消息 */}
          {showWelcome && (
            <WelcomeMessage
              hasSavedConfig={savedKeysCount > 0}
              savedKeysCount={savedKeysCount}
              onDismiss={() => setShowWelcome(false)}
            />
          )}
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* 设置按钮 */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">AI翻译对比工具</h3>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">模型设置</span>
              </button>
            </div>

            {/* 设置面板 */}
            {showSettings && (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">模型配置</h4>
                
                {/* 模型选择 */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">选择翻译模型</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AVAILABLE_MODELS.map((model) => (
                      <label key={model.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedModels.includes(model.id)}
                          onChange={() => handleModelToggle(model.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{model.name}</div>
                          <div className="text-xs text-gray-500">{model.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 页面布局选择 */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">页面布局</h5>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setIsVerticalLayout(true)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                        isVerticalLayout 
                          ? 'bg-blue-50 border-blue-300 text-blue-700' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                      <span className="text-sm">上下布局</span>
                    </button>
                    <button
                      onClick={() => setIsVerticalLayout(false)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                        !isVerticalLayout 
                          ? 'bg-blue-50 border-blue-300 text-blue-700' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Columns className="h-4 w-4" />
                      <span className="text-sm">左右布局</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    上下布局：适合长文本翻译，充分利用屏幕宽度 | 左右布局：适合短文本对比
                  </p>
                </div>

                {/* API密钥配置 */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">API密钥配置</h5>
                  <div className="space-y-4">
                    {selectedModels.map((model) => (
                      <div key={model} className="flex items-center space-x-3">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">{model} API Key</label>
                          <div className="relative">
                            <input
                              type={showApiKeys[model] ? "text" : "password"}
                              value={apiKeys[model]}
                              onChange={(e) => handleApiKeyChange(model, e.target.value)}
                              placeholder={`请输入${model}的API密钥`}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => toggleApiKeyVisibility(model)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showApiKeys[model] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {apiKeys[model] ? (
                            <div className="w-2 h-2 bg-green-500 rounded-full\" title="已配置"></div>
                          ) : (
                            <div className="w-2 h-2 bg-red-500 rounded-full" title="未配置"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Key className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-800">
                        <p className="font-medium mb-1">API密钥安全说明：</p>
                        <p>• 您的API密钥仅存储在本地浏览器中，不会上传到我们的服务器</p>
                        <p>• 翻译请求直接发送到对应的AI服务提供商</p>
                        <p>• 建议定期更换API密钥以确保账户安全</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 保存配置面板 */}
                <SaveConfigPanel
                  onSave={handleSaveConfig}
                  onLoad={handleLoadConfig}
                  onClear={handleClearConfig}
                  hasUnsavedChanges={hasUnsavedChanges}
                  savedKeysCount={savedKeysCount}
                  apiKeys={apiKeys}
                />
              </div>
            )}

            <div className={`${isVerticalLayout ? 'space-y-8' : 'grid md:grid-cols-2 gap-8'}`}>
              {/* 输入区域 */}
              <div className={isVerticalLayout ? 'w-full' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  输入英文内容
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className={`w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                    isVerticalLayout ? 'h-24' : 'h-32'
                  }`}
                  placeholder="请输入您要翻译的英文内容..."
                />
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    已选择 {selectedModels.length} 个模型进行对比
                  </span>
                  <span className="text-xs text-gray-500">
                    {inputText.length} 字符
                  </span>
                </div>
                <PerformanceTips
                  isTranslating={isTranslating}
                  selectedModels={selectedModels}
                  showTips={showPerformanceTips}
                  onToggleTips={() => setShowPerformanceTips(!showPerformanceTips)}
                />
                <button
                  onClick={handleTranslate}
                  disabled={!inputText.trim() || isTranslating || selectedModels.length === 0}
                  className={`mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 ${
                    isVerticalLayout ? 'w-auto' : 'w-full'
                  }`}
                >
                  {isTranslating ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>开始翻译</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              {/* 结果区域 */}
              <div className={isVerticalLayout ? 'w-full' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI模型翻译结果
                </label>
                <div className={`space-y-4 ${isVerticalLayout ? 'grid md:grid-cols-2 gap-4' : ''}`}>
                  {translations.map((item: any, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${
                      item.isAnalysis ? 
                        (item.isError ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200') : 
                        (item.isError ? 'bg-red-50 border-red-200' : 'border-gray-200')
                    }`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium ${item.isError ? 'text-red-700' : 'text-gray-900'}`}>
                          {item.name}
                          {item.isLoading && (
                            <span className="ml-2 text-sm text-blue-600">
                              <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                            </span>
                          )}
                        </span>
                        {!item.isAnalysis && !item.isError && (
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getQualityColor(item.quality)}`}></div>
                            <span className="text-sm text-gray-600">{item.quality}%</span>
                          </div>
                        )}
                      </div>
                      <p className={`whitespace-pre-wrap ${
                        item.isAnalysis ? 
                          (item.isError ? 'text-sm text-red-700' : 'text-sm text-gray-700') : 
                          (item.isError ? 'text-red-700' : 'text-gray-800')
                      }`}>
                        {item.translation}
                      </p>
                      {item.isError && !item.isAnalysis && (
                        <div className="mt-2 text-xs text-red-600">
                          建议检查API密钥配置或网络连接
                        </div>
                      )}
                    </div>
                  ))}

                  {translations.length === 0 && !isTranslating && inputText.trim() && (
                    <div className="text-center py-8 text-gray-500">
                      <p>点击"开始翻译"按钮获取翻译结果</p>
                    </div>
                  )}

                  {selectedModels.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>请先选择至少一个翻译模型</p>
                    </div>
                  )}

                  {isTranslating && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">正在翻译中，请稍候...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}