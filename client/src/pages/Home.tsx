import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Heart, Star, Search, ChevronRight, Zap, Truck, Shield, Clock } from 'lucide-react';

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
  },
  {
    id: 5,
    name: 'Notebook Dell Inspiron i5',
    seller: 'Dell Oficial',
    price: 3199,
    oldPrice: 3799,
    rating: 4.7,
    reviews: 534,
    badge: 'sale',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/laptop-workspace-KCB92K8TjCwxh22GUKyPpm.webp',
    category: 'Notebooks',
  },
  {
    id: 6,
    name: 'AirPods Pro 2ª Geração',
    seller: 'Apple Premium',
    price: 1799,
    oldPrice: 1999,
    rating: 4.9,
    reviews: 3210,
    badge: 'sale',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/tech-accessories-Dv3YnwVSwuHDreg9tc9rAp.webp',
    category: 'Áudio',
  },
  {
    id: 7,
    name: 'Apple Watch Series 9',
    seller: 'Apple Premium',
    price: 3199,
    oldPrice: 3599,
    rating: 4.8,
    reviews: 1102,
    badge: 'sale',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/tech-accessories-Dv3YnwVSwuHDreg9tc9rAp.webp',
    category: 'Wearables',
  },
  {
    id: 8,
    name: 'PS5 + 2 Controles',
    seller: 'GameZone',
    price: 4299,
    oldPrice: 4799,
    rating: 4.9,
    reviews: 2341,
    badge: 'hot',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/tech-accessories-Dv3YnwVSwuHDreg9tc9rAp.webp',
    category: 'Games',
  },
];

const categories = ['Todos', 'Smartphones', 'Notebooks', 'Áudio', 'Games', 'Wearables', 'Câmeras', 'Acessórios'];

export default function Home() {
  const [cart, setCart] = useState<(Product & { qty: number })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('default');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredProducts = products
    .filter(p => {
      const matchCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.seller.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev =>
        prev.map(item => item.id === productId ? { ...item, qty } : item)
      );
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const renderStars = (rating: number) => {
    const filled = Math.floor(rating);
    const empty = 5 - filled;
    return (
      <div className="flex items-center gap-1">
        {Array(filled).fill(0).map((_, i) => (
          <Star key={`filled-${i}`} size={14} className="fill-amber-400 text-amber-400" />
        ))}
        {Array(empty).fill(0).map((_, i) => (
          <Star key={`empty-${i}`} size={14} className="text-gray-300" />
        ))}
        <span className="text-xs text-gray-600 ml-1">{rating}</span>
      </div>
    );
  };

  const getBadgeStyles = (badge?: string) => {
    switch (badge) {
      case 'sale':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'new':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'hot':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      default:
        return '';
    }
  };

  const getBadgeText = (badge?: string) => {
    switch (badge) {
      case 'sale':
        return `−${Math.round((1 - (products.find(p => p.id)?.price || 0) / (products.find(p => p.id)?.oldPrice || 1)) * 100)}%`;
      case 'new':
        return 'Novo';
      case 'hot':
        return '🔥 Hot';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold">
                <span className="text-blue-700">Tech</span>
                <span className="text-blue-600">Zone</span>
              </h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar produtos, marcas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section
        className="relative h-96 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/hero-tech-banner-QbMo5Hnw7kDsqXofRLG56o.webp')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-2xl">
            Tecnologia no melhor preço
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-xl">
            Smartphones, notebooks, fones, gadgets e muito mais. Frete grátis acima de R$ 200.
          </p>
          <div className="flex gap-4">
            <Button className="bg-white text-blue-700 hover:bg-gray-100 font-semibold">
              Ver ofertas
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/20">
              Lançamentos <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-8 border-b border-blue-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-blue-700 p-3 rounded-lg">
                <Truck size={24} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Frete Grátis</p>
                <p className="text-sm text-gray-600">Acima de R$ 200</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-700 p-3 rounded-lg">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Garantia</p>
                <p className="text-sm text-gray-600">30 dias de troca</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-700 p-3 rounded-lg">
                <Zap size={24} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Entrega Rápida</p>
                <p className="text-sm text-gray-600">24h em São Paulo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-700 p-3 rounded-lg">
                <Clock size={24} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Atendimento</p>
                <p className="text-sm text-gray-600">24h por dia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'Todos' ? 'Todos os produtos' : selectedCategory}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{filteredProducts.length} produtos encontrados</p>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="default">Relevância</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="rating">Melhor avaliados</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map(product => {
            const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
            return (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Image Container */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getBadgeStyles(product.badge)}`}>
                      {product.badge === 'sale' ? `−${discount}%` : product.badge === 'new' ? 'Novo' : '🔥 Hot'}
                    </div>
                  )}
                  <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
                    <Heart size={18} className="text-gray-400 hover:text-red-500" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col h-full">
                  <p className="text-xs text-gray-500 mb-2">{product.seller}</p>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">{product.name}</h3>

                  {/* Rating */}
                  <div className="mb-3">
                    {renderStars(product.rating)}
                    <p className="text-xs text-gray-500 mt-1">({product.reviews.toLocaleString('pt-BR')} avaliações)</p>
                  </div>

                  {/* Price */}
                  <div className="mb-4 mt-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-blue-700">
                        R$ {product.price.toLocaleString('pt-BR')}
                      </span>
                      {product.oldPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          R$ {product.oldPrice.toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      ou 12x R$ {(product.price / 12).toFixed(2).replace('.', ',')} sem juros
                    </p>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                  >
                    Adicionar ao carrinho
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsCartOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
            {/* Cart Header */}
            <div className="bg-blue-700 text-white p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">Meu carrinho</h3>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-white hover:bg-blue-800 p-1 rounded transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Seu carrinho está vazio</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded bg-gray-100"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                        <p className="text-blue-700 font-bold mt-1">
                          R$ {(item.price * item.qty).toLocaleString('pt-BR')}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                          >
                            −
                          </button>
                          <span className="text-sm font-semibold">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-gray-400 hover:text-red-500 text-sm"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>R$ {cartTotal.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Frete</span>
                    <span className="text-green-700 font-semibold">Grátis</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>R$ {cartTotal.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3">
                  Finalizar compra
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-blue-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">TechZone</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Sobre nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog de tech</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trabalhe conosco</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Atendimento</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Central de ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trocas e devoluções</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rastrear pedido</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Garantia</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Categorias</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Smartphones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Notebooks</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Games</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Acessórios</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Pagamento</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">PIX (5% desconto)</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cartão em 12x</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Boleto bancário</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 pt-8 text-center text-sm text-blue-300">
            <p>© 2026 TechZone — Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
