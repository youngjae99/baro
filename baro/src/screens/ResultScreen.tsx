import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '../navigation/AppNavigator';

type ResultScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Result'>;
};

type PriceInfo = {
  store: string;
  price: number;
  isOnline: boolean;
};

export const ResultScreen = ({navigation}: ResultScreenProps) => {
  // 임시 데이터
  const priceInfo: PriceInfo[] = [
    {store: '쿠팡', price: 15000, isOnline: true},
    {store: '네이버', price: 16000, isOnline: true},
    {store: '이마트', price: 17000, isOnline: false},
    {store: '홈플러스', price: 16500, isOnline: false},
  ];

  const handleRescan = () => {
    navigation.navigate('Scan');
  };

  const handleSave = () => {
    // TODO: 저장 로직 구현
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>가격 비교 결과</Text>
      </View>
      <ScrollView style={styles.content}>
        {priceInfo.map((info, index) => (
          <View key={index} style={styles.priceCard}>
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>{info.store}</Text>
              <Text style={styles.storeType}>
                {info.isOnline ? '온라인' : '오프라인'}
              </Text>
            </View>
            <Text style={styles.price}>{info.price.toLocaleString()}원</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleRescan}>
          <Text style={styles.buttonText}>다시 스캔하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}>
          <Text style={[styles.buttonText, styles.saveButtonText]}>
            저장하기
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  priceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  storeType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  saveButtonText: {
    color: '#007AFF',
  },
});
