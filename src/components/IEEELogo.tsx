import React from 'react';

interface IEEELogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'emblem';
  textColor?: string;
  subtextColor?: string;
}

export const IEEEDiamond: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Diamond */}
      <polygon
        points="50,4 96,50 50,96 4,50"
        fill="currentColor"
      />
      {/* Inner Diamond (negative cutout) */}
      <polygon
        points="50,11 89,50 50,89 11,50"
        className="fill-white dark:fill-[#071860]"
      />
      {/* Center Arrow and Right-hand rule / induction loops */}
      <g fill="currentColor">
        {/* Vertical Arrow */}
        <path d="M47 30 L50 20 L53 30 L51.5 30 L51.5 78 L48.5 78 L48.5 30 Z" />
        {/* Magnetic field flux spirals / loops */}
        <path
          d="M32 50 C32 40 40 34 50 34 C52 34 54 34.5 56 35.5 L54 38 C52.8 37.3 51.4 37 50 37 C42 37 35.5 42.5 35.5 50 C35.5 57.5 42 63 50 63 C58 63 64.5 57.5 64.5 50 C64.5 46 62.5 42.5 59.5 40.5 L61.5 38 C65 40.8 67.5 45.2 67.5 50 C67.5 59.5 59.5 66 50 66 C40.5 66 32 59.5 32 50 Z"
        />
        <path
          d="M26 50 C26 36 36.5 27 50 27 C53 27 56 27.8 58.5 29.2 L56.8 31.8 C54.7 30.6 52.4 30 50 30 C38.5 30 29.5 38 29.5 50 C29.5 62 38.5 70 50 70 C61.5 70 70.5 62 70.5 50 C70.5 44 68 39 64 35.5 L66 33 C70.5 37 73.5 43 73.5 50 C73.5 63.5 63 73 50 73 C37 73 26 63.5 26 50 Z"
        />
      </g>
    </svg>
  );
};

export const IEEELogo: React.FC<IEEELogoProps> = ({
  className = '',
  variant = 'full',
  textColor = 'text-[#012dc1] dark:text-white',
  subtextColor = 'text-[#071860] dark:text-[#98abe6]',
}) => {
  if (variant === 'emblem') {
    return <IEEEDiamond size={32} className={textColor} />;
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Diamond Emblem + IEEE Wordmark */}
      <div className={`flex items-center gap-1.5 ${textColor}`}>
        <IEEEDiamond size={26} className="shrink-0" />
        <span className="text-xl font-black tracking-tighter uppercase font-sans leading-none">
          IEEE
        </span>
      </div>

      {variant === 'full' && (
        <>
          {/* Subtle Vertical Divider from Guidelines */}
          <div className="h-7 w-[1.5px] bg-[#071860]/30 dark:bg-white/30 shrink-0" />

          {/* University and Branch Name */}
          <div className={`flex flex-col justify-center leading-tight ${subtextColor} text-left`}>
            <span className="text-[11px] sm:text-[12px] font-bold tracking-tight whitespace-nowrap">
              King Abdulaziz University
            </span>
            <span className="text-[9px] sm:text-[10px] font-medium tracking-tight whitespace-nowrap opacity-90">
              IEEE Student Branch [Female]
            </span>
          </div>
        </>
      )}
    </div>
  );
};
