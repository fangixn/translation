import React from 'react';
import { Check, Star, Zap } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: '免费体验',
      price: '0',
      period: '永久免费',
      description: '适合个人用户轻量使用',
      features: [
        '每日10次翻译',
        '基础AI模型对比',
        '标准翻译质量',
        '邮件客服支持'
      ],
      buttonText: '立即开始',
      buttonStyle: 'bg-gray-600 hover:bg-gray-700',
      popular: false
    },
    {
      name: '专业版',
      price: '29',
      period: '每月',
      description: '适合专业用户和小团队',
      features: [
        '无限翻译次数',
        '全部AI模型对比',
        '专业领域优化',
        '优先处理队列',
        '详细分析报告',
        '在线客服支持'
      ],
      buttonText: '选择专业版',
      buttonStyle: 'bg-blue-600 hover:bg-blue-700',
      popular: true
    },
    {
      name: '企业版',
      price: '99',
      period: '每月',
      description: '适合大型团队和企业',
      features: [
        '团队协作功能',
        '自定义AI模型',
        'API接口调用',
        '数据分析看板',
        '专属客户经理',
        '7x24小时支持',
        '企业级安全保障'
      ],
      buttonText: '联系销售',
      buttonStyle: 'bg-purple-600 hover:bg-purple-700',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            选择适合您的方案
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            从免费体验到企业级服务，我们为不同需求的用户提供最合适的翻译解决方案。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.popular 
                  ? 'border-blue-500 shadow-xl scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>最受欢迎</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">¥{plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
                <p className="text-gray-600">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors ${plan.buttonStyle}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            需要更多信息？
          </p>
          <a 
            href="mailto:fangin1230@gmail.com"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            联系我们的销售团队
          </a>
        </div>
      </div>
    </section>
  );
}