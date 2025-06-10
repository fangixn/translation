import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: '译言对比支持哪些AI翻译模型？',
      answer: '我们目前支持ChatGPT、DeepSeek、Gemini、Claude、通义千问等主流AI翻译模型，用户可以自由选择需要对比的模型组合。'
    },
    {
      question: '如何添加和管理API密钥？',
      answer: '点击翻译界面的"模型设置"按钮，选择您要使用的AI模型，然后输入对应的API密钥。所有密钥都存储在您的本地浏览器中，不会上传到我们的服务器，确保安全性。'
    },
    {
      question: '我的API密钥和翻译内容是否安全？',
      answer: '绝对安全。您的API密钥仅存储在本地浏览器中，翻译请求直接发送到对应的AI服务提供商，我们不会存储或访问您的任何敏感信息。'
    },
    {
      question: '翻译质量如何保证？',
      answer: '我们采用多模型对比验证的方式，通过专业的评估算法分析各模型的翻译质量，并提供详细的分析报告，帮助您选择最佳翻译结果。'
    },
    {
      question: '是否支持专业领域翻译？',
      answer: '是的，我们集成的AI模型都经过专业训练，支持商务、学术、技术、法律、医学等多个专业领域的翻译，能够准确处理专业术语。'
    },
    {
      question: '如何获得各AI模型的API密钥？',
      answer: '您需要分别到各AI服务提供商的官网注册账户并申请API密钥：OpenAI官网申请ChatGPT密钥，DeepSeek官网申请DeepSeek密钥，Google Cloud申请Gemini密钥等。'
    },
    {
      question: '使用译言对比需要付费吗？',
      answer: '译言对比本身免费使用，但您需要为使用的AI模型API调用付费。费用直接由各AI服务提供商收取，我们不收取任何中间费用。'
    },
    {
      question: '如何获得技术支持？',
      answer: '您可以通过邮箱fangin1230@gmail.com联系我们，我们的技术团队会在24小时内回复您的问题。'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            常见问题
          </h2>
          <p className="text-xl text-gray-600">
            为您解答使用译言对比时可能遇到的问题
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}