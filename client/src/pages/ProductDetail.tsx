import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Heart, Star, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import { useLocation } from 'wouter';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import Toast, { ToastMessage, ToastType } from '@/components/Toast';

interface Product {
  id: number;
  name: string;
  seller: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: 'sale' | 'new' | 'hot';
  image: string;
  category: string;
  description?: string;
  specs?: { label: string; value: string }[];
}

const products: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 128GB',
    seller: 'Apple Premium',
    price: 4299,
    oldPrice: 4799,
    rating: 4.9,
    reviews: 1243,
    badge: 'sale',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/featured-smartphone-Lr8s8DkaVPFjFmzj76PoZ8.webp',
    category: 'Smartphones',
    description: 'O iPhone 15 traz a câmera Fusion com zoom óptico 2x, o chip A17 Pro e a bateria que dura o dia todo. Tudo em um design resistente e elegante.',
    specs: [
      { label: 'Tela', value: '6.1 polegadas Super Retina XDR' },
      { label: 'Processador', value: 'Apple A17 Pro' },
      { label: 'Câmera', value: '48MP + 12MP' },
      { label: 'Bateria', value: 'Até 20 horas' },
      { label: 'Armazenamento', value: '128GB' },
    ],
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24',
    seller: 'Samsung Store',
    price: 3799,
    oldPrice: 4299,
    rating: 4.8,
    reviews: 876,
    badge: 'sale',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/featured-smartphone-Lr8s8DkaVPFjFmzj76PoZ8.webp',
    category: 'Smartphones',
    description: 'Galaxy S24 com IA integrada, câmera de 50MP e processador Snapdragon 8 Gen 3. Performance excepcional para tudo.',
    specs: [
      { label: 'Tela', value: '6.2 polegadas Dynamic AMOLED' },
      { label: 'Processador', value: 'Snapdragon 8 Gen 3' },
      { label: 'Câmera', value: '50MP + 12MP + 10MP' },
      { label: 'Bateria', value: 'Até 22 horas' },
      { label: 'RAM', value: '12GB' },
    ],
  },
  {
    id: 3,
    name: 'Xiaomi Redmi Note 13',
    seller: 'MiStore',
    price: 1299,
    rating: 4.5,
    reviews: 412,
    badge: 'new',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/featured-smartphone-Lr8s8DkaVPFjFmzj76PoZ8.webp',
    category: 'Smartphones',
    description: 'Redmi Note 13 com tela AMOLED 120Hz, bateria de 5000mAh e câmera de 108MP. Melhor custo-benefício.',
    specs: [
      { label: 'Tela', value: '6.67 polegadas AMOLED 120Hz' },
      { label: 'Processador', value: 'MediaTek Helio G99' },
      { label: 'Câmera', value: '108MP + 8MP' },
      { label: 'Bateria', value: '5000mAh' },
      { label: 'RAM', value: '8GB' },
    ],
  },
  {
    id: 4,
    name: 'MacBook Air M2 256GB',
    seller: 'Apple Premium',
    price: 8499,
    oldPrice: 9299,
    rating: 5.0,
    reviews: 2103,
    badge: 'hot',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/laptop-workspace-KCB92K8TjCwxh22GUKyPpm.webp',
    category: 'Notebooks',
    description: 'MacBook Air com chip M2, até 15 horas de bateria e design ultrafino. Perfeito para criadores.',
    specs: [
      { label: 'Processador', value: 'Apple M2' },
      { label: 'Memória', value: '8GB' },
      { label: 'Armazenamento', value: '256GB SSD' },
      { label: 'Tela', value: '13.6 polegadas Liquid Retina' },
      { label: 'Bateria', value: 'Até 15 horas' },
    ],
  },
];

export default function ProductDetail() {
  const [, setLocation] = useLocation();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [quantity, setQuantity] = useState(1);

  const productId = parseInt(new URLSearchParams(window.location.search).get('id') || '1');
  const product = products.find(p => p.id === productId) || products[0];

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration: 4000 }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    addToast(`✓ ${quantity}x ${product.name} adicionado ao carrinho!`, 'success');
    setQuantity(1);
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    if (isInWishlist(product.id)) {
      addToast(`Removido da lista de desejos`, 'info');
    } else {
      addToast(`Adicionado à lista de desejos`, 'success');
    }
  };

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-white">
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 animate-fade-in-down">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation('/')}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-smooth hover-lift"
            >
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

      {/* Product Detail */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Image Section */}
          <div className="animate-fade-in-left" style={{ animationDelay: '100ms' }}>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden h-96 md:h-full">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-smooth duration-500"
              />
              {product.badge && (
                <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold animate-bounce-in ${
                  product.badge === 'sale' ? 'bg-red-100 text-red-700' :
                  product.badge === 'new' ? 'bg-green-100 text-green-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {product.badge === 'sale' ? `−${discount}%` : product.badge === 'new' ? 'Novo' : '🔥 Hot'}
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="animate-fade-in-right" style={{ animationDelay: '100ms' }}>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                {product.seller} • {product.category}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center gap-1">
                  {Array(Math.floor(product.rating)).fill(0).map((_, i) => (
                    <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900">{product.rating}</span>
                <span className="text-gray-600">({product.reviews.toLocaleString('pt-BR')} avaliações)</span>
              </div>

              {/* Price */}
              <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-blue-700 animate-glow-pulse">
                    R$ {product.price.toLocaleString('pt-BR')}
                  </span>
                  {product.oldPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      R$ {product.oldPrice.toLocaleString('pt-BR')}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                  ou 12x R$ {(product.price / 12).toFixed(2).replace('.', ',')} sem juros
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 leading-relaxed animate-fade-in-up" style={{ animationDelay: '450ms' }}>
                {product.description}
              </p>

              {/* Quantity */}
              <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-smooth hover-scale"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-smooth hover-scale"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '550ms' }}>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 flex items-center justify-center gap-2 transition-smooth hover-lift"
                >
                  <ShoppingCart size={20} />
                  Adicionar ao Carrinho
                </Button>
                <Button
                  onClick={handleWishlist}
                  variant="outline"
                  className={`px-6 py-3 transition-smooth hover-lift ${
                    isInWishlist(product.id)
                      ? 'bg-red-50 border-red-300 text-red-700'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <Heart
                    size={20}
                    className={isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}
                  />
                </Button>
              </div>

              {/* Benefits */}
              <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Truck size={20} className="text-blue-700 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Frete Grátis</p>
                    <p className="text-sm text-gray-600">Acima de R$ 200</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Shield size={20} className="text-green-700 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Garantia</p>
                    <p className="text-sm text-gray-600">30 dias de troca</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <RotateCcw size={20} className="text-purple-700 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Devoluções</p>
                    <p className="text-sm text-gray-600">Até 30 dias</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specs && (
          <div className="bg-gray-50 rounded-lg p-8 mb-12 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Especificações Técnicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.specs.map((spec, idx) => (
                <div key={spec.label} className="animate-fade-in-up" style={{ animationDelay: `${800 + idx * 100}ms` }}>
                  <p className="text-sm text-gray-600 mb-1">{spec.label}</p>
                  <p className="text-lg font-semibold text-gray-900">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        <div className="animate-fade-in-up" style={{ animationDelay: '1200ms' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4).map((relatedProduct, idx) => (
              <div
                key={relatedProduct.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-smooth hover-lift group animate-fade-in-up cursor-pointer"
                onClick={() => setLocation(`/product?id=${relatedProduct.id}`)}
                style={{ animationDelay: `${1300 + idx * 100}ms` }}
              >
                <div className="relative h-40 bg-gray-100 overflow-hidden">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{relatedProduct.name}</h3>
                  <p className="text-blue-700 font-bold">R$ {relatedProduct.price.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
