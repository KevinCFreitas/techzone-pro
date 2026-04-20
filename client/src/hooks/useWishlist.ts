import { useState, useEffect } from 'react';

const WISHLIST_STORAGE_KEY = 'techzone_wishlist';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar wishlist do localStorage na montagem
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Erro ao carregar wishlist do localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Salvar wishlist no localStorage sempre que mudar
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      } catch (error) {
        console.error('Erro ao salvar wishlist no localStorage:', error);
      }
    }
  }, [wishlist, isLoaded]);

  const addToWishlist = (productId: number) => {
    setWishlist(prev => {
      if (!prev.includes(productId)) {
        return [...prev, productId];
      }
      return prev;
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist(prev => prev.filter(id => id !== productId));
  };

  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlist.includes(productId);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    isLoaded,
  };
}
