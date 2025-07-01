import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { TextRecognitionService } from '@/services/textRecognition';
import { AROverlay } from '@/components/AROverlay';
import { PriceService } from '@/services/priceService';

const { width, height } = Dimensions.get('window');

interface ScanResult {
  type: 'barcode' | 'text' | 'image';
  data: string;
  timestamp: number;
}

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [scanMode, setScanMode] = useState<'barcode' | 'text' | 'image'>('barcode');
  const [arOverlayData, setArOverlayData] = useState<any[]>([]);
  const [arVisible, setArVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<string>('');
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    // Pre-load popular products and clear expired cache on app start
    PriceService.preloadPopularProducts();
    PriceService.clearExpiredCache();
  }, []);

  const handleBarcodeScanned = async ({ type, data }: BarcodeScanningResult) => {
    if (!isScanning) return;
    
    const scanResult: ScanResult = {
      type: 'barcode',
      data,
      timestamp: Date.now()
    };

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setScanResults(prev => [scanResult, ...prev.slice(0, 4)]);
    
    // Show AR overlay with mock price data
    await showAROverlay(data);
    
    // Navigate to results with scan data after a delay
    setTimeout(() => {
      router.push({
        pathname: '/results',
        params: { scanData: JSON.stringify(scanResult) }
      });
    }, 2000);
  };

  const showAROverlay = async (productData: string) => {
    try {
      // Fetch price data with optimization for 1-second response
      const priceResponse = await PriceService.fetchPriceComparison(productData, 'barcode');
      
      console.log(`Price fetch completed in ${priceResponse.responseTime}ms`);

      setCurrentProduct(priceResponse.product.name);
      setArOverlayData(priceResponse.prices);
      setArVisible(true);

      // Hide AR overlay after 3 seconds
      setTimeout(() => {
        setArVisible(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to fetch price data:', error);
      // Show error state in AR overlay
      setCurrentProduct('가격 정보 로드 실패');
      setArOverlayData([]);
      setArVisible(true);
      
      setTimeout(() => {
        setArVisible(false);
      }, 2000);
    }
  };

  const handleTextRecognition = async () => {
    try {
      setIsScanning(false);
      
      if (!cameraRef.current) {
        Alert.alert('오류', '카메라를 사용할 수 없습니다.');
        setIsScanning(true);
        return;
      }

      // Take a picture for text recognition
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (!photo?.uri) {
        Alert.alert('오류', '사진을 촬영할 수 없습니다.');
        setIsScanning(true);
        return;
      }

      // Perform text recognition
      const textResult = await TextRecognitionService.recognizeText(photo.uri);
      const productInfo = TextRecognitionService.extractProductInfo(textResult);

      if (productInfo.allText.trim().length === 0) {
        Alert.alert('텍스트 없음', '인식된 텍스트가 없습니다. 다시 시도해주세요.');
        setIsScanning(true);
        return;
      }

      const scanResult: ScanResult = {
        type: 'text',
        data: productInfo.allText,
        timestamp: Date.now()
      };

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScanResults(prev => [scanResult, ...prev.slice(0, 4)]);
      
      // Navigate to results with extracted text data
      router.push({
        pathname: '/results',
        params: { 
          scanData: JSON.stringify(scanResult),
          productInfo: JSON.stringify(productInfo)
        }
      });

    } catch (error) {
      console.error('Text recognition error:', error);
      Alert.alert('오류', '텍스트 인식에 실패했습니다.');
      setIsScanning(true);
    }
  };

  const handleImageRecognition = async () => {
    try {
      setIsScanning(false);
      
      if (!cameraRef.current) {
        Alert.alert('오류', '카메라를 사용할 수 없습니다.');
        setIsScanning(true);
        return;
      }

      // Take a picture for image recognition
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (!photo?.uri) {
        Alert.alert('오류', '사진을 촬영할 수 없습니다.');
        setIsScanning(true);
        return;
      }

      // Simulate image recognition processing
      // TODO: Replace with actual image recognition API
      const mockImageData = `IMG_${Date.now()}`;
      
      const scanResult: ScanResult = {
        type: 'image',
        data: mockImageData,
        timestamp: Date.now()
      };

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScanResults(prev => [scanResult, ...prev.slice(0, 4)]);
      
      // Show AR overlay with image recognition data
      await showAROverlay(mockImageData);
      
      // Navigate to results with image data after a delay
      setTimeout(() => {
        router.push({
          pathname: '/results',
          params: { 
            scanData: JSON.stringify(scanResult),
            imageUri: photo.uri
          }
        });
      }, 2000);

    } catch (error) {
      console.error('Image recognition error:', error);
      Alert.alert('오류', '이미지 인식에 실패했습니다.');
      setIsScanning(true);
    }
  };

  const toggleScanMode = () => {
    const modes: ('barcode' | 'text' | 'image')[] = ['barcode', 'text', 'image'];
    const currentIndex = modes.indexOf(scanMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setScanMode(nextMode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (!permission) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>카메라 권한을 확인하는 중...</ThemedText>
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.message}>
          BARO 앱이 카메라에 액세스하려면 권한이 필요합니다
        </ThemedText>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <ThemedText style={styles.buttonText}>권한 허용</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanMode === 'barcode' ? handleBarcodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'upc_a', 'upc_e'],
        }}
      >
        {/* AR Overlay Area */}
        <View style={styles.overlay}>
          {/* Scan Frame */}
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          {/* Top UI */}
          <View style={styles.topUI}>
            <ThemedText style={styles.scanModeText}>
              {scanMode === 'barcode' && '바코드/QR 스캔'}
              {scanMode === 'text' && '텍스트 인식'}
              {scanMode === 'image' && '상품 이미지 인식'}
            </ThemedText>
          </View>

          {/* Bottom UI */}
          <View style={styles.bottomUI}>
            <TouchableOpacity 
              style={styles.modeButton} 
              onPress={toggleScanMode}
            >
              <IconSymbol 
                name={scanMode === 'barcode' ? 'qrcode' : scanMode === 'text' ? 'text.cursor' : 'camera'} 
                size={24} 
                color="white" 
              />
              <ThemedText style={styles.modeButtonText}>모드 변경</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={
                scanMode === 'text' ? handleTextRecognition :
                scanMode === 'image' ? handleImageRecognition :
                undefined
              }
              disabled={scanMode === 'barcode'}
            >
              <IconSymbol 
                name="viewfinder.circle" 
                size={80} 
                color={scanMode === 'barcode' ? '#666' : 'white'} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.historyButton}
              onPress={() => router.push('/scan-history')}
            >
              <IconSymbol name="clock" size={24} color="white" />
              <ThemedText style={styles.modeButtonText}>기록</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Real-time results preview */}
          {scanResults.length > 0 && !arVisible && (
            <View style={styles.resultsPreview}>
              <ThemedText style={styles.previewText}>
                최근 스캔: {scanResults[0].data.slice(0, 30)}...
              </ThemedText>
            </View>
          )}

          {/* AR Overlay */}
          <AROverlay
            priceData={arOverlayData}
            productName={currentProduct}
            isVisible={arVisible}
            targetPosition={{ x: width / 2, y: height * 0.4 }}
          />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scanFrame: {
    position: 'absolute',
    top: height * 0.25,
    left: width * 0.15,
    width: width * 0.7,
    height: width * 0.7,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#00FF88',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  topUI: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scanModeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bottomUI: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modeButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 50,
  },
  modeButtonText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 50,
  },
  resultsPreview: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 255, 136, 0.9)',
    padding: 12,
    borderRadius: 8,
  },
  previewText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00FF88',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});