import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

interface Eventt {
  price: number;
  id_wydarzenia: number;
  id_organizatora: string;
  typ: string;
  nazwa: string;
  data: string;
  godzina: string;
  miasto: string;
  adres: string;
  opis: string;
  zdjecie: string;
  cena: number;
}

interface CartItem {
  event: Eventt;
  count: number;
}

interface CartContextProps {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  addToCart: (event: Eventt, ticketCount: number) => void;
  increaseItem: (eventId: number) => void;
  decreaseItem: (eventId: number) => void;
  removeItem: (eventId: number) => void;
  totalPrice: number;
  clearCart: () => void; // Dodaj clearCart do CartContextProps
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = sessionStorage.getItem("cart");
    if (storedCart) {
      try {
        return JSON.parse(storedCart);
      } catch (error) {
        console.error(
          "Błąd parsowania danych koszyka z sessionStorage:",
          error
        );
      }
    }
    return [];
  });

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (event: Eventt, ticketCount: number) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.event.id_wydarzenia === event.id_wydarzenia
      );

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].count += ticketCount;
        return updatedCart;
      }
      return [...prevCart, { event, count: ticketCount }];
    });
  };

  const increaseItem = (eventId: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.event.id_wydarzenia === eventId
          ? { ...item, count: item.count + 1 }
          : item
      )
    );
  };

  const decreaseItem = (eventId: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.event.id_wydarzenia === eventId
            ? { ...item, count: Math.max(1, item.count - 1) }
            : item
        )
        .filter((item) => item.count > 0)
    );
  };

  const removeItem = (eventId: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.event.id_wydarzenia !== eventId)
    );
  };
  const clearCart = () => {
    setCart([]);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.event.cena * item.count,
    0
  );

  const value: CartContextProps = {
    cart,
    setCart,
    addToCart,
    increaseItem,
    decreaseItem,
    removeItem,
    totalPrice,
    clearCart, // Dodaj clearCart do obiektu value
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
