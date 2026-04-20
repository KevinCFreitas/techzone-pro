export interface Product {
  id: number;
  slug: string;
  name: string;
  seller: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: 'sale' | 'new' | 'hot';
  image: string;
  category: string;
  description: string;
  specs: { label: string; value: string }[];
}

export const products: Product[] = [
  {
    id: 1,
    slug: 'iphone-15-128gb',
    name: 'iPhone 15 128GB',
    seller: 'Apple Premium',
    price: 4299,
    oldPrice: 4799,
    rating: 4.9,
    reviews: 1243,
    badge: 'sale',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/featured-smartphone-Lr8s8DkaVPFjFmzj76PoZ8.webp',
    category: 'Smartphones',
    description: 'O iPhone 15 traz câmera Fusion com zoom óptico 2x, chip A16 Bionic e bateria para o dia inteiro.',
    specs: [
      { label: 'Tela', value: '6.1” Super Retina XDR' },
      { label: 'Armazenamento', value: '128GB' },
      { label: 'Câmera', value: '48MP + 12MP' },
    ],
  },
  {
    id: 2,
    slug: 'samsung-galaxy-s24',
    name: 'Samsung Galaxy S24',
    seller: 'Samsung Store',
    price: 3799,
    oldPrice: 4299,
    rating: 4.8,
    reviews: 876,
    badge: 'sale',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/featured-smartphone-Lr8s8DkaVPFjFmzj76PoZ8.webp',
    category: 'Smartphones',
    description: 'Galaxy S24 com IA integrada, câmera de 50MP e performance de alto nível para jogos e trabalho.',
    specs: [
      { label: 'Tela', value: '6.2” Dynamic AMOLED' },
      { label: 'Processador', value: 'Snapdragon 8 Gen 3' },
      { label: 'RAM', value: '12GB' },
    ],
  },
  {
    id: 3,
    slug: 'xiaomi-redmi-note-13',
    name: 'Xiaomi Redmi Note 13',
    seller: 'MiStore',
    price: 1299,
    rating: 4.5,
    reviews: 412,
    badge: 'new',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/featured-smartphone-Lr8s8DkaVPFjFmzj76PoZ8.webp',
    category: 'Smartphones',
    description: 'Tela AMOLED 120Hz e bateria de 5000mAh em um smartphone de excelente custo-benefício.',
    specs: [
      { label: 'Tela', value: '6.67” AMOLED 120Hz' },
      { label: 'Câmera', value: '108MP' },
      { label: 'Bateria', value: '5000mAh' },
    ],
  },
  {
    id: 4,
    slug: 'macbook-air-m2-256gb',
    name: 'MacBook Air M2 256GB',
    seller: 'Apple Premium',
    price: 8499,
    oldPrice: 9299,
    rating: 5.0,
    reviews: 2103,
    badge: 'hot',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/laptop-workspace-KCB92K8TjCwxh22GUKyPpm.webp',
    category: 'Notebooks',
    description: 'Chip M2, design ultrafino e autonomia para um dia inteiro de produtividade.',
    specs: [
      { label: 'Chip', value: 'Apple M2' },
      { label: 'Memória', value: '8GB' },
      { label: 'Armazenamento', value: '256GB SSD' },
    ],
  },
  {
    id: 5,
    slug: 'notebook-dell-inspiron-i5',
    name: 'Notebook Dell Inspiron i5',
    seller: 'Dell Oficial',
    price: 3199,
    oldPrice: 3799,
    rating: 4.7,
    reviews: 534,
    badge: 'sale',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/laptop-workspace-KCB92K8TjCwxh22GUKyPpm.webp',
    category: 'Notebooks',
    description: 'Notebook versátil para estudo e trabalho com ótimo equilíbrio entre desempenho e preço.',
    specs: [
      { label: 'Processador', value: 'Intel Core i5' },
      { label: 'Memória', value: '8GB' },
      { label: 'Armazenamento', value: '512GB SSD' },
    ],
  },
  {
    id: 6,
    slug: 'airpods-pro-2-geracao',
    name: 'AirPods Pro 2ª Geração',
    seller: 'Apple Premium',
    price: 1799,
    oldPrice: 1999,
    rating: 4.9,
    reviews: 3210,
    badge: 'sale',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/tech-accessories-Dv3YnwVSwuHDreg9tc9rAp.webp',
    category: 'Áudio',
    description: 'Áudio espacial, cancelamento de ruído ativo e conforto para uso diário.',
    specs: [
      { label: 'Cancelamento', value: 'Ativo (ANC)' },
      { label: 'Bateria', value: 'Até 30h com estojo' },
      { label: 'Conexão', value: 'Bluetooth 5.3' },
    ],
  },
  {
    id: 7,
    slug: 'apple-watch-series-9',
    name: 'Apple Watch Series 9',
    seller: 'Apple Premium',
    price: 3199,
    oldPrice: 3599,
    rating: 4.8,
    reviews: 1102,
    badge: 'sale',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/tech-accessories-Dv3YnwVSwuHDreg9tc9rAp.webp',
    category: 'Wearables',
    description: 'Monitoramento de saúde, GPS e tela brilhante com integração total ao ecossistema Apple.',
    specs: [
      { label: 'Tela', value: 'Always-On Retina' },
      { label: 'Resistência', value: 'Água até 50m' },
      { label: 'Conectividade', value: 'GPS + Bluetooth' },
    ],
  },
  {
    id: 8,
    slug: 'ps5-2-controles',
    name: 'PS5 + 2 Controles',
    seller: 'GameZone',
    price: 4299,
    oldPrice: 4799,
    rating: 4.9,
    reviews: 2341,
    badge: 'hot',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663241647868/49kbt9P7NUQXiQVoNv2xMb/tech-accessories-Dv3YnwVSwuHDreg9tc9rAp.webp',
    category: 'Games',
    description: 'Console de última geração com SSD ultrarrápido e imersão completa para seus jogos.',
    specs: [
      { label: 'Armazenamento', value: '825GB SSD' },
      { label: 'Resolução', value: 'Até 4K 120fps' },
      { label: 'Itens inclusos', value: '2 controles DualSense' },
    ],
  },
];

export const getProductById = (id: number) => products.find((product) => product.id === id);
