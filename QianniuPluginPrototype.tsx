
import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  RefreshCw, 
  Info, 
  Zap, 
  CreditCard, 
  ExternalLink,
  MousePointer2,
  HelpCircle,
  Send,
  Flag
} from 'lucide-react';

interface Props {
  behavior: 'always-success' | 'always-fail';
}

const QianniuPluginPrototype: React.FC<Props> = ({ behavior }) => {
  const [activeTab, setActiveTab] = useState('智能体');
  const [isVerified, setIsVerified] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const tabs = ['智能体', '智能工单', '画像', '素材'];

  const handleVerify = async () => {
    setVerifyStatus('loading');
    // 模拟验证过程
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (behavior === 'always-success') {
      setVerifyStatus('idle');
      setIsVerified(true);
    } else {
      setVerifyStatus('error');
    }
  };

  const goToServiceMarket = () => {
    window.open('https://fuwu.taobao.com/', '_blank');
  };

  // 1. 诊断排查视图 (未验证时)
  const renderDiagnosticView = () => (
    <div className="flex-1 overflow-y-auto p-4 bg-white space-y-4">
      {/* 异常提示横幅 */}
      <div className="bg-[#e6f7ff] border border-[#91d5ff] rounded px-3.5 py-2.5 flex items-start gap-2">
        <div className="bg-[#1890ff] rounded-full p-0.5 mt-0.5 shrink-0">
          <Info size={12} className="text-white" />
        </div>
        <span className="text-[13px] text-gray-800 font-medium leading-tight">
          注意：千牛面板连接异常，请按照以下步骤进行排查
        </span>
      </div>

      <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4 pb-4">
        {/* 步骤 1 */}
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="shrink-0 w-5 h-5 bg-blue-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold">1</span>
            <h5 className="font-bold text-[13px] text-blue-900">确保面板开关已开启</h5>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-28 bg-white rounded-lg border border-blue-100 relative overflow-hidden flex items-center justify-center p-2">
                <div className="w-24 h-16 bg-gray-50 rounded shadow-sm flex overflow-hidden border border-gray-100">
                   <div className="w-6 bg-gray-100 border-r border-gray-200 p-1 flex flex-col gap-1">
                     <div className="w-3 h-3 rounded-full" style={{ animation: 'icon-active 3s infinite' }}></div>
                     <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                   </div>
                   <div className="flex-1 p-1 bg-white">
                     <div className="h-full bg-blue-50 rounded border border-blue-100" style={{ animation: 'panel-expand 3s infinite' }}></div>
                   </div>
                   <div className="absolute top-0 left-0" style={{ animation: 'cursor-move 3s infinite' }}>
                     <MousePointer2 size={12} className="text-gray-800 fill-white" />
                   </div>
                </div>
                <p className="absolute bottom-1 text-[9px] text-blue-500 font-bold bg-white/90 px-1 py-0.5 rounded shadow-sm">点击设置确保面板开启</p>
            </div>
            <div className="h-28 bg-white rounded-lg border border-blue-100 relative overflow-hidden flex items-center justify-center p-2">
                <div className="w-24 h-16 bg-gray-50 rounded shadow-sm p-1 overflow-hidden flex flex-col">
                   <div className="flex flex-col gap-1" style={{ animation: 'list-scroll 4s infinite' }}>
                     {[1,2,3].map(i => (
                       <div key={i} className="flex items-center gap-1">
                         <div className="w-2 h-2 bg-gray-200 rounded"></div>
                         <div className="w-12 h-1 bg-gray-100 rounded"></div>
                       </div>
                     ))}
                     <div className="flex items-center gap-1 p-1 border border-blue-200 bg-blue-50 rounded" style={{ animation: 'item-highlight 4s infinite' }}>
                        <Zap size={8} className="text-blue-500" />
                        <div className="w-12 h-1 bg-blue-200 rounded"></div>
                     </div>
                   </div>
                </div>
                <p className="absolute bottom-1 text-[9px] text-blue-500 font-bold bg-white/90 px-1 py-0.5 rounded shadow-sm">在应用列表滚动查找</p>
            </div>
          </div>
        </div>

        {/* 步骤 2 */}
        <div className="bg-red-50/40 border border-red-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="shrink-0 w-5 h-5 bg-red-100 text-red-600 text-[10px] flex items-center justify-center rounded-full font-bold border border-red-200">2</span>
            <h5 className="font-bold text-[13px] text-gray-800">核对服务有效期</h5>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-2.5">
              <div className="text-orange-500 mt-0.5">
                <CreditCard size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-gray-700">服务状态</p>
                <p className="text-[11px] text-gray-500 mt-0.5">确认 【探域客服机器人】应用未过期</p>
                <button 
                  onClick={goToServiceMarket}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-medium mt-1.5 flex items-center gap-0.5 transition-colors"
                >
                  去服务市场确认 <ExternalLink size={10} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 底部验证按钮 */}
        <button 
          onClick={handleVerify}
          disabled={verifyStatus === 'loading'}
          className={`w-full py-3 text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
            verifyStatus === 'error' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#0052d9] hover:bg-[#0042ad]'
          } active:scale-[0.98]`}
        >
          {verifyStatus === 'loading' ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : verifyStatus === 'error' ? (
            <X size={14} />
          ) : (
            <RefreshCw size={14} />
          )}
          {verifyStatus === 'loading' ? '正在验证...' : verifyStatus === 'error' ? '验证失败，重试' : '验证连接'}
        </button>
      </div>
    </div>
  );

  // 2. 正常工作视图 (验证成功后)
  const renderNormalView = () => (
    <div className="flex-1 overflow-y-auto bg-[#f4f5f9] animate-in fade-in zoom-in-95 duration-500">
      {/* 顶部店铺标题与信息 */}
      <div className="bg-white p-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="text-[#333] font-bold text-sm">时光荏苒99320089</span>
          <HelpCircle size={14} className="text-blue-400" />
          <div className="flex items-center bg-blue-50 px-1 rounded border border-blue-100 ml-1">
             <span className="text-[9px] text-blue-600 font-bold">AI</span>
          </div>
        </div>
        <Zap size={14} className="text-orange-400" />
      </div>

      {/* 商品卡片 */}
      <div className="bg-white p-3 flex gap-3 mb-2 shadow-sm">
        <div className="w-20 h-20 rounded bg-gray-100 overflow-hidden shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200&auto=format&fit=crop" 
            alt="dress" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="text-[12px] text-gray-800 line-clamp-2 leading-snug">
              白色连衣裙子女夏2025新款法式茶歇小个...
            </p>
            <p className="text-[11px] text-gray-400 mt-1">ID: 963491959872 <span className="text-gray-300 ml-1">📋</span></p>
          </div>
          <div className="flex justify-end gap-3">
             <button className="text-blue-500 text-[11px]">选sku</button>
             <button className="text-blue-500 text-[11px]">切换商品</button>
          </div>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="p-2 space-y-3 pb-20">
        <div className="animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="bg-orange-400 text-white text-[10px] font-bold w-4 h-4 rounded flex items-center justify-center shrink-0">1</div>
            <span className="text-orange-400 font-bold text-[12px]">商品卖点</span>
            <span className="text-gray-300 text-[10px] ml-auto">11:19</span>
            <RefreshCw size={12} className="text-gray-300" />
            <div className="flex items-center gap-0.5 border border-gray-100 rounded px-1 text-[10px] text-gray-400">
              <Send size={8} /> 已发送
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-2 flex gap-2">
            <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden shrink-0 mt-1">
               <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=100&auto=format&fit=crop" alt="product" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
               <p className="text-[12px] text-gray-500 line-clamp-1 mb-2">白色连衣裙子女夏2025新款法式茶歇小个子高级...</p>
               <div className="border border-gray-100 rounded p-2 bg-white text-[11px] text-gray-700 space-y-2">
                  <p>1. ⚒️匠心选材，经典耐用⚒️</p>
                  <p className="text-gray-500 ml-4">铁艺的坚韧，防腐防锈，光线的纯净与明亮，不发黄，经久耐用</p>
                  <p>🌈全光谱之光，真实色彩尽现🌈</p>
                  <p className="text-gray-500 ml-4">LED全光谱灯源，显色指数大于98，享受最接近自然光的舒适体验</p>
               </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-1 px-1">
             <span className="text-[10px] text-gray-300">商详/聊天/采纳/全店</span>
             <Flag size={12} className="text-gray-200" />
          </div>
        </div>

        <div className="animate-in slide-in-from-bottom-3 duration-500">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="bg-green-500 text-white text-[10px] font-bold w-4 h-4 rounded flex items-center justify-center shrink-0">2</div>
            <span className="text-green-500 font-bold text-[12px]">客服Agent</span>
            <span className="text-gray-300 text-[10px] ml-auto">11:18</span>
            <RefreshCw size={12} className="text-gray-300" />
            <div className="flex items-center gap-0.5 border border-gray-100 rounded px-1 text-[10px] text-gray-400">
              <Send size={8} /> 已发送
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
            <p className="text-[12px] text-gray-700">买家：好的呢</p>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
               <RefreshCw size={10} className="text-blue-400" />
               买家回应已收到，等待进一步服务
            </div>
            <div className="border border-green-100 rounded-md p-2 bg-green-50/30 flex items-center gap-2">
               <span className="text-[11px] text-green-600 font-medium">2.</span>
               <span>🌹🌹</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-1 px-1">
             <span className="text-[10px] text-gray-300">采纳/全店</span>
             <Flag size={12} className="text-gray-200" />
          </div>
        </div>
      </div>

      {/* 底部输入引导栏 */}
      <div className="bg-white rounded-t-xl border-t border-gray-200 p-2 fixed bottom-0 left-0 right-0 max-w-[360px] mx-auto flex items-center gap-2 shadow-inner z-20">
         <div className="flex-1 bg-gray-100 rounded-full px-4 py-1.5 text-[12px] text-gray-400">输入内容...</div>
         <div className="bg-blue-500 rounded-full w-12 h-7 flex items-center justify-center text-white gap-1 shadow-sm">
            <Zap size={10} fill="white" />
            <span className="text-[10px] font-bold">催</span>
         </div>
         <Send size={16} className="text-blue-400" />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[360px] h-[640px] bg-[#f4f5f9] shadow-2xl rounded-xl overflow-hidden flex flex-col border border-gray-300 relative shrink-0">
      
      {/* 头部 */}
      <div className="bg-[#0052d9] px-3 py-2.5 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 22V9C10 6.79086 8.20914 5 6 5H2" stroke="#0052d9" strokeWidth="3.5" strokeLinecap="round"/>
              <rect x="14" y="5" width="5" height="5" rx="1" fill="#0052d9"/>
            </svg>
          </div>
          <span className="text-white text-[13px] font-medium opacity-90 tracking-wide">hjiash:wanting</span>
          <div className="bg-[#0042ad] rounded-full px-2 py-0.5 flex items-center gap-1">
            <div className="w-3.5 h-3.5 bg-blue-400 rounded-full flex items-center justify-center text-[8px] font-bold text-white italic">T</div>
            <span className="text-white text-[11px] font-bold">896</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 text-white/80">
          <Settings size={15} className="cursor-pointer hover:text-white" />
          <div className="w-[1px] h-3 bg-white/20" />
          <RefreshCw size={15} className="cursor-pointer hover:text-white" />
          <X size={16} className="cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* 导航标签 */}
      <div className="flex bg-white border-b border-gray-100 shadow-sm shrink-0 z-10">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[14px] font-medium transition-all relative ${
              activeTab === tab ? 'text-[#0052d9]' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-[25%] right-[25%] h-[2.5px] bg-[#0052d9] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 内容切换 */}
      {isVerified ? renderNormalView() : renderDiagnosticView()}

      {/* 插件页脚 */}
      {!isVerified && (
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
          <span className="text-[10px] text-gray-400">探域科技 · 异常监测系统</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 ${verifyStatus === 'error' ? 'bg-red-500' : 'bg-green-500 animate-pulse'} rounded-full`} />
            <span className="text-[10px] text-gray-500 font-medium">
              {verifyStatus === 'error' ? '验证未通过' : '系统监控中'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QianniuPluginPrototype;
