import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: '李女士',
      role: '某大学英语系教授',
      content: '作为一名翻译研究者，我对译言对比的多模型对比功能印象深刻。它不仅提供了多种翻译选择，还能分析各自的优劣，这对我的学术研究极有帮助。',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: '王先生',
      role: '某跨国贸易公司经理',
      content: '在商务翻译中，准确性至关重要。译言对比让我能够对比多个AI的翻译结果，选择最适合商务场景的表达方式，大大提高了工作效率。',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: '张先生',
      role: '某软件公司工程师',
      content: '技术文档的翻译往往涉及专业术语，译言对比的专业分析功能能够准确识别最佳翻译，为我们的国际合作项目提供了强有力的支持。',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            用户真实评价
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            来自各行各业专业人士的认可，见证译言对比的专业品质。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-2xl p-8 relative hover:shadow-lg transition-shadow"
            >
              <Quote className="h-8 w-8 text-blue-600 mb-4" />
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}