import React from 'react';
import { Layers, Zap, Shield, BarChart3, Globe, Star, Settings, Key } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Layers,
      title: '多模型对比',
      description: '集成ChatGPT、DeepSeek、Gemini、Claude等主流AI模型，一次翻译多重验证，确保准确性。',
      color: 'text-blue-600'
    },
    {
      icon: Settings,
      title: '自由选择模型',
      description: '用户可以根据需求自由选择参与对比的AI模型，灵活配置翻译方案。',
      color: 'text-purple-600'
    },
    {
      icon: Key,
      title: 'API密钥管理',
      description: '支持用户添加自己的API密钥，数据安全可控，本地存储不上传服务器。',
      color: 'text-green-600'
    },
    {
      icon: Zap,
      title: '极速翻译',
      description: '先进的并行处理技术，秒级响应速度，大幅提升工作效率。',
      color: 'text-orange-600'
    },
    {
      icon: BarChart3,
      title: '智能分析',
      description: '专业的翻译质量评估系统，为您推荐最佳翻译结果和改进建议。',
      color: 'text-red-600'
    },
    {
      icon: Shield,
      title: '隐私保护',
      description: '企业级安全保障，您的翻译内容和API密钥经过加密处理，绝不泄露。',
      color: 'text-indigo-600'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            为什么选择译言对比
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们不仅仅是一个翻译工具，更是您的专业翻译助手，
            通过AI技术的深度融合和灵活的配置选项，为您提供无与伦比的翻译体验。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}