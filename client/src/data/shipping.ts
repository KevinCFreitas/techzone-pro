// Sistema de cálculo de frete por CEP e peso
export interface ShippingRate {
  minZipCode: number;
  maxZipCode: number;
  state: string;
  baseCost: number;
  perKgCost: number;
  estimatedDays: number;
}

// Tabela de frete por região (simplificada por CEP)
export const shippingRates: ShippingRate[] = [
  // São Paulo (01000-19999)
  { minZipCode: 1000, maxZipCode: 19999, state: 'SP', baseCost: 15, perKgCost: 0.5, estimatedDays: 1 },
  // Rio de Janeiro (20000-28999)
  { minZipCode: 20000, maxZipCode: 28999, state: 'RJ', baseCost: 20, perKgCost: 0.7, estimatedDays: 2 },
  // Minas Gerais (30000-39999)
  { minZipCode: 30000, maxZipCode: 39999, state: 'MG', baseCost: 25, perKgCost: 0.8, estimatedDays: 2 },
  // Espírito Santo (29000-29999)
  { minZipCode: 29000, maxZipCode: 29999, state: 'ES', baseCost: 22, perKgCost: 0.6, estimatedDays: 2 },
  // Bahia (40000-48999)
  { minZipCode: 40000, maxZipCode: 48999, state: 'BA', baseCost: 30, perKgCost: 1.0, estimatedDays: 3 },
  // Pernambuco (50000-56999)
  { minZipCode: 50000, maxZipCode: 56999, state: 'PE', baseCost: 32, perKgCost: 1.1, estimatedDays: 3 },
  // Ceará (60000-63999)
  { minZipCode: 60000, maxZipCode: 63999, state: 'CE', baseCost: 35, perKgCost: 1.2, estimatedDays: 3 },
  // Pará (66000-68999)
  { minZipCode: 66000, maxZipCode: 68999, state: 'PA', baseCost: 40, perKgCost: 1.5, estimatedDays: 4 },
  // Amazonas (69000-69999)
  { minZipCode: 69000, maxZipCode: 69999, state: 'AM', baseCost: 50, perKgCost: 2.0, estimatedDays: 5 },
  // Paraná (80000-87999)
  { minZipCode: 80000, maxZipCode: 87999, state: 'PR', baseCost: 20, perKgCost: 0.6, estimatedDays: 2 },
  // Santa Catarina (88000-89999)
  { minZipCode: 88000, maxZipCode: 89999, state: 'SC', baseCost: 22, perKgCost: 0.7, estimatedDays: 2 },
  // Rio Grande do Sul (90000-99999)
  { minZipCode: 90000, maxZipCode: 99999, state: 'RS', baseCost: 25, perKgCost: 0.8, estimatedDays: 2 },
  // Goiás (73000-76999)
  { minZipCode: 73000, maxZipCode: 76999, state: 'GO', baseCost: 28, perKgCost: 0.9, estimatedDays: 3 },
  // Distrito Federal (70000-72799)
  { minZipCode: 70000, maxZipCode: 72799, state: 'DF', baseCost: 28, perKgCost: 0.9, estimatedDays: 2 },
  // Mato Grosso do Sul (79000-79999)
  { minZipCode: 79000, maxZipCode: 79999, state: 'MS', baseCost: 30, perKgCost: 1.0, estimatedDays: 3 },
  // Mato Grosso (78000-78899)
  { minZipCode: 78000, maxZipCode: 78899, state: 'MT', baseCost: 32, perKgCost: 1.1, estimatedDays: 3 },
  // Tocantins (77000-77999)
  { minZipCode: 77000, maxZipCode: 77999, state: 'TO', baseCost: 35, perKgCost: 1.2, estimatedDays: 3 },
  // Maranhão (65000-65999)
  { minZipCode: 65000, maxZipCode: 65999, state: 'MA', baseCost: 33, perKgCost: 1.1, estimatedDays: 3 },
  // Piauí (64000-64999)
  { minZipCode: 64000, maxZipCode: 64999, state: 'PI', baseCost: 34, perKgCost: 1.2, estimatedDays: 3 },
  // Rio Grande do Norte (59000-59999)
  { minZipCode: 59000, maxZipCode: 59999, state: 'RN', baseCost: 33, perKgCost: 1.1, estimatedDays: 3 },
  // Paraíba (58000-58999)
  { minZipCode: 58000, maxZipCode: 58999, state: 'PB', baseCost: 33, perKgCost: 1.1, estimatedDays: 3 },
  // Alagoas (57000-57999)
  { minZipCode: 57000, maxZipCode: 57999, state: 'AL', baseCost: 32, perKgCost: 1.0, estimatedDays: 3 },
  // Sergipe (49000-49999)
  { minZipCode: 49000, maxZipCode: 49999, state: 'SE', baseCost: 31, perKgCost: 1.0, estimatedDays: 3 },
  // Acre (69900-69999)
  { minZipCode: 69900, maxZipCode: 69999, state: 'AC', baseCost: 55, perKgCost: 2.2, estimatedDays: 5 },
  // Roraima (69300-69399)
  { minZipCode: 69300, maxZipCode: 69399, state: 'RR', baseCost: 60, perKgCost: 2.5, estimatedDays: 5 },
  // Amapá (68900-68999)
  { minZipCode: 68900, maxZipCode: 68999, state: 'AP', baseCost: 52, perKgCost: 2.1, estimatedDays: 5 },
];

// Peso médio dos produtos em kg (para cálculo de frete)
export const productWeights: { [key: number]: number } = {
  1: 0.2, // iPhone 15
  2: 0.2, // Samsung Galaxy S24
  3: 0.2, // Xiaomi Redmi Note 13
  4: 1.5, // MacBook Air
  5: 2.0, // Dell Inspiron
  6: 0.1, // AirPods Pro
  7: 0.05, // Apple Watch
  8: 0.5, // PS5
};

export function getShippingRate(zipCode: string): ShippingRate | null {
  // Remover caracteres especiais do CEP
  const cleanZip = zipCode.replace(/\D/g, '');
  const zipNum = parseInt(cleanZip, 10);

  // Encontrar a faixa de CEP correspondente
  const rate = shippingRates.find(
    (r) => zipNum >= r.minZipCode && zipNum <= r.maxZipCode
  );

  return rate || null;
}

export function calculateShippingCost(
  zipCode: string,
  subtotal: number,
  totalWeight: number = 0.5
): { cost: number; estimatedDays: number; state: string } | null {
  const rate = getShippingRate(zipCode);

  if (!rate) {
    return null;
  }

  // Frete grátis para compras acima de R$ 200
  if (subtotal >= 200) {
    return {
      cost: 0,
      estimatedDays: rate.estimatedDays,
      state: rate.state,
    };
  }

  // Cálculo: custo base + custo por kg
  const cost = rate.baseCost + rate.perKgCost * totalWeight;

  return {
    cost: Math.round(cost * 100) / 100, // Arredondar para 2 casas decimais
    estimatedDays: rate.estimatedDays,
    state: rate.state,
  };
}

export function getTotalWeight(cartItems: any[]): number {
  return cartItems.reduce((total, item) => {
    const weight = productWeights[item.id] || 0.5;
    return total + weight * item.qty;
  }, 0);
}
