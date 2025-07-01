import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

interface ScanResult {
  type: 'barcode' | 'text' | 'image';
  data: string;
  timestamp: number;
}

interface PriceResult {
  store: string;
  price: number;
  currency: string;
  availability: 'in_stock' | 'out_of_stock' | 'limited';
  distance?: number;
}

interface ProductInfo {
  name: string;
  brand?: string;
  category?: string;
  description?: string;
  image?: string;
  barcode?: string;
}

export default function ResultsScreen() {
  const { scanData } = useLocalSearchParams<{ scanData: string }>();
  const router = useRouter();

  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [priceResults, setPriceResults] = useState<PriceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scanData) {
      try {
        const result = JSON.parse(scanData) as ScanResult;
        setScanResult(result);
        fetchProductInfo(result);
      } catch {
        setError('스캔 데이터를 처리할 수 없습니다.');
        setLoading(false);
      }
    }
  }, [scanData]);

  const fetchProductInfo = async (result: ScanResult) => {
    try {
      setLoading(true);

      // TODO: Replace with actual API calls
      // Simulate API delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock product data based on scan result
      const mockProduct: ProductInfo = {
        name:
          result.type === 'barcode'
            ? `상품명 (${result.data.slice(-6)})`
            : '텍스트로 인식된 상품',
        brand: '브랜드명',
        category: '식품',
        description: '스캔된 상품에 대한 설명입니다.',
        barcode: result.type === 'barcode' ? result.data : undefined,
      };

      // Mock price comparison data
      const mockPrices: PriceResult[] = [
        {
          store: '이마트',
          price: 2500,
          currency: 'KRW',
          availability: 'in_stock' as const,
          distance: 0.5,
        },
        {
          store: '롯데마트',
          price: 2800,
          currency: 'KRW',
          availability: 'in_stock' as const,
          distance: 1.2,
        },
        {
          store: '홈플러스',
          price: 2300,
          currency: 'KRW',
          availability: 'limited' as const,
          distance: 0.8,
        },
        {
          store: 'GS25',
          price: 3200,
          currency: 'KRW',
          availability: 'in_stock' as const,
          distance: 0.2,
        },
      ].sort((a, b) => a.price - b.price);

      setProductInfo(mockProduct);
      setPriceResults(mockPrices);
      setLoading(false);
    } catch {
      setError('상품 정보를 가져올 수 없습니다.');
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()}원`;
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return '재고 있음';
      case 'out_of_stock':
        return '품절';
      case 'limited':
        return '재고 부족';
      default:
        return '확인 필요';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return '#00FF88';
      case 'out_of_stock':
        return '#FF6B6B';
      case 'limited':
        return '#FFB800';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00FF88" />
          <ThemedText style={styles.loadingText}>
            상품 정보를 검색하는 중...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <IconSymbol
            name="exclamationmark.triangle"
            size={48}
            color="#FF6B6B"
          />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.retryButtonText}>
              다시 스캔하기
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color="#00FF88" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>가격 비교 결과</ThemedText>
        </View>

        {/* Product Info */}
        {productInfo && (
          <View style={styles.productSection}>
            <ThemedText style={styles.productName}>
              {productInfo.name}
            </ThemedText>
            {productInfo.brand && (
              <ThemedText style={styles.productBrand}>
                {productInfo.brand}
              </ThemedText>
            )}
            {productInfo.category && (
              <ThemedText style={styles.productCategory}>
                {productInfo.category}
              </ThemedText>
            )}
            {scanResult?.type === 'barcode' && (
              <ThemedText style={styles.barcodeText}>
                바코드: {scanResult.data}
              </ThemedText>
            )}
          </View>
        )}

        {/* Best Price */}
        {priceResults.length > 0 && (
          <View style={styles.bestPriceSection}>
            <ThemedText style={styles.bestPriceTitle}>최저가</ThemedText>
            <View style={styles.bestPriceCard}>
              <View style={styles.bestPriceInfo}>
                <ThemedText style={styles.bestPriceStore}>
                  {priceResults[0].store}
                </ThemedText>
                <ThemedText style={styles.bestPrice}>
                  {formatPrice(priceResults[0].price, priceResults[0].currency)}
                </ThemedText>
              </View>
              <View style={styles.bestPriceDetails}>
                <ThemedText
                  style={[
                    styles.availability,
                    {
                      color: getAvailabilityColor(priceResults[0].availability),
                    },
                  ]}
                >
                  {getAvailabilityText(priceResults[0].availability)}
                </ThemedText>
                {priceResults[0].distance && (
                  <ThemedText style={styles.distance}>
                    {priceResults[0].distance}km
                  </ThemedText>
                )}
              </View>
            </View>
          </View>
        )}

        {/* All Price Comparisons */}
        <View style={styles.priceListSection}>
          <ThemedText style={styles.sectionTitle}>전체 가격 비교</ThemedText>
          {priceResults.map((result, index) => (
            <View key={`${result.store}-${index}`} style={styles.priceCard}>
              <View style={styles.priceCardHeader}>
                <ThemedText style={styles.storeName}>{result.store}</ThemedText>
                <ThemedText style={styles.price}>
                  {formatPrice(result.price, result.currency)}
                </ThemedText>
              </View>
              <View style={styles.priceCardFooter}>
                <ThemedText
                  style={[
                    styles.availability,
                    { color: getAvailabilityColor(result.availability) },
                  ]}
                >
                  {getAvailabilityText(result.availability)}
                </ThemedText>
                {result.distance && (
                  <ThemedText style={styles.distance}>
                    거리: {result.distance}km
                  </ThemedText>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.back()}
          >
            <IconSymbol name="camera" size={20} color="white" />
            <ThemedText style={styles.actionButtonText}>다시 스캔</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => router.push('/scan-history')}
          >
            <IconSymbol name="bookmark" size={20} color="#00FF88" />
            <ThemedText
              style={[styles.actionButtonText, styles.secondaryButtonText]}
            >
              저장하기
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#00FF88',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  productSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productBrand: {
    fontSize: 16,
    color: '#00FF88',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  barcodeText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  bestPriceSection: {
    padding: 16,
  },
  bestPriceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#00FF88',
  },
  bestPriceCard: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00FF88',
  },
  bestPriceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bestPriceStore: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bestPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FF88',
  },
  bestPriceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceListSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  priceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  priceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  availability: {
    fontSize: 14,
    fontWeight: '600',
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  actionSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#00FF88',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00FF88',
  },
  secondaryButtonText: {
    color: '#00FF88',
  },
});
