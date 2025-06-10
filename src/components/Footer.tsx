import React from 'react';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Globe className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">译言对比</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              专业的AI翻译对比平台，汇聚全球顶级翻译模型，
              为您提供最准确、最专业的翻译服务。让每一次翻译都精准无误。
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>fangin1230@gmail.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">产品功能</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#features" className="hover:text-white transition-colors">多模型对比</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">智能分析</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">专业领域</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">隐私保护</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">服务支持</h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">使用指南</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">常见问题</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">价格方案</a></li>
              <li><a href="mailto:fangin1230@gmail.com" className="hover:text-white transition-colors">技术支持</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 译言对比. 版权所有 方馨.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              服务条款
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              隐私政策
            </a>
            <a href="mailto:fangin1230@gmail.com" className="text-gray-400 hover:text-white text-sm transition-colors">
              联系我们
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}