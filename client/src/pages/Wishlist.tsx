import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { products } from '@/data/products';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';

export default function Wishlist() {
  const [, setLocation] = useLocation();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wishlistProducts = products.filter((product) => wishlist.includes(product.id));

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Heart className="text-red-500" /> Lista de desejos</h1>
          <Button variant="outline" onClick={() => setLocation('/')}>Voltar</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={52} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sua lista está vazia</h2>
            <p className="text-gray-600 mb-6">Adicione produtos para acompanhar preços e ofertas.</p>
            <Button onClick={() => setLocation('/')} className="bg-blue-700 hover:bg-blue-800">Explorar produtos</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <article key={product.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <img src={product.image} alt={product.name} className="w-full h-52 object-cover cursor-pointer" onClick={() => setLocation(`/produto/${product.id}`)} />
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{product.seller}</p>
                  <h3 className="font-semibold text-gray-900 mb-3 cursor-pointer hover:text-blue-700" onClick={() => setLocation(`/produto/${product.id}`)}>{product.name}</h3>
                  <p className="text-2xl font-bold text-blue-700 mb-4">R$ {product.price.toLocaleString('pt-BR')}</p>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-blue-700 hover:bg-blue-800" onClick={() => addToCart(product)}>
                      <ShoppingCart size={16} /> Adicionar
                    </Button>
                    <Button variant="outline" onClick={() => removeFromWishlist(product.id)}><Trash2 size={16} /></Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
