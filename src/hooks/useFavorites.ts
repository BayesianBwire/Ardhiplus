import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ardhi_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    }
  }, []);

  // Save to localStorage when favorites change
  useEffect(() => {
    localStorage.setItem('ardhi_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fav) => fav !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isFavorite = (id: number) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
}
