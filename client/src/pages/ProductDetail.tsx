import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Heart, Star, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import { useLocation, useRoute } from 'wouter';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import Toast, { ToastMessage, ToastType } from '@/components/Toast';
import { getProductById } from '@/data/products';

export default function ProductDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/produto/:id');
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [quantity, setQuantity] = useState(1);

  const productId = match ? Number(params.id) : NaN;
  const product = useMemo(() => getProductById(productId), [productId]);

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration: 4000 }]);
  };

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Produto não encontrado</h1>
          <Button onClick={() => setLocation('/')} className="bg-blue-700 hover:bg-blue-800">
            Voltar para a vitrine
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    addToast(`✓ ${quantity}x ${product.name} adicionado ao carrinho!`, 'success');
    setQuantity(1);
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    addToast(isInWishlist(product.id) ? 'Removido da lista de desejos' : 'Adicionado à lista de desejos', 'info');
  };

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-white">
      <Toast toasts={toasts} onRemove={removeToast} />

      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation('/')} className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-smooth">
              <ChevronLeft size={20} />
              Voltar
            </button>
            <h1 className="text-2xl font-bold">
              <span className="text-blue-700">Tech</span>
              <span className="text-blue-600">Zone</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden h-96 md:h-full">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.badge && (
              <div className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold bg-white/90 text-blue-700">
                {product.badge === 'sale' ? `−${discount}%` : product.badge === 'new' ? 'Novo' : '🔥 Hot'}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">{product.seller} • {product.category}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {Array(Math.floor(product.rating)).fill(0).map((_, i) => (
                  <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-gray-600">{product.rating} ({product.reviews.toLocaleString('pt-BR')} avaliações)</span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-blue-700">R$ {product.price.toLocaleString('pt-BR')}</span>
                {product.oldPrice && <span className="text-xl text-gray-500 line-through">R$ {product.oldPrice.toLocaleString('pt-BR')}</span>}
              </div>
              <p className="text-gray-600 text-sm">ou 12x R$ {(product.price / 12).toFixed(2).replace('.', ',')} sem juros</p>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">−</button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">+</button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <Button onClick={handleAddToCart} className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 flex items-center justify-center gap-2">
                <ShoppingCart size={20} />
                Adicionar ao Carrinho
              </Button>
              <Button onClick={handleWishlist} variant="outline" className="px-4">
                <Heart size={20} className={isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''} />
              </Button>
            </div>

            <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-sm text-gray-700"><Truck size={16} className="text-blue-700" /> Frete grátis acima de R$ 200</div>
              <div className="flex items-center gap-2 text-sm text-gray-700"><Shield size={16} className="text-blue-700" /> Garantia de 12 meses</div>
              <div className="flex items-center gap-2 text-sm text-gray-700"><RotateCcw size={16} className="text-blue-700" /> Troca fácil em até 30 dias</div>
            </div>
          </div>
        </div>

        <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Especificações</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.specs.map((spec) => (
              <div key={spec.label} className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500">{spec.label}</p>
                <p className="text-sm font-semibold text-gray-900">{spec.value}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
