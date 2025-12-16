/**
 * CartContext Test Suite
 *
 * Tests para el contexto del carrito de compras
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { CartProvider, useCart, CartItem } from './CartContext';
import { toast } from 'sonner';

// Mock de sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

// Helper para crear items del carrito
const createMockCartItem = (overrides?: Partial<CartItem>): Omit<CartItem, 'cantidad'> => ({
  id: 'item-1',
  eventoId: 1,
  eventoNombre: 'Evento Test',
  eventoFecha: '2025-12-31',
  tipoEntradaId: 1,
  tipoEntradaNombre: 'Entrada General',
  precio: 50,
  ...overrides,
});

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  describe('Inicialización', () => {
    it('debe inicializar con carrito vacío', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.items).toEqual([]);
      expect(result.current.getTotalItems()).toBe(0);
      expect(result.current.getTotalPrice()).toBe(0);
    });

    it('debe cargar items desde localStorage si existen', () => {
      const savedItems: CartItem[] = [
        {
          ...createMockCartItem(),
          cantidad: 2,
        },
      ];
      localStorage.setItem('cudeca-cart', JSON.stringify(savedItems));

      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].cantidad).toBe(2);
      expect(result.current.getTotalItems()).toBe(2);
    });

    it('debe manejar JSON inválido en localStorage', () => {
      localStorage.setItem('cudeca-cart', 'invalid-json{');

      // JSON inválido causa que el parse lance error al inicializar
      expect(() => renderHook(() => useCart(), { wrapper })).toThrow();
    });

    it('debe lanzar error si se usa fuera del provider', () => {
      expect(() => {
        renderHook(() => useCart());
      }).toThrow('useCart debe usarse dentro de CartProvider');
    });
  });

  describe('addItem', () => {
    it('debe añadir un item al carrito', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const newItem = createMockCartItem();

      act(() => {
        result.current.addItem(newItem);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toMatchObject(newItem);
      expect(result.current.items[0].cantidad).toBe(1);
      expect(toast.success).toHaveBeenCalledWith('Entrada añadida al carrito');
    });

    it('debe persistir items en localStorage', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const newItem = createMockCartItem();

      act(() => {
        result.current.addItem(newItem);
      });

      const saved = JSON.parse(localStorage.getItem('cudeca-cart') || '[]');
      expect(saved).toHaveLength(1);
      expect(saved[0]).toMatchObject(newItem);
    });

    it('no debe añadir item duplicado', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const newItem = createMockCartItem();

      act(() => {
        result.current.addItem(newItem);
        result.current.addItem(newItem);
      });

      expect(result.current.items).toHaveLength(1);
      expect(toast.info).toHaveBeenCalledWith('Entrada ya añadida al carrito');
    });

    it('debe añadir múltiples items diferentes', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const item1 = createMockCartItem({ id: 'item-1' });
      const item2 = createMockCartItem({ id: 'item-2' });

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.getTotalItems()).toBe(2);
    });

    it('debe añadir item con todos los campos opcionales', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const newItem = createMockCartItem({
        eventoImagen: 'image.jpg',
        asientoId: 'A1',
        asientoEtiqueta: 'Asiento A1',
        zonaNombre: 'Zona VIP',
      });

      act(() => {
        result.current.addItem(newItem);
      });

      expect(result.current.items[0]).toMatchObject(newItem);
    });
  });

  describe('removeItem', () => {
    it('debe eliminar un item del carrito', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const newItem = createMockCartItem();

      act(() => {
        result.current.addItem(newItem);
      });

      expect(result.current.items).toHaveLength(1);

      act(() => {
        result.current.removeItem(newItem.id);
      });

      expect(result.current.items).toHaveLength(0);
      expect(toast.success).toHaveBeenCalledWith('Entrada eliminada del carrito');
    });

    it('debe actualizar localStorage al eliminar', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const newItem = createMockCartItem();

      act(() => {
        result.current.addItem(newItem);
        result.current.removeItem(newItem.id);
      });

      const saved = JSON.parse(localStorage.getItem('cudeca-cart') || '[]');
      expect(saved).toHaveLength(0);
    });

    it('no debe hacer nada si el item no existe', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.removeItem('non-existent-id');
      });

      expect(result.current.items).toHaveLength(0);
      expect(toast.success).toHaveBeenCalled();
    });
  });

  describe('updateQuantity', () => {
    it('debe actualizar la cantidad de un item', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const newItem = createMockCartItem();

      act(() => {
        result.current.addItem(newItem);
        result.current.updateQuantity(newItem.id, 5);
      });

      expect(result.current.items[0].cantidad).toBe(5);
      expect(result.current.getTotalItems()).toBe(5);
    });

    it('debe eliminar item si cantidad es menor a 1', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const newItem = createMockCartItem();

      act(() => {
        result.current.addItem(newItem);
        result.current.updateQuantity(newItem.id, 0);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('debe eliminar item si cantidad es negativa', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const newItem = createMockCartItem();

      act(() => {
        result.current.addItem(newItem);
        result.current.updateQuantity(newItem.id, -5);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('no debe hacer nada si el item no existe', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.updateQuantity('non-existent-id', 5);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('debe persistir cambios en localStorage', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const newItem = createMockCartItem();

      act(() => {
        result.current.addItem(newItem);
        result.current.updateQuantity(newItem.id, 3);
      });

      const saved = JSON.parse(localStorage.getItem('cudeca-cart') || '[]');
      expect(saved[0].cantidad).toBe(3);
    });
  });

  describe('clearCart', () => {
    it('debe vaciar el carrito completamente', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const item1 = createMockCartItem({ id: 'item-1' });
      const item2 = createMockCartItem({ id: 'item-2' });

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
      });

      expect(result.current.items).toHaveLength(2);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('debe limpiar carrito en localStorage', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const newItem = createMockCartItem();

      act(() => {
        result.current.addItem(newItem);
        result.current.clearCart();
      });

      // El useEffect guarda el array vacío en localStorage después de clearCart
      const saved = localStorage.getItem('cudeca-cart');
      expect(saved).toBe('[]');
    });
  });

  describe('getTotalItems', () => {
    it('debe retornar 0 para carrito vacío', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.getTotalItems()).toBe(0);
    });

    it('debe calcular total de items correctamente', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const item1 = createMockCartItem({ id: 'item-1' });
      const item2 = createMockCartItem({ id: 'item-2' });

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
        result.current.updateQuantity('item-1', 3);
        result.current.updateQuantity('item-2', 2);
      });

      expect(result.current.getTotalItems()).toBe(5);
    });
  });

  describe('getTotalPrice', () => {
    it('debe retornar 0 para carrito vacío', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.getTotalPrice()).toBe(0);
    });

    it('debe calcular precio total correctamente', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const item1 = createMockCartItem({ id: 'item-1', precio: 50 });
      const item2 = createMockCartItem({ id: 'item-2', precio: 30 });

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
        result.current.updateQuantity('item-1', 2); // 50 * 2 = 100
        result.current.updateQuantity('item-2', 3); // 30 * 3 = 90
      });

      expect(result.current.getTotalPrice()).toBe(190);
    });

    it('debe calcular correctamente con un solo item', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const item = createMockCartItem({ precio: 75 });

      act(() => {
        result.current.addItem(item);
        result.current.updateQuantity(item.id, 4);
      });

      expect(result.current.getTotalPrice()).toBe(300);
    });
  });

  describe('Integración completa', () => {
    it('debe manejar flujo completo: añadir, actualizar, eliminar', () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const item1 = createMockCartItem({ id: 'item-1', precio: 50 });
      const item2 = createMockCartItem({ id: 'item-2', precio: 30 });
      const item3 = createMockCartItem({ id: 'item-3', precio: 20 });

      // Añadir items
      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
        result.current.addItem(item3);
      });

      expect(result.current.items).toHaveLength(3);
      expect(result.current.getTotalPrice()).toBe(100);

      // Actualizar cantidades
      act(() => {
        result.current.updateQuantity('item-1', 2);
        result.current.updateQuantity('item-2', 3);
      });

      expect(result.current.getTotalPrice()).toBe(210); // (50*2) + (30*3) + (20*1)

      // Eliminar un item
      act(() => {
        result.current.removeItem('item-2');
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.getTotalPrice()).toBe(120); // (50*2) + (20*1)

      // Limpiar carrito
      act(() => {
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.getTotalPrice()).toBe(0);
    });

    it('debe persistir estado a través de re-renders', () => {
      const { result, rerender } = renderHook(() => useCart(), { wrapper });
      const newItem = createMockCartItem();

      act(() => {
        result.current.addItem(newItem);
      });

      rerender();

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toMatchObject(newItem);
    });
  });
});
