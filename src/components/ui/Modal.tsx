import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div
        className={cn(
          'bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-cudeca-gris-borde/20',
          className,
        )}
      >
        {/* Cabecera */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-cudeca-verde-dark">{title}</h3>
          <button
            onClick={onClose}
            className="text-cudeca-gris-claro hover:text-cudeca-rojo transition font-bold"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 text-cudeca-gris-texto">{children}</div>

        {/* Pie */}
        <div className="bg-gray-50 p-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} size="sm">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
