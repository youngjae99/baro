import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

export const ARScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [scannedItem, setScannedItem] = useState<string | null>(null);
  const devices = useCameraDevices();
  const device = devices?.back || devices?.find(d => d.position === 'back');

  useEffect(() => {
    const requestCameraPermission = async () => {
      const status = await Camera.getCameraPermissionStatus();
      if (status === 'granted') {
        setHasPermission(true);
      } else {
        const newStatus = await Camera.requestCameraPermission();
        setHasPermission(newStatus === 'granted');
      }
    };

    requestCameraPermission();
  }, []);

  const onObjectDetected = (objectName: string) => {
    setScannedItem(objectName);
    // 여기에 실제 물건 인식 로직 구현
    Alert.alert('물건 감지됨', `${objectName}이(가) 감지되었습니다.`);
  };

  const simulateObjectDetection = () => {
    // 실제 구현에서는 ML Kit이나 다른 객체 인식 라이브러리 사용
    const mockObjects = ['바나나', '사과', '콜라', '물병', '책'];
    const randomObject =
      mockObjects[Math.floor(Math.random() * mockObjects.length)];
    onObjectDetected(randomObject);
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>카메라 권한이 필요합니다.</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>카메라를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={isActive}
        enableZoomGesture
      />

      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <Text style={styles.title}>물건을 카메라로 비춰보세요</Text>
        </View>

        <View style={styles.centerBox}>
          <View style={styles.scanFrame} />
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={simulateObjectDetection}>
            <Text style={styles.scanButtonText}>스캔하기</Text>
          </TouchableOpacity>

          {scannedItem && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>감지된 물건: {scannedItem}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 8,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  bottomBar: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 8,
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
