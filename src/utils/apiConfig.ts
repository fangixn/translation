// API配置和优化设置
export const API_CONFIGS = {
  openai: {
    name: 'ChatGPT (GPT-4o-mini)',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    buildHeaders: (apiKey: string) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }),
    buildBody: (prompt: string) => ({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `Translate the following English text to Chinese:\n\n${prompt}` }],
      temperature: 0.3, // 降低随机性，提高翻译准确性
      max_tokens: 2000
    }),
    parseResponse: (data: any) => data.choices[0]?.message?.content,
    timeout: 30000
  },
  gemini: {
    name: 'Google Gemini 1.5 Flash',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    buildHeaders: () => ({ 'Content-Type': 'application/json' }),
    buildBody: (prompt: string) => ({
      contents: [{ parts: [{ text: `Translate the following English text to Chinese:\n\n${prompt}` }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2000
      }
    }),
    getApiUrl: (apiKey: string) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    parseResponse: (data: any) => data.candidates[0]?.content?.parts[0]?.text,
    timeout: 25000
  },
  deepseek: {
    name: 'DeepSeek v2',
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    buildHeaders: (apiKey: string) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }),
    buildBody: (prompt: string) => ({
      model: "deepseek-chat",
      messages: [{ role: "user", content: `Translate the following English text to Chinese:\n\n${prompt}` }],
      temperature: 0.3,
      max_tokens: 2000
    }),
    parseResponse: (data: any) => data.choices[0]?.message?.content,
    timeout: 35000
  },
  claude: {
    name: 'Anthropic Claude 3.5 Sonnet',
    apiUrl: 'https://api.anthropic.com/v1/messages',
    buildHeaders: (apiKey: string) => ({
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    }),
    buildBody: (prompt: string) => ({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 2000,
      temperature: 0.3,
      messages: [{ role: "user", content: `Translate the following English text to Chinese:\n\n${prompt}` }],
    }),
    parseResponse: (data: any) => data.content[0]?.text,
    timeout: 40000
  },
  qwen: {
    name: 'Qwen-Max (通义千问)',
    apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    buildHeaders: (apiKey: string) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }),
    buildBody: (prompt: string) => ({
      model: "qwen-max",
      input: {
        prompt: `Translate the following English text to Chinese:\n\n${prompt}`
      },
      parameters: {
        temperature: 0.3,
        max_tokens: 2000
      }
    }),
    parseResponse: (data: any) => data.output?.text,
    timeout: 30000
  }
};

// 性能优化设置
export const PERFORMANCE_SETTINGS = {
  // 并发翻译的最大数量
  MAX_CONCURRENT_TRANSLATIONS: 5,
  
  // 默认超时时间（毫秒）
  DEFAULT_TIMEOUT: 30000,
  
  // 分析超时时间（毫秒）
  ANALYSIS_TIMEOUT: 45000,
  
  // 重试次数
  MAX_RETRIES: 2,
  
  // 重试延迟（毫秒）
  RETRY_DELAY: 1000
};

// 可用模型列表
export const AVAILABLE_MODELS = [
  { id: 'openai', name: 'ChatGPT (GPT-4o-mini)', description: 'OpenAI GPT-4o-mini' },
  { id: 'gemini', name: 'Google Gemini 1.5 Flash', description: 'Google Gemini 1.5 Flash' },
  { id: 'deepseek', name: 'DeepSeek v2', description: 'DeepSeek v2' },
  { id: 'claude', name: 'Anthropic Claude 3.5 Sonnet', description: 'Anthropic Claude 3.5 Sonnet' },
  { id: 'qwen', name: 'Qwen-Max (通义千问)', description: 'Qwen-Max (通义千问)' }
];

// 用于综合分析的API优先级
export const ANALYSIS_API_PRIORITY = ['openai', 'deepseek', 'claude', 'gemini', 'qwen']; 