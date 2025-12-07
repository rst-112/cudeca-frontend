import type { ReactNode } from 'react';
import campaignImage from '../../assets/campaign-placeholder.png';

interface AuthLayoutProps {
  children: ReactNode;
  imageSide: 'left' | 'right';
}

export default function AuthLayout({ children, imageSide }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-white">
      {/* Image Section */}
      <div
        className={`relative hidden w-1/2 lg:block transition-all duration-700 ease-in-out ${
          imageSide === 'right' ? 'order-2 translate-x-0' : 'order-1 translate-x-0'
        }`}
      >
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img
          src={campaignImage}
          alt="Cudeca Campaign - Eres pieza clave"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-12 left-12 right-12 z-20 text-white">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Eres pieza clave</h2>
          <p className="text-xl drop-shadow-md">Cada cuidado cuenta. Cada pieza suma.</p>
          <p className="text-lg mt-2 text-yellow-400 font-semibold drop-shadow-md">
            You are the key piece
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div
        className={`flex w-full items-center justify-center p-8 lg:w-1/2 transition-all duration-700 ease-in-out ${
          imageSide === 'right' ? 'order-1' : 'order-2'
        }`}
      >
        <div className="w-full max-w-md space-y-6">{children}</div>
      </div>
    </div>
  );
}
