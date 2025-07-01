import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface HistoryItem {
  id: string;
  type: 'barcode' | 'text' | 'image';
  data: string;
  timestamp: number;
  productName?: string;
  bestPrice?: number;
}

export default function ScanHistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('scanHistory');
      if (historyData) {
        const parsedHistory = JSON.parse(historyData) as HistoryItem[];
        setHistory(parsedHistory.sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error('Failed to load scan history:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    Alert.alert(
      '기록 삭제',
      '모든 스캔 기록을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('scanHistory');
              setHistory([]);
            } catch (error) {
              console.error('Failed to clear history:', error);
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'barcode': return 'qrcode';
      case 'text': return 'text.cursor';
      case 'image': return 'camera';
      default: return 'doc';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'barcode': return '바코드';
      case 'text': return '텍스트';
      case 'image': return '이미지';
      default: return '기타';
    }
  };

  const handleItemPress = (item: HistoryItem) => {
    const scanResult = {
      type: item.type,
      data: item.data,
      timestamp: item.timestamp,
    };
    
    router.push({
      pathname: '/results',
      params: { scanData: JSON.stringify(scanResult) }
    });
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>기록을 불러오는 중...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color="#00FF88" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>스캔 기록</ThemedText>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <ThemedText style={styles.clearButton}>전체 삭제</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol name="tray" size={64} color="#666" />
          <ThemedText style={styles.emptyText}>
            아직 스캔한 상품이 없습니다
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            카메라로 바코드나 상품을 스캔해보세요
          </ThemedText>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => router.push('/camera')}
          >
            <IconSymbol name="camera" size={20} color="black" />
            <ThemedText style={styles.scanButtonText}>스캔하기</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.historyList}>
            {history.map((item) => (
              <TouchableOpacity 
                key={item.id}
                style={styles.historyItem}
                onPress={() => handleItemPress(item)}
              >
                <View style={styles.itemIcon}>
                  <IconSymbol 
                    name={getTypeIcon(item.type)} 
                    size={24} 
                    color="#00FF88" 
                  />
                </View>
                
                <View style={styles.itemContent}>
                  <View style={styles.itemHeader}>
                    <ThemedText style={styles.itemTitle}>
                      {item.productName || `${getTypeText(item.type)} 스캔`}
                    </ThemedText>
                    <ThemedText style={styles.itemTime}>
                      {formatDate(item.timestamp)}
                    </ThemedText>
                  </View>
                  
                  <ThemedText style={styles.itemData} numberOfLines={1}>
                    {item.data.length > 40 ? `${item.data.slice(0, 40)}...` : item.data}
                  </ThemedText>
                  
                  {item.bestPrice && (
                    <ThemedText style={styles.itemPrice}>
                      최저가: {item.bestPrice.toLocaleString()}원
                    </ThemedText>
                  )}
                </View>
                
                <View style={styles.itemAction}>
                  <IconSymbol name="chevron.right" size={16} color="#666" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  clearButton: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00FF88',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  scanButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  historyList: {
    padding: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  itemTime: {
    fontSize: 12,
    color: '#666',
  },
  itemData: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#00FF88',
    fontWeight: '600',
  },
  itemAction: {
    marginLeft: 8,
  },
});