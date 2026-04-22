import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, ShoppingCart, Trash2, ChevronLeft, Truck, Search, Star, Info } from 'lucide-react';
import { useLocation } from 'wouter';
import { products } from '@/data/products';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/contexts/CartContext';
import { calculateShippingCost, getTotalWeight } from '@/data/shipping';
import Toast, { ToastMessage, ToastType } from '@/components/Toast';

export default function Wishlist() {
  const [, setLocation] = useLocation();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [zipCode, setZipCode] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const wishlistProducts = useMemo(() => 
    products.filter((product) => wishlist.includes(product.id)),
    [wishlist]
  );

  const subtotal = useMemo(() => 
    wishlistProducts.reduce((sum, p) => sum + p.price, 0),
    [wishlistProducts]
  );

  const shippingInfo = useMemo(() => {
    if (!zipCode || zipCode.length < 8) return null;
    return calculateShippingCost(zipCode, subtotal, getTotalWeight(wishlistProducts.map(p => ({ ...p, qty: 1 }))));
  }, [zipCode, subtotal, wishlistProducts]);

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration: 4000 }]);
  };

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const handleAddToCart = (product: any) => {
    addToCart(product);
    addToast(`✓ ${product.name} adicionado ao carrinho!`, 'success');
  };

  const handleRemove = (id: number, name: string) => {
    removeFromWishlist(id);
    addToast(`${name} removido da lista`, 'info');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast toasts={toasts} onRemove={removeToast} />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm animate-fade-in-down">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLocation('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-smooth text-gray-600"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="text-red-500 fill-red-500 animate-pulse-glow" size={28} /> 
              Meus Desejos
            </h1>
          </div>
          <div className="text-sm text-gray-500 font-medium hidden sm:block">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item salvo' : 'itens salvos'}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200 animate-fade-in-up">
            <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={48} className="text-red-200" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sua lista está vazia</h2>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">Salve seus produtos favoritos para acompanhar preços e disponibilidade.</p>
            <Button 
              onClick={() => setLocation('/')} 
              className="bg-blue-700 hover:bg-blue-800 px-8 py-6 text-lg rounded-xl transition-smooth hover-lift"
            >
              Explorar Loja
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de Produtos */}
            <div className="lg:col-span-2 space-y-4">
              {wishlistProducts.map((product, idx) => (
                <article 
                  key={product.id} 
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-smooth animate-fade-in-left"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row p-4 gap-4">
                    <div className="w-full sm:w-40 h-40 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative group">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-smooth cursor-pointer" 
                        onClick={() => setLocation(`/produto/${product.id}`)} 
                      />
                      {product.badge && (
                        <span className="absolute top-2 left-2 bg-blue-700 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">{product.seller}</p>
                        <button 
                          onClick={() => handleRemove(product.id, product.name)}
                          className="text-gray-400 hover:text-red-500 transition-smooth p-1 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <h3 
                        className="font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-700 transition-smooth line-clamp-1"
                        onClick={() => setLocation(`/produto/${product.id}`)}
                      >
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-1 mb-3">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-extrabold text-blue-700">R$ {product.price.toLocaleString('pt-BR')}</p>
                          {product.oldPrice && (
                            <p className="text-xs text-gray-400 line-through">R$ {product.oldPrice.toLocaleString('pt-BR')}</p>
                          )}
                        </div>
                        <Button 
                          className="bg-blue-700 hover:bg-blue-800 rounded-xl px-4 transition-smooth hover-lift flex gap-2"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart size={18} />
                          <span className="hidden sm:inline">Adicionar</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Sidebar de Resumo e Frete */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24 animate-fade-in-right">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Truck size={20} className="text-blue-700" /> Simular Frete
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="Digite seu CEP (ex: 01310100)" 
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      className="pr-10 h-12 rounded-xl border-gray-200 focus:ring-blue-500 transition-smooth"
                    />
                    <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  
                  {shippingInfo ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 animate-scale-in">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Estado:</span>
                        <span className="text-sm font-bold text-blue-700">{shippingInfo.state}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Custo:</span>
                        <span className={`text-sm font-bold ${shippingInfo.cost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                          {shippingInfo.cost === 0 ? 'GRÁTIS' : `R$ ${shippingInfo.cost.toLocaleString('pt-BR')}`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Prazo:</span>
                        <span className="text-sm font-bold text-gray-900">{shippingInfo.estimatedDays} dia(s)</span>
                      </div>
                    </div>
                  ) : zipCode.length === 8 ? (
                    <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 p-3 rounded-xl">
                      <Info size={14} /> CEP não localizado ou fora da área de cobertura.
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 px-1">Informe o CEP para ver prazos e custos para todos os itens.</p>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal ({wishlistProducts.length} itens)</span>
                    <span>R$ {subtotal.toLocaleString('pt-BR')}</span>
                  </div>
                  {shippingInfo && (
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Frete estimado</span>
                      <span className={shippingInfo.cost === 0 ? 'text-green-600' : ''}>
                        {shippingInfo.cost === 0 ? 'Grátis' : `R$ ${shippingInfo.cost.toLocaleString('pt-BR')}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-blue-700">R$ {(subtotal + (shippingInfo?.cost || 0)).toLocaleString('pt-BR')}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => setLocation('/')}
                  variant="outline"
                  className="w-full mt-6 rounded-xl py-6 border-blue-200 text-blue-700 hover:bg-blue-50 transition-smooth"
                >
                  Continuar Comprando
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Minimalista */}
      <footer className="bg-white border-t border-gray-200 mt-20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">© 2026 TechZone — Sua lista de desejos sincronizada em todos os dispositivos.</p>
        </div>
      </footer>
    </div>
  );
}
