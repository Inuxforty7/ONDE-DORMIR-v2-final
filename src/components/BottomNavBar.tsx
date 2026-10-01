import React from 'react';
import { Home, Compass, ShoppingBag, Heart, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onNavigateTab: (tab: ActiveTab) => void;
  savedCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onNavigateTab,
  savedCount = 0,
}) => {
  const navItems = [
    { id: 'home' as ActiveTab, label: 'Início', icon: Home },
    { id: 'explore' as ActiveTab, label: 'Explorar', icon: Compass },
    { id: 'loveshop' as ActiveTab, label: 'Love Shop', icon: ShoppingBag },
    { id: 'saved' as ActiveTab, label: 'Favoritos', icon: Heart, badge: savedCount },
    { id: 'account' as ActiveTab, label: 'Perfil', icon: User },
  ];

  return (
    <nav
      aria-label="Navegação Principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-lg px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 max-w-lg mx-auto sm:rounded-t-2xl transition-all"
    >
      <div className="grid grid-cols-5 items-center justify-items-center h-12 sm:h-13">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isLoveShop = item.id === 'loveshop';

          return (
            <button
              key={item.id}
              onClick={() => onNavigateTab(item.id)}
              className={`relative flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 px-2 rounded-xl transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? isLoveShop
                    ? 'text-rose-600 font-black'
                    : 'text-blue-600 font-black'
                  : 'text-neutral-500 hover:text-neutral-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive
                      ? isLoveShop
                        ? 'stroke-[2.5] scale-110 text-rose-600'
                        : 'stroke-[2.5] scale-110 text-blue-600'
                      : 'stroke-[1.8]'
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center leading-none shadow-xs">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] mt-0.5 tracking-tight whitespace-nowrap ${
                  isActive ? 'font-bold' : 'font-medium text-neutral-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
