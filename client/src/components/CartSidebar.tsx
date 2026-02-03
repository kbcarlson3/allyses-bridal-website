import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, isCartOpen, closeCart } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/schedule-appointment');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bridal-charcoal-900 bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white z-50 shadow-2xl animate-slide-in overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-bridal-taupe flex items-center justify-between">
          <h2 className="text-2xl font-display text-bridal-charcoal-500">Shopping Cart</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-bridal-taupe transition-colors duration-200 rounded-full"
            aria-label="Close cart"
          >
            <X className="w-6 h-6 text-bridal-charcoal-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-20 h-20 text-bridal-taupe mb-4" />
              <p className="text-lg font-display text-bridal-charcoal-400 mb-2">Your cart is empty</p>
              <p className="text-sm text-bridal-charcoal-300">Add dresses to get started</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.dress.id} className="flex gap-4 pb-6 border-b border-bridal-taupe last:border-0">
                  {/* Image */}
                  <div className="w-24 h-32 flex-shrink-0 bg-bridal-cream overflow-hidden">
                    <img
                      src={item.dress.primary_image_url || '/placeholder-dress.jpg'}
                      alt={item.dress.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-display text-lg text-bridal-charcoal-500 mb-1">
                      {item.dress.name}
                    </h3>
                    <p className="text-bridal-clay-600 font-sans font-medium mb-3">
                      {item.dress.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-auto">
                      <button
                        onClick={() => updateQuantity(item.dress.id, item.quantity - 1)}
                        className="p-1 border border-bridal-charcoal-300 hover:bg-bridal-taupe transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4 text-bridal-charcoal-500" />
                      </button>
                      <span className="w-8 text-center font-sans text-sm text-bridal-charcoal-500">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.dress.id, item.quantity + 1)}
                        className="p-1 border border-bridal-charcoal-300 hover:bg-bridal-taupe transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4 text-bridal-charcoal-500" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.dress.id)}
                    className="text-bridal-charcoal-400 hover:text-red-500 transition-colors text-sm font-sans"
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-bridal-taupe px-8 py-6 bg-bridal-cream">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-display text-bridal-charcoal-500">Total</span>
              <span className="text-2xl font-display text-bridal-charcoal-500">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full btn-primary"
            >
              <span>Schedule Appointment</span>
            </button>
            <p className="text-xs text-center text-bridal-charcoal-400 mt-4">
              Schedule an appointment to try on your selected dresses
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
