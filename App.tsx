
import React from 'react';
import QianniuPluginPrototype from './components/QianniuPluginPrototype';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-8 font-sans select-none overflow-x-auto">
      
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">面板连接异常监测原型对比</h1>
        <p className="text-gray-500 mt-2 text-sm">通过下方两个独立的实例展示“验证成功”与“验证失败”的不同反馈路径</p>
      </div>

      <div className="flex gap-12 items-start justify-center">
        
        {/* 1. 成功路径演示 */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm shadow-green-100">
            演示实例 A：验证成功路径
          </div>
          <QianniuPluginPrototype behavior="always-success" />
          <p className="text-[11px] text-gray-400 max-w-[320px] text-center italic">
            点击“验证连接”后模拟连接正常，<br/>直接切换至高保真智能体工作区视图。
          </p>
        </div>

        {/* 2. 失败路径演示 */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm shadow-red-100">
            演示实例 B：验证失败路径
          </div>
          <QianniuPluginPrototype behavior="always-fail" />
          <p className="text-[11px] text-gray-400 max-w-[320px] text-center italic">
            点击“验证连接”后模拟检测仍有异常，<br/>按钮切换至红色失败状态并引导重试。
          </p>
        </div>

      </div>
      
      {/* 背景装饰性文字 */}
      <div className="fixed bottom-4 left-4 text-gray-400 text-[10px] uppercase tracking-widest pointer-events-none opacity-30">
        Qianniu Plugin Prototype v2.6 · Dual Mode Demo
      </div>
    </div>
  );
};

export default App;
