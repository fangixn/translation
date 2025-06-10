import React from 'react';
import { Settings, FileText, Cpu, BarChart3, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Settings,
      title: '配置模型',
      description: '选择您需要的AI翻译模型，添加相应的API密钥，所有配置本地存储安全可控。',
      color: 'bg-blue-500'
    },
    {
      icon: FileText,
      title: '输入文本',
      description: '在输入框中粘贴或输入您需要翻译的英文内容，支持长文本和专业术语。',
      color: 'bg-purple-500'
    },
    {
      icon: Cpu,
      title: 'AI处理',
      description: '系统同时调用您选择的多个AI模型进行翻译，并行处理确保速度和准确性。',
      color: 'bg-green-500'
    },
    {
      icon: BarChart3,
      title: '结果对比',
      description: '展示各AI模型的翻译结果，提供质量评分和详细的对比分析。',
      color: 'bg-orange-500'
    },
    {
      icon: CheckCircle,
      title: '选择最佳',
      description: '根据专业分析推荐，选择最适合您需求的翻译结果，一键复制使用。',
      color: 'bg-red-500'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            五步完成专业翻译
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            简单的操作步骤，强大的AI技术支持，灵活的模型配置，让专业翻译变得前所未有的简单。
          </p>
        </div>

        <div className="relative">
          {/* 连接线 */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 via-orange-500 to-red-500"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 relative z-10`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}