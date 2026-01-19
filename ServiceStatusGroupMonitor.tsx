
import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  WifiOff, 
  Wifi,
  Power, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  MousePointer2,
  ShieldAlert,
  ExternalLink,
  CreditCard
} from 'lucide-react';
import { Shop, ModalMode, TabType } from '../types';

interface Props {
  shops: Shop[];
  onUpdateShop: (id: string, updates: Partial<Shop>) => void;
  onClose: () => void;
}

const ServiceStatusGroupMonitor: React.FC<Props> = ({ shops, onUpdateShop, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.SERVICE_DISABLED);
  const [loadingShopId, setLoadingShopId] = useState<string | null>(null);
  const [successShopIds, setSuccessShopIds] = useState<Set<string>>(new Set());
  const [sessionEnabledIds, setSessionEnabledIds] = useState<Set<string>>(new Set());

  // 筛选逻辑：需开启服务列表 (显示未开启的，或者在本轮操作中刚开启的)
  const disabledServices = useMemo(() => {
    return shops.filter(s => !s.serviceEnabled || sessionEnabledIds.has(s.id));
  }, [shops, sessionEnabledIds]);
  
  // 筛选逻辑：连接异常列表 (显示断连的，或者在本轮操作中刚恢复连接的)
  const disconnectedPanels = useMemo(() => {
    return shops.filter(s => s.serviceEnabled && (s.status === 'disconnected' || successShopIds.has(s.id)));
  }, [shops, successShopIds]);

  // 初始化 Tab 逻辑
  useEffect(() => {
    if (disabledServices.filter(s => !s.serviceEnabled).length > 0) {
      setActiveTab(TabType.SERVICE_DISABLED);
    } else if (disconnectedPanels.filter(s => s.status === 'disconnected').length > 0) {
      setActiveTab(TabType.PANEL_DISCONNECTED);
    }
  }, []);

  const handleEnableService = async (shop: Shop) => {
    if (shop.serviceEnabled || loadingShopId === shop.id) return;

    setLoadingShopId(shop.id);
    await new Promise(r => setTimeout(r, 1200));
    
    // 更新父组件状态
    onUpdateShop(shop.id, { serviceEnabled: true });
    
    // 记录本轮开启的ID，保持在列表中常显
    setSessionEnabledIds(prev => new Set(prev).add(shop.id));
    setLoadingShopId(null);
  };

  const handleVerifyInline = async (shop: Shop) => {
    if (successShopIds.has(shop.id)) return;
    
    setLoadingShopId(shop.id);
    // 模拟行内验证过程
    await new Promise(r => setTimeout(r, 1500));
    
    // 更新父组件状态
    onUpdateShop(shop.id, { status: 'connected' });
    
    // 记录本轮成功的ID，用于锁定UI表现
    setLoadingShopId(null);
    setSuccessShopIds(prev => new Set(prev).add(shop.id));
  };

  const renderOverview = () => (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden">
      {/* Tab Switcher */}
      <div className="flex border-b border-gray-100 mb-4 px-2 shrink-0">
        <button 
          onClick={() => setActiveTab(TabType.SERVICE_DISABLED)}
          className={`px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === TabType.SERVICE_DISABLED 
              ? 'border-orange-500 text-orange-600' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          需开启服务
          {disabledServices.filter(s => !s.serviceEnabled).length > 0 && (
            <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full text-[10px]">
              {disabledServices.filter(s => !s.serviceEnabled).length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab(TabType.PANEL_DISCONNECTED)}
          className={`px-4 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === TabType.PANEL_DISCONNECTED 
              ? 'border-red-500 text-red-600' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          面板连接异常
          {disconnectedPanels.filter(s => s.status === 'disconnected').length > 0 && (
            <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-[10px]">
              {disconnectedPanels.filter(s => s.status === 'disconnected').length}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 px-2 pb-4 overflow-y-auto">
        {activeTab === TabType.SERVICE_DISABLED ? (
          disabledServices.length > 0 ? (
            <div className="space-y-3">
              {disabledServices.map(shop => {
                const isEnabled = shop.serviceEnabled;
                const isLoading = loadingShopId === shop.id;

                return (
                  <div key={shop.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                    isEnabled ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg text-white shadow-sm transition-colors ${
                        isEnabled ? 'bg-green-500' : 'bg-orange-500'
                      }`}>
                        {isEnabled ? <CheckCircle2 size={18} /> : <Power size={18} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{shop.name}</h4>
                        {isEnabled && <span className="text-[10px] text-green-600 font-bold">服务已成功开启</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <button 
                        role="switch"
                        aria-checked={isEnabled}
                        disabled={isLoading || isEnabled}
                        onClick={() => handleEnableService(shop)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                          isEnabled ? 'bg-green-500' : (isLoading ? 'bg-orange-400' : 'bg-gray-300 hover:bg-gray-400')
                        }`}
                      >
                         <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                            isEnabled || isLoading ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="text-[10px] text-gray-400 mt-1.5 font-medium">
                        {isEnabled ? '客户端重新托管即可生效' : '开启后客户端重新托管即可生效'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <CheckCircle2 size={48} className="text-green-500 mb-3" />
              <p className="text-sm">所有店铺 SaaS 服务均已开启</p>
            </div>
          )
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-5">
            
            {/* Step 1: Client Check */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="shrink-0 w-6 h-6 bg-blue-600 text-white text-xs flex items-center justify-center rounded-full font-bold shadow-sm">1</span>
                <h5 className="font-bold text-sm text-blue-900">客户端排查：确保面板开关已开启</h5>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-28 bg-white rounded-xl border border-blue-100 relative overflow-hidden flex items-center justify-center">
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
                    <p className="absolute bottom-1 right-2 text-[10px] text-blue-500 font-bold bg-white/90 px-1.5 py-0.5 rounded shadow-sm">点击设置确保面板开启</p>
                </div>
                <div className="h-28 bg-white rounded-xl border border-blue-100 relative overflow-hidden flex items-center justify-center">
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
                    <p className="absolute bottom-1 right-2 text-[10px] text-blue-500 font-bold bg-white/90 px-1.5 py-0.5 rounded shadow-sm">在应用列表滚动查找</p>
                </div>
              </div>
            </div>

            {/* Step 2: Global Account Check */}
            <div className="bg-red-50/40 border border-red-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="shrink-0 w-6 h-6 bg-red-100 text-red-600 text-xs flex items-center justify-center rounded-full font-bold shadow-sm border border-red-200">2</span>
                <h5 className="font-bold text-sm text-gray-800">检查订购与有效期</h5>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-gray-700 font-bold text-xs">
                  <CreditCard size={14} className="text-orange-500" />
                  服务有效期
                </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                  服务过期会导致断连，请确保当前店铺对应的服务合约仍在有效期内。
                  <button className="text-blue-600 hover:underline inline-flex items-center gap-0.5 ml-1">
                    去服务市场查看 <ExternalLink size={10} />
                  </button>
                </p>
              </div>
            </div>

            {/* Abnormal Shops List */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <h5 className="font-bold text-sm text-gray-800">异常店铺列表</h5>
                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">待处理: {disconnectedPanels.filter(s => s.status === 'disconnected').length}</span>
              </div>
              
              {disconnectedPanels.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-sm overflow-hidden">
                  {disconnectedPanels.map(shop => {
                    const isSuccess = successShopIds.has(shop.id);
                    const isLoading = loadingShopId === shop.id;

                    return (
                      <div key={shop.id} className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg shrink-0 transition-colors ${isSuccess ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                            {isSuccess ? <Wifi size={16} /> : <WifiOff size={16} />}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800 text-sm">{shop.name}</span>
                            <span className={`text-[10px] font-medium transition-colors ${isSuccess ? 'text-green-600' : 'text-gray-400'}`}>
                              连接状态：{isSuccess ? '已连接' : '断开'}
                            </span>
                          </div>
                        </div>
                        <button 
                          disabled={isLoading || isSuccess}
                          onClick={() => handleVerifyInline(shop)}
                          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            isSuccess 
                              ? 'bg-green-50 text-green-600 border-green-200 shadow-none cursor-default' 
                              : isLoading 
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-100'
                          }`}
                        >
                          {isLoading ? (
                            <RefreshCw size={12} className="animate-spin" />
                          ) : isSuccess ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <RefreshCw size={12} />
                          )}
                          {isLoading ? '验证中...' : isSuccess ? '验证成功' : '验证连接'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <CheckCircle2 size={32} className="text-green-500 mb-2" />
                  <p className="text-xs">暂无面板连接异常店铺</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
              <ShieldAlert size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              智能客服面板异常监测
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden relative">
          {renderOverview()}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-400 shrink-0">
          <p>系统自动实时监控连接状态。如有疑问请联系集团 IT 支持。</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><Power size={12} className="text-orange-400" /> SaaS服务</span>
            <span className="flex items-center gap-1"><Zap size={12} className="text-blue-400" /> 千牛插件</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceStatusGroupMonitor;
