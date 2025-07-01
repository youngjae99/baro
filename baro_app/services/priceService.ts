import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PriceResult {
  store: string;
  price: number;
  currency: string;
  availability: 'in_stock' | 'out_of_stock' | 'limited';
  distance?: number;
  lastUpdated: number;
}

export interface ProductInfo {
  name: string;
  brand?: string;
  category?: string;
  description?: string;
  image?: string;
  barcode?: string;
}

export interface PriceApiResponse {
  product: ProductInfo;
  prices: PriceResult[];
  responseTime: number;
}

export class PriceService {
  private static readonly CACHE_KEY_PREFIX = 'price_cache_';
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static readonly API_TIMEOUT = 800; // 800ms to allow for processing time

  /**
   * Fetch price comparison data with aggressive caching and optimization
   */
  static async fetchPriceComparison(
    productId: string,
    productType: 'barcode' | 'text' | 'image' = 'barcode'
  ): Promise<PriceApiResponse> {
    const startTime = Date.now();
    
    try {
      // Try cache first for fastest response
      const cachedData = await this.getCachedData(productId);
      if (cachedData) {
        return {
          ...cachedData,
          responseTime: Date.now() - startTime,
        };
      }

      // Check network connectivity
      const networkState = await NetInfo.fetch();
      if (!networkState.isConnected) {
        throw new Error('네트워크 연결이 필요합니다.');
      }

      // Fetch from API with timeout
      const apiData = await this.fetchFromApi(productId, productType);
      
      // Cache the result
      await this.cacheData(productId, apiData);
      
      return {
        ...apiData,
        responseTime: Date.now() - startTime,
      };

    } catch (error) {
      console.error('Price fetch error:', error);
      
      // Fallback to mock data for demo purposes
      const mockData = this.getMockData(productId, productType);
      return {
        ...mockData,
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Fetch data from API with timeout and retry logic
   */
  private static async fetchFromApi(
    productId: string,
    productType: string
  ): Promise<Omit<PriceApiResponse, 'responseTime'>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.API_TIMEOUT);

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch(`https://api.baro.example.com/prices/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          type: productType,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Get cached price data
   */
  private static async getCachedData(
    productId: string
  ): Promise<Omit<PriceApiResponse, 'responseTime'> | null> {
    try {
      const cacheKey = `${this.CACHE_KEY_PREFIX}${productId}`;
      const cachedJson = await AsyncStorage.getItem(cacheKey);
      
      if (!cachedJson) return null;
      
      const cached = JSON.parse(cachedJson);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - cached.timestamp > this.CACHE_DURATION) {
        await AsyncStorage.removeItem(cacheKey);
        return null;
      }
      
      return cached.data;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  /**
   * Cache price data
   */
  private static async cacheData(
    productId: string,
    data: Omit<PriceApiResponse, 'responseTime'>
  ): Promise<void> {
    try {
      const cacheKey = `${this.CACHE_KEY_PREFIX}${productId}`;
      const cacheData = {
        timestamp: Date.now(),
        data,
      };
      
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache write error:', error);
      // Don't throw - caching failure shouldn't break the flow
    }
  }

  /**
   * Generate mock data for testing and fallback
   */
  private static getMockData(
    productId: string,
    productType: string
  ): Omit<PriceApiResponse, 'responseTime'> {
    const basePrice = 1000 + (productId.length * 100);
    
    return {
      product: {
        name: productType === 'barcode' 
          ? `상품 (${productId.slice(-6)})`
          : productType === 'text'
          ? '텍스트로 인식된 상품'
          : '이미지로 인식된 상품',
        brand: '테스트 브랜드',
        category: '식품',
        description: '스캔된 상품입니다.',
        barcode: productType === 'barcode' ? productId : undefined,
      },
      prices: [
        {
          store: '이마트',
          price: basePrice,
          currency: 'KRW',
          availability: 'in_stock',
          distance: 0.5,
          lastUpdated: Date.now(),
        },
        {
          store: '롯데마트',
          price: basePrice + 300,
          currency: 'KRW',
          availability: 'in_stock',
          distance: 1.2,
          lastUpdated: Date.now(),
        },
        {
          store: '홈플러스',
          price: basePrice - 200,
          currency: 'KRW',
          availability: 'limited',
          distance: 0.8,
          lastUpdated: Date.now(),
        },
        {
          store: 'GS25',
          price: basePrice + 700,
          currency: 'KRW',
          availability: 'in_stock',
          distance: 0.2,
          lastUpdated: Date.now(),
        },
      ].sort((a, b) => a.price - b.price),
    };
  }

  /**
   * Pre-cache popular products for faster access
   */
  static async preloadPopularProducts(): Promise<void> {
    try {
      // TODO: Implement based on user history and popular items
      const popularBarcodes = [
        '8801062633357',
        '8801062636822',
        '8801062637331',
      ];

      // Pre-fetch in background without blocking UI
      popularBarcodes.forEach(barcode => {
        this.fetchPriceComparison(barcode, 'barcode').catch(() => {
          // Ignore errors in background preloading
        });
      });
    } catch (error) {
      console.error('Preload error:', error);
    }
  }

  /**
   * Clear expired cache entries
   */
  static async clearExpiredCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_KEY_PREFIX));
      const now = Date.now();

      for (const key of cacheKeys) {
        const cachedJson = await AsyncStorage.getItem(key);
        if (cachedJson) {
          const cached = JSON.parse(cachedJson);
          if (now - cached.timestamp > this.CACHE_DURATION) {
            await AsyncStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }
  }

  /**
   * Get cache statistics for debugging
   */
  static async getCacheStats(): Promise<{
    totalCacheItems: number;
    totalCacheSize: number;
    oldestCacheTime: number;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_KEY_PREFIX));
      
      let totalSize = 0;
      let oldestTime = Date.now();

      for (const key of cacheKeys) {
        const cachedJson = await AsyncStorage.getItem(key);
        if (cachedJson) {
          totalSize += cachedJson.length;
          const cached = JSON.parse(cachedJson);
          if (cached.timestamp < oldestTime) {
            oldestTime = cached.timestamp;
          }
        }
      }

      return {
        totalCacheItems: cacheKeys.length,
        totalCacheSize: totalSize,
        oldestCacheTime: oldestTime,
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return {
        totalCacheItems: 0,
        totalCacheSize: 0,
        oldestCacheTime: Date.now(),
      };
    }
  }
}