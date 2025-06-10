// 本地存储管理工具
const STORAGE_KEYS = {
  API_KEYS: 'translation_api_keys',
  SELECTED_MODELS: 'translation_selected_models',
  USER_PREFERENCES: 'translation_user_preferences'
};

export interface ApiKeys {
  openai: string;
  deepseek: string;
  gemini: string;
  claude: string;
  qwen: string;
}

export interface UserPreferences {
  showPerformanceTips: boolean;
  autoSaveEnabled: boolean;
  lastSaveTime?: string;
  isVerticalLayout?: boolean;
}

// 保存API密钥到本地存储
export const saveApiKeys = (apiKeys: ApiKeys): boolean => {
  try {
    // 只保存非空的API密钥
    const keysToSave: Partial<ApiKeys> = {};
    Object.entries(apiKeys).forEach(([key, value]) => {
      if (value && value.trim()) {
        keysToSave[key as keyof ApiKeys] = value;
      }
    });

    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keysToSave));
    localStorage.setItem('api_keys_save_time', new Date().toISOString());
    return true;
  } catch (error) {
    console.error('保存API密钥失败:', error);
    return false;
  }
};

// 从本地存储加载API密钥
export const loadApiKeys = (): Partial<ApiKeys> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.API_KEYS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('加载API密钥失败:', error);
  }
  return {};
};

// 保存选中的模型
export const saveSelectedModels = (models: string[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_MODELS, JSON.stringify(models));
    return true;
  } catch (error) {
    console.error('保存选中模型失败:', error);
    return false;
  }
};

// 加载选中的模型
export const loadSelectedModels = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_MODELS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('加载选中模型失败:', error);
  }
  return ['openai', 'deepseek', 'gemini']; // 默认选择
};

// 保存用户偏好设置
export const saveUserPreferences = (preferences: UserPreferences): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('保存用户偏好失败:', error);
    return false;
  }
};

// 加载用户偏好设置
export const loadUserPreferences = (): UserPreferences => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('加载用户偏好失败:', error);
  }
  return {
    showPerformanceTips: false,
    autoSaveEnabled: true,
    isVerticalLayout: true
  };
};

// 清除所有保存的数据
export const clearAllSavedData = (): boolean => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    localStorage.removeItem('api_keys_save_time');
    return true;
  } catch (error) {
    console.error('清除保存数据失败:', error);
    return false;
  }
};

// 获取保存时间
export const getSaveTime = (): string | null => {
  return localStorage.getItem('api_keys_save_time');
};

// 检查是否有保存的数据
export const hasSavedData = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.API_KEYS) !== null;
};

// 获取保存的API密钥数量
export const getSavedApiKeysCount = (): number => {
  try {
    const saved = loadApiKeys();
    return Object.keys(saved).length;
  } catch {
    return 0;
  }
}; 