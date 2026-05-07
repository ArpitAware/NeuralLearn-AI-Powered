import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  cartItems: JSON.parse(localStorage.getItem('nl_cart')     || '[]'),
  wishlist:  JSON.parse(localStorage.getItem('nl_wishlist') || '[]'),

  addToCart: (course) => {
    const items = get().cartItems;
    if (items.find(c => c._id === course._id)) return;
    const updated = [...items, course];
    localStorage.setItem('nl_cart', JSON.stringify(updated));
    set({ cartItems: updated });
  },

  removeFromCart: (id) => {
    const updated = get().cartItems.filter(c => c._id !== id);
    localStorage.setItem('nl_cart', JSON.stringify(updated));
    set({ cartItems: updated });
  },

  clearCart: () => {
    localStorage.setItem('nl_cart', '[]');
    set({ cartItems: [] });
  },

  isInCart: (id) => get().cartItems.some(c => c._id === id),

  toggleWishlist: (course) => {
    const list    = get().wishlist;
    const exists  = list.find(c => c._id === course._id);
    const updated = exists
      ? list.filter(c => c._id !== course._id)
      : [...list, course];
    localStorage.setItem('nl_wishlist', JSON.stringify(updated));
    set({ wishlist: updated });
  },

  isInWishlist: (id) => get().wishlist.some(c => c._id === id),

  cartTotal: () => get().cartItems.reduce((sum, c) => sum + (c.price || 0), 0),
  cartCount: () => get().cartItems.length,
}));

export default useCartStore;
