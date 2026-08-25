"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  slug: string;
  categorySlug: string;
  size: string;
  colourName: string;
  colourHex: string;
  priceKobo: number;
  quantity: number;
  imageUrl: string;
}

type CartState = {
  items: CartItem[];
  checkoutInitiated: boolean;
};

type CartAction =
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; variantId: string }
  | { type: "UPDATE_QTY"; variantId: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "SET_CHECKOUT_INITIATED"; value: boolean };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items };
    case "ADD": {
      const existing = state.items.find(
        (i) => i.variantId === action.item.variantId
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.variantId === action.item.variantId
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case "REMOVE":
      return {
        ...state,
        items: state.items.filter((i) => i.variantId !== action.variantId),
      };
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.variantId === action.variantId
            ? { ...i, quantity: Math.max(1, action.quantity) }
            : i
        ),
      };
    case "CLEAR":
      return { ...state, items: [] };
    case "SET_CHECKOUT_INITIATED":
      return { ...state, checkoutInitiated: action.value };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  checkoutInitiated: boolean;
  totalKobo: number;
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  dismissRecovery: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    checkoutInitiated: false,
  });

  // Rehydrate from localStorage on mount — before first render flash
  useEffect(() => {
    try {
      const stored = localStorage.getItem("0s_cart");
      if (stored) dispatch({ type: "HYDRATE", items: JSON.parse(stored) });

      const initiated = localStorage.getItem("0s_checkout_initiated");
      if (initiated === "true")
        dispatch({ type: "SET_CHECKOUT_INITIATED", value: true });
    } catch {
      // Corrupted storage — start fresh
    }
  }, []);

  // Persist on every cart change
  useEffect(() => {
    localStorage.setItem("0s_cart", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = useCallback(
    (item: CartItem) => dispatch({ type: "ADD", item }),
    []
  );
  const removeItem = useCallback(
    (variantId: string) => dispatch({ type: "REMOVE", variantId }),
    []
  );
  const updateQuantity = useCallback(
    (variantId: string, quantity: number) =>
      dispatch({ type: "UPDATE_QTY", variantId, quantity }),
    []
  );
  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
    localStorage.removeItem("0s_checkout_initiated");
    dispatch({ type: "SET_CHECKOUT_INITIATED", value: false });
  }, []);
  const dismissRecovery = useCallback(() => {
    localStorage.removeItem("0s_checkout_initiated");
    dispatch({ type: "SET_CHECKOUT_INITIATED", value: false });
  }, []);

  const totalKobo = state.items.reduce(
    (sum, i) => sum + i.priceKobo * i.quantity,
    0
  );
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        checkoutInitiated: state.checkoutInitiated,
        totalKobo,
        itemCount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        dismissRecovery,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
