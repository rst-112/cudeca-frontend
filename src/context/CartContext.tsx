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
  addItem: (item: Omit<CartItem, 'cantidad'>, silent?: boolean) => void;
  addItemWithSeat: (item: Omit<CartItem, 'cantidad'>, silent?: boolean) => void;
  removeItem: (id: string, silent?: boolean) => void; // <--- Nuevo parámetro silent
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

  const addItem = (newItem: Omit<CartItem, 'cantidad'>, silent: boolean = false) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        if (!silent) toast.info('Entrada ya añadida al carrito');
        return prev;
      }
      if (!silent) toast.success('Entrada añadida al carrito');
      return [...prev, { ...newItem, cantidad: 1 }];
    });
  };

  const addItemWithSeat = (newItem: Omit<CartItem, 'cantidad'>, silent: boolean = false) => {
    setItems((prev) => {
      const existingWithSeat = prev.find(
        (item) => item.asientoId && item.asientoId === newItem.asientoId,
      );

      if (existingWithSeat) {
        if (!silent) toast.error(`El asiento ${newItem.asientoEtiqueta} ya está en el carrito`);
        return prev;
      }

      if (!silent) toast.success(`Asiento ${newItem.asientoEtiqueta} añadido al carrito`);
      return [...prev, { ...newItem, cantidad: 1 }];
    });
  };

  // removeItem ahora acepta silent
  const removeItem = (id: string, silent: boolean = false) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (!silent) toast.success('Entrada eliminada del carrito');
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
        addItemWithSeat,
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
