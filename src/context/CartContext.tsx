/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  eventoId: number;
  eventoNombre: string;
  eventoImagen?: string;
  eventoFecha: string;
  tipoEntradaId: number;
  tipoEntradaNombre: string;
  asientoId?: string;
  asientoEtiqueta?: string;
  zonaNombre?: string;
  precio: number;
  cantidad: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cantidad'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, cantidad: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cudeca-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cudeca-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'cantidad'>) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        toast.info('Entrada ya añadida al carrito');
        return prev;
      }
      toast.success('Entrada añadida al carrito');
      return [...prev, { ...newItem, cantidad: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success('Entrada eliminada del carrito');
  };

  const updateQuantity = (id: string, cantidad: number) => {
    if (cantidad < 1) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, cantidad } : item)));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cudeca-cart');
  };

  const getTotalItems = () => items.reduce((sum, item) => sum + item.cantidad, 0);
  const getTotalPrice = () => items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
}
