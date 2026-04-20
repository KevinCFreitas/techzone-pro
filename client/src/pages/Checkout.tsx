import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, CheckCircle, Lock, CreditCard, Smartphone } from 'lucide-react';
import { useLocation } from 'wouter';
import { useCart } from '@/hooks/useCart';

interface FormErrors {
  [key: string]: string;
}

interface CheckoutData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  addressNumber: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: 'pix' | 'credit' | 'boleto';
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { cart: cartItems, clearCart } = useCart();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<CheckoutData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    addressNumber: '',
    complement: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'pix',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 200 ? 0 : 29.9;
  const total = subtotal + shipping;

  const validateShipping = () => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Nome completo é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório';
    if (!formData.addressNumber.trim()) newErrors.addressNumber = 'Número é obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors: FormErrors = {};

    if (formData.paymentMethod === 'credit') {
      if (!formData.cardName.trim()) newErrors.cardName = 'Nome do titular é obrigatório';
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Número do cartão é obrigatório';
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Cartão deve ter 16 dígitos';
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Data de validade é obrigatória';
      if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) newErrors.cardExpiry = 'Formato: MM/AA';
      if (!formData.cardCvv.trim()) newErrors.cardCvv = 'CVV é obrigatório';
      if (!/^\d{3,4}$/.test(formData.cardCvv)) newErrors.cardCvv = 'CVV inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = () => {
    if (validateShipping()) {
      setStep('payment');
      setErrors({});
    }
  };

  const handlePaymentSubmit = async () => {
    if (validatePayment()) {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsProcessing(false);
      clearCart();
      setStep('confirmation');
    }
  };

  const handleBackToHome = () => {
    setLocation('/');
  };

  // Redireciona para home se o carrinho estiver vazio
  if (cartItems.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Seu carrinho está vazio</p>
          <Button onClick={handleBackToHome} className="bg-blue-700 hover:bg-blue-800">
            Voltar para a loja
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 animate-fade-in-down">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToHome}
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

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200 py-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            {[
              { step: 'shipping', label: 'Endereço' },
              { step: 'payment', label: 'Pagamento' },
              { step: 'confirmation', label: 'Confirmação' },
            ].map((item, idx) => (
              <div key={item.step} className="flex items-center gap-4">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold transition-smooth
                    ${step === item.step || (step === 'payment' && item.step === 'shipping') || step === 'confirmation'
                      ? 'bg-blue-700 text-white animate-scale-in'
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {step === 'confirmation' && (item.step === 'shipping' || item.step === 'payment') ? (
                    <CheckCircle size={20} />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className={`font-medium ${step === item.step ? 'text-blue-700' : 'text-gray-600'}`}>
                  {item.label}
                </span>
                {idx < 2 && (
                  <div className={`w-12 h-1 ${step === 'confirmation' || (step === 'payment' && idx === 0) ? 'bg-blue-700' : 'bg-gray-200'} transition-smooth`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Step */}
            {step === 'shipping' && (
              <div className="bg-white rounded-lg shadow-md p-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <h2 className="text-2xl font-bold mb-6 animate-fade-in-left">Endereço de Entrega</h2>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                    <Input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full transition-smooth ${errors.fullName ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="João Silva"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div className="animate-fade-in-up" style={{ animationDelay: '350ms' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full transition-smooth ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="joao@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full transition-smooth ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="(11) 99999-9999"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.phone}</p>}
                  </div>

                  {/* Address */}
                  <div className="animate-fade-in-up" style={{ animationDelay: '450ms' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                    <Input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={`w-full transition-smooth ${errors.address ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Rua das Flores"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.address}</p>}
                  </div>

                  {/* Address Number and Complement */}
                  <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                      <Input
                        type="text"
                        value={formData.addressNumber}
                        onChange={(e) => setFormData({ ...formData, addressNumber: e.target.value })}
                        className={`w-full transition-smooth ${errors.addressNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="123"
                      />
                      {errors.addressNumber && <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.addressNumber}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Complemento (Opcional)</label>
                      <Input
                        type="text"
                        value={formData.complement}
                        onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                        className="w-full transition-smooth"
                        placeholder="Apto 45"
                      />
                    </div>
                  </div>

                  {/* City, State, ZipCode */}
                  <div className="grid grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '550ms' }}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                      <Input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className={`w-full transition-smooth ${errors.city ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="São Paulo"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                      <Input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className={`w-full transition-smooth ${errors.state ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="SP"
                        maxLength={2}
                      />
                      {errors.state && <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                      <Input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        className={`w-full transition-smooth ${errors.zipCode ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="01310-100"
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.zipCode}</p>}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleShippingSubmit}
                  className="w-full mt-8 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 transition-smooth hover-lift animate-fade-in-up"
                  style={{ animationDelay: '600ms' }}
                >
                  Continuar para Pagamento
                </Button>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="bg-white rounded-lg shadow-md p-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <h2 className="text-2xl font-bold mb-6 animate-fade-in-left">Método de Pagamento</h2>

                {/* Payment Methods */}
                <div className="space-y-4 mb-8">
                  {[
                    { id: 'pix', label: 'PIX (5% de desconto)', icon: Smartphone },
                    { id: 'credit', label: 'Cartão de Crédito', icon: CreditCard },
                    { id: 'boleto', label: 'Boleto Bancário', icon: Lock },
                  ].map((method, idx) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setFormData({ ...formData, paymentMethod: method.id as any })}
                        className={`
                          p-4 border-2 rounded-lg cursor-pointer transition-smooth hover-lift animate-fade-in-up
                          ${formData.paymentMethod === method.id
                            ? 'border-blue-700 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                        style={{ animationDelay: `${300 + idx * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${formData.paymentMethod === method.id ? 'bg-blue-700 text-white' : 'bg-gray-100'}`}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{method.label}</p>
                            {method.id === 'pix' && <p className="text-sm text-green-600">Economize 5%</p>}
                          </div>
                          <div className={`ml-auto w-5 h-5 rounded-full border-2 ${formData.paymentMethod === method.id ? 'bg-blue-700 border-blue-700' : 'border-gray-300'}`}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Credit Card Form */}
                {formData.paymentMethod === 'credit' && (
                  <div className="space-y-4 mb-8 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                    <h3 className="font-semibold text-gray-900">Dados do Cartão</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Titular</label>
                      <Input
                        type="text"
                        value={formData.cardName}
                        onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                        className={`w-full transition-smooth ${errors.cardName ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="João Silva"
                      />
                      {errors.cardName && <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.cardName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Número do Cartão</label>
                      <Input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                        className={`w-full transition-smooth ${errors.cardNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="1234 5678 9012 3456"
                      />
                      {errors.cardNumber && <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Validade (MM/AA)</label>
                        <Input
                          type="text"
                          value={formData.cardExpiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setFormData({ ...formData, cardExpiry: value });
                          }}
                          className={`w-full transition-smooth ${errors.cardExpiry ? 'border-red-500 focus:ring-red-500' : ''}`}
                          placeholder="12/25"
                        />
                        {errors.cardExpiry && <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.cardExpiry}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <Input
                          type="text"
                          value={formData.cardCvv}
                          onChange={(e) => setFormData({ ...formData, cardCvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          className={`w-full transition-smooth ${errors.cardCvv ? 'border-red-500 focus:ring-red-500' : ''}`}
                          placeholder="123"
                        />
                        {errors.cardCvv && <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.cardCvv}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* PIX Info */}
                {formData.paymentMethod === 'pix' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                    <p className="text-green-900 font-medium">✓ PIX selecionado com 5% de desconto</p>
                    <p className="text-green-700 text-sm mt-1">Você receberá o código PIX na próxima etapa</p>
                  </div>
                )}

                {/* Boleto Info */}
                {formData.paymentMethod === 'boleto' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                    <p className="text-blue-900 font-medium">✓ Boleto selecionado</p>
                    <p className="text-blue-700 text-sm mt-1">Você receberá o código de boleto para pagamento</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep('shipping')}
                    variant="outline"
                    className="flex-1 transition-smooth hover-lift"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handlePaymentSubmit}
                    disabled={isProcessing}
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 transition-smooth hover-lift animate-fade-in-up"
                    style={{ animationDelay: '700ms' }}
                  >
                    {isProcessing ? 'Processando...' : 'Confirmar Pedido'}
                  </Button>
                </div>
              </div>
            )}

            {/* Confirmation Step */}
            {step === 'confirmation' && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="mb-6 animate-bounce-in">
                  <CheckCircle size={64} className="mx-auto text-green-500 animate-pulse-glow" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                  Pedido Confirmado!
                </h2>
                <p className="text-gray-600 mb-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                  Seu pedido foi recebido com sucesso. Você receberá um email de confirmação em breve.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                  <p className="text-sm text-gray-600 mb-2">Número do Pedido</p>
                  <p className="text-2xl font-bold text-blue-700 animate-glow-pulse">#TZ{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>

                <Button
                  onClick={handleBackToHome}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 transition-smooth hover-lift animate-fade-in-up"
                  style={{ animationDelay: '600ms' }}
                >
                  Voltar para a Loja
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 animate-fade-in-right" style={{ animationDelay: '300ms' }}>
              <h3 className="text-lg font-bold mb-6 animate-fade-in-left">Resumo do Pedido</h3>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item, idx) => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-200 animate-fade-in-up" style={{ animationDelay: `${400 + idx * 100}ms` }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded bg-gray-100"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-blue-700 font-bold mt-1">
                        R$ {(item.price * item.qty).toLocaleString('pt-BR')}
                      </p>
                      <p className="text-xs text-gray-600">Qtd: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-gray-200 pt-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Frete</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                    {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                {formData.paymentMethod === 'pix' && (
                  <div className="flex justify-between text-sm text-green-600 font-semibold">
                    <span>Desconto PIX (5%)</span>
                    <span>-R$ {(total * 0.05).toLocaleString('pt-BR')}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200 animate-glow-pulse">
                  <span>Total</span>
                  <span>
                    R$ {(formData.paymentMethod === 'pix' ? total * 0.95 : total).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center gap-2 text-xs text-gray-600 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <Lock size={16} className="text-green-600" />
                <span>Pagamento seguro com SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
