import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';

const { width, height } = Dimensions.get('window');

interface PriceInfo {
  store: string;
  price: number;
  currency: string;
  distance?: number;
  availability: 'in_stock' | 'out_of_stock' | 'limited';
}

interface AROverlayProps {
  priceData: PriceInfo[];
  productName?: string;
  isVisible: boolean;
  targetPosition?: { x: number; y: number };
}

export function AROverlay({ 
  priceData, 
  productName, 
  isVisible, 
  targetPosition = { x: width / 2, y: height / 2 } 
}: AROverlayProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [slideAnim] = useState(new Animated.Value(-50));

  useEffect(() => {
    if (isVisible && priceData.length > 0) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, priceData, fadeAnim, scaleAnim, slideAnim]);

  if (!isVisible || priceData.length === 0) {
    return null;
  }

  const bestPrice = priceData.reduce((min, current) => 
    current.price < min.price ? current : min
  );

  const formatPrice = (price: number) => `${price.toLocaleString()}원`;

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in_stock': return '#00FF88';
      case 'out_of_stock': return '#FF6B6B';
      case 'limited': return '#FFB800';
      default: return '#666';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: targetPosition.x - 150,
          top: targetPosition.y - 100,
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim },
          ],
        },
      ]}
    >
      {/* Main price card */}
      <View style={styles.priceCard}>
        {productName && (
          <ThemedText style={styles.productName} numberOfLines={1}>
            {productName}
          </ThemedText>
        )}
        
        {/* Best price highlight */}
        <View style={styles.bestPriceContainer}>
          <View style={styles.bestPriceHeader}>
            <IconSymbol name="star.fill" size={14} color="#FFD700" />
            <ThemedText style={styles.bestPriceLabel}>최저가</ThemedText>
          </View>
          
          <View style={styles.bestPriceInfo}>
            <ThemedText style={styles.bestPriceStore}>
              {bestPrice.store}
            </ThemedText>
            <ThemedText style={styles.bestPriceAmount}>
              {formatPrice(bestPrice.price)}
            </ThemedText>
          </View>
          
          <View style={styles.bestPriceDetails}>
            <View style={[
              styles.availabilityDot,
              { backgroundColor: getAvailabilityColor(bestPrice.availability) }
            ]} />
            <ThemedText style={styles.availabilityText}>
              {bestPrice.availability === 'in_stock' ? '재고 있음' : 
               bestPrice.availability === 'limited' ? '재고 부족' : '품절'}
            </ThemedText>
            {bestPrice.distance && (
              <ThemedText style={styles.distanceText}>
                {bestPrice.distance}km
              </ThemedText>
            )}
          </View>
        </View>

        {/* Price comparison preview */}
        {priceData.length > 1 && (
          <View style={styles.comparisonPreview}>
            <ThemedText style={styles.comparisonTitle}>
              다른 매장 {priceData.length - 1}곳
            </ThemedText>
            <View style={styles.comparisonPrices}>
              {priceData.slice(1, 3).map((price, index) => (
                <View key={`${price.store}-${index}`} style={styles.comparisonItem}>
                  <ThemedText style={styles.comparisonStore}>
                    {price.store}
                  </ThemedText>
                  <ThemedText style={styles.comparisonPrice}>
                    {formatPrice(price.price)}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action indicator */}
        <View style={styles.actionIndicator}>
          <IconSymbol name="hand.tap" size={12} color="#666" />
          <ThemedText style={styles.actionText}>
            탭하여 자세히 보기
          </ThemedText>
        </View>
      </View>

      {/* Pointer arrow */}
      <View style={styles.pointer} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 300,
    zIndex: 1000,
  },
  priceCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#00FF88',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  bestPriceContainer: {
    marginBottom: 12,
  },
  bestPriceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bestPriceLabel: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  bestPriceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bestPriceStore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  bestPriceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00FF88',
  },
  bestPriceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    color: '#ccc',
    flex: 1,
  },
  distanceText: {
    fontSize: 12,
    color: '#999',
  },
  comparisonPreview: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 12,
    marginBottom: 8,
  },
  comparisonTitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  comparisonPrices: {
    gap: 4,
  },
  comparisonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comparisonStore: {
    fontSize: 12,
    color: '#ccc',
  },
  comparisonPrice: {
    fontSize: 12,
    color: '#ccc',
    fontWeight: '600',
  },
  actionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  actionText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 4,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#00FF88',
    alignSelf: 'center',
    marginTop: -1,
  },
});