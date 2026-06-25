import { NextResponse } from 'next/server';

// Type definitions
interface ExchangeRates {
  base: string;
  timestamp: string;
  rates: {
    EUR: number;
    USD: number;
    CAD: number;
  };
}

interface SICAVFund {
  id: string;
  name_fr: string;
  name_en: string;
  name_ar: string;
  value: number;
  performance: number;
  currency: string;
}

interface ExchangeRateResponse {
  rates: {
    EUR: number;
    USD: number;
    CAD: number;
  };
}

interface APIResponse {
  success: boolean;
  exchangeRates: ExchangeRates;
  sicavFunds: SICAVFund[];
  updatedAt: string;
}

interface ErrorResponse {
  success: boolean;
  error: string;
}

// SICAV Fund Data
const SICAV_FUNDS: SICAVFund[] = [
  {
    id: 'sicav-diversif',
    name_fr: 'SICAV Diversification',
    name_en: 'SICAV Diversification',
    name_ar: 'صندوق التنويع',
    value: 1245.50,
    performance: 5.2,
    currency: 'TND',
  },
  {
    id: 'sicav-actions',
    name_fr: 'SICAV Actions Monde',
    name_en: 'SICAV Global Equities',
    name_ar: 'صندوق الأسهم العالمية',
    value: 2850.75,
    performance: 8.7,
    currency: 'TND',
  },
  {
    id: 'sicav-obligations',
    name_fr: 'SICAV Obligations',
    name_en: 'SICAV Bonds',
    name_ar: 'صندوق السندات',
    value: 950.25,
    performance: 2.1,
    currency: 'TND',
  },
];

// Cache exchange rates for 1 hour
let cachedRates: ExchangeRates | null = null;
let cacheTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

async function fetchExchangeRates(): Promise<ExchangeRates> {
  const now = Date.now();
  
  // Return cached rates if still valid
  if (cachedRates && now - cacheTime < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    // Fetch from frankfurter.app API
    // This API provides free exchange rates without authentication
    const response = await fetch('https://api.frankfurter.app/latest?from=TND&to=EUR,USD,CAD', {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }

    const data: ExchangeRateResponse = await response.json();
    
    // Transform frankfurter response to our format
    // Invert rates so they show as "1 EUR = X TND" instead of "1 TND = X EUR"
    cachedRates = {
      base: 'TND',
      timestamp: new Date().toISOString(),
      rates: {
        EUR: 1 / data.rates.EUR,
        USD: 1 / data.rates.USD,
        CAD: 1 / data.rates.CAD,
      },
    };
    
    cacheTime = now;
    return cachedRates;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    
    // Fallback to realistic mock data if API fails
    return {
      base: 'TND',
      timestamp: new Date().toISOString(),
      rates: {
        EUR: 3.39,  // 1 EUR = 3.39 TND
        USD: 3.17,  // 1 USD = 3.17 TND
        CAD: 2.38,  // 1 CAD = 2.38 TND
      },
    };
  }
}

export async function GET(): Promise<NextResponse<APIResponse | ErrorResponse>> {
  try {
    const exchangeRates = await fetchExchangeRates();

    const response: APIResponse = {
      success: true,
      exchangeRates,
      sicavFunds: SICAV_FUNDS,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API error:', error);
    
    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Failed to fetch data',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}