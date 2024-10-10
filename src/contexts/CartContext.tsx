// CartContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface Product {
  id: number;
  name: string;
  code: string;
  img: string;
  price: number;
  selectedSize?: string;
  quantity?: number;
}

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  updateCartItem: (productId: number, updates: Partial<Product>) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const cartDoc = doc(db, 'carts', user.uid);
        // Set up a real-time listener to the user's cart
        const unsubscribeCart = onSnapshot(cartDoc, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setCartItems(docSnapshot.data().items || []);
          } else {
            setCartItems([]);
          }
        });

        // Cleanup listener on unmount or when user changes
        return () => {
          unsubscribeCart();
        };
      } else {
        // If no user is authenticated, clear the cart
        setCartItems([]);
      }
    });

    // Cleanup auth listener on unmount
    return () => {
      unsubscribeAuth();
    };
  }, []);

  const addToCart = async (product: Product) => {
    try {
      const user = auth.currentUser;
      console.log("user ahgcjvklkjh", user);
      
      if (user) {
        const cartDoc = doc(db, 'carts', user.uid);
        const cartSnapshot = await getDoc(cartDoc);

        let updatedCartItems: Product[] = cartSnapshot.exists() ? cartSnapshot.data().items : [];

        const productIndex = updatedCartItems.findIndex(item => item.id === product.id);

        if (productIndex === -1) {
          updatedCartItems.push({ ...product, quantity: 1 });
        } else {
          updatedCartItems[productIndex].quantity = (updatedCartItems[productIndex].quantity || 1) + 1;
        }

        await setDoc(cartDoc, { items: updatedCartItems });
        // setCartItems(updatedCartItems); // Optional: Remove if using onSnapshot
      } else {
        console.warn('User is not authenticated. Cannot add to cart.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Optionally, implement error state to notify the user
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const cartDoc = doc(db, 'carts', user.uid);
        const cartSnapshot = await getDoc(cartDoc);

        if (cartSnapshot.exists()) {
          let updatedCartItems: Product[] = cartSnapshot.data().items || [];
          updatedCartItems = updatedCartItems.filter(item => item.id !== productId);

          await setDoc(cartDoc, { items: updatedCartItems });
          // setCartItems(updatedCartItems); // Optional: Remove if using onSnapshot
        }
      } else {
        console.warn('User is not authenticated. Cannot remove from cart.');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Optionally, implement error state to notify the user
    }
  };

  const clearCart = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const cartDoc = doc(db, 'carts', user.uid);
        await setDoc(cartDoc, { items: [] });
        // setCartItems([]); // Optional: Remove if using onSnapshot
      } else {
        console.warn('User is not authenticated. Cannot clear cart.');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Optionally, implement error state to notify the user
    }
  };

  const updateCartItem = async (productId: number, updates: Partial<Product>) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const cartDoc = doc(db, 'carts', user.uid);
        const cartSnapshot = await getDoc(cartDoc);

        if (cartSnapshot.exists()) {
          let updatedCartItems: Product[] = cartSnapshot.data().items || [];
          const productIndex = updatedCartItems.findIndex(item => item.id === productId);

          if (productIndex !== -1) {
            updatedCartItems[productIndex] = { ...updatedCartItems[productIndex], ...updates };
            await setDoc(cartDoc, { items: updatedCartItems });
            // setCartItems(updatedCartItems); // Optional: Remove if using onSnapshot
          }
        }
      } else {
        console.warn('User is not authenticated. Cannot update cart item.');
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      // Optionally, implement error state to notify the user
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateCartItem }}>
      {children}
    </CartContext.Provider>
  );
};
