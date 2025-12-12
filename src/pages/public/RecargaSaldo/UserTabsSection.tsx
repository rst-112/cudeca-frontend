import React from 'react';

interface TabItem {
  label: string;
  variant: 'default' | 'primary';
  width: string;
}

export const UserTabsSection = (): JSX.Element => {
  const tabs: TabItem[] = [
    { label: 'Saldo: 36.00€', variant: 'default', width: 'w-[132.75px]' },
    { label: 'Recargar saldo', variant: 'primary', width: 'w-[140.7px]' },
    { label: 'Perfil', variant: 'default', width: 'w-[86.45px]' },
    { label: 'Compras', variant: 'default', width: 'w-[114.9px]' },
    { label: 'Datos fiscales', variant: 'default', width: 'w-[149.59px]' },
    { label: 'Suscripción', variant: 'default', width: 'w-[132.7px]' },
  ];

  return (
    <nav
      className="absolute top-20 left-0 w-[1920px] h-[76px] bg-gray-50"
      role="navigation"
      aria-label="User account navigation"
    >
      <div className="absolute top-0 left-0 w-[1920px] h-[76px] border-b-[0.8px] [border-bottom-style:solid] border" />

      <div className="absolute top-0 left-0 w-[1920px] h-[76px] flex">
        <div className="mt-4 w-[1920px] flex gap-3">
          {tabs.map((tab, index) => {
            const isPrimary = tab.variant === 'primary';
            const isFirst = index === 0;
            const marginLeft = isFirst ? 'ml-[551.5px]' : '';
            const marginTop = isFirst ? '' : 'mt-[0.5px]';
            const height = isFirst ? 'h-[43px]' : 'h-[42px]';
            const bgColor = isPrimary ? 'bg-[#00753e]' : 'bg-white';
            const borderColor = isPrimary ? 'border-[#00753e]' : 'border-[#d1d5dc]';
            const textColor = isPrimary ? 'text-white' : 'text-[#364153]';

            return (
              <button
                key={index}
                className={`${tab.width} ${bgColor} ${marginTop} ${height} ${marginLeft} relative rounded-[20px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00753e] transition-colors hover:opacity-90`}
                aria-current={isPrimary ? 'page' : undefined}
              >
                <div
                  className={`absolute top-0 left-0 ${tab.width.replace('w-[', 'w-[').replace('px]', 'px]').replace('.75', '').replace('.7', '').replace('.45', '').replace('.9', '').replace('.59', '')} ${height} rounded-[20px] border-[0.8px] border-solid ${borderColor}`}
                />

                <div
                  className={`flex flex-col ${tab.width.replace('w-[', 'w-[').replace('px]', 'px]').replace('.75', '').replace('.7', '').replace('.45', '').replace('.9', '').replace('.59', '')} ${height} items-start pl-[25.14px] pr-[24.84px] pt-[9px] pb-0 absolute top-0 left-0`}
                >
                  <div className="relative self-stretch w-full h-6">
                    <span
                      className={`absolute top-px ${isFirst ? 'left-[-9px]' : 'left-0'} [font-family:'Arimo-Regular',Helvetica] font-normal ${textColor} text-base text-center tracking-[0] leading-6 whitespace-nowrap`}
                    >
                      {tab.label}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
