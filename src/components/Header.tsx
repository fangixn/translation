import React, { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">译言对比</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">功能特色</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">使用方法</a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">价格方案</a>
            <a href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors">常见问题</a>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
              开始翻译
            </button>
          </nav>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-lg">
            <nav className="flex flex-col space-y-4 p-4">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">功能特色</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">使用方法</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">价格方案</a>
              <a href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors">常见问题</a>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                开始翻译
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}