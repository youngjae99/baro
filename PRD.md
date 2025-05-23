# 바로 (BARO) - AR 기반 실시간 가격 비교 앱 PRD

## 1. 제품 개요
바로(BARO)는 AR 기술을 활용하여 사용자가 상품과 라벨을 카메라로 비추면 실시간으로 최적의 가격을 비교해주는 모바일 애플리케이션입니다.

## 2. 핵심 기능

### 2.1 AR 스캔 기능
- 상품 바코드/QR코드 스캔
- 상품 라벨 텍스트 인식 (OCR)
- 상품 이미지 인식
- 실시간 가격 정보 AR 오버레이

### 2.2 가격 비교 기능
- 온라인/오프라인 가격 비교 (쿠팡, 네이버 등)

### 2.3 사용자 기능
- 가격 알림 설정
- 관심 상품 저장
- 가격 비교 히스토리
- 사용자 리뷰 및 평점

## 3. 기술 요구사항

### 3.1 프론트엔드
- React Native
- AR Kit (iOS) / AR Core (Android)
- OCR 엔진 통합
- 실시간 카메라 처리

### 3.2 백엔드
- RESTful API
- 실시간 데이터베이스
- 이미지 처리 서버
- 가격 크롤링 시스템

## 4. 사용자 경험

### 4.1 주요 사용자 시나리오
1. 앱 실행 및 카메라 활성화
2. 상품 스캔
3. 실시간 가격 정보 확인
4. 가격 비교 및 상세 정보 확인 
5. 관심 상품 저장 또는 알림 설정

### 4.2 UI/UX 요구사항
- 직관적이고 사용자 친화적인 카메라 인터페이스 ex) '사도 좋아요 :)', '비싸요' 등을 이모지나 색상으로 표현
- 명확한 가격 정보 표시
- 부드러운 AR 오버레이
- 빠른 응답 속도

## 5. 데이터 요구사항

### 5.1 수집 데이터
- 상품 정보
- 가격 정보
- 매장 정보
- 사용자 검색 히스토리
- 사용자 선호도

### 5.2 데이터 소스
- 온라인 쇼핑몰 API
- 오프라인 매장 데이터베이스
- 사용자 제보 데이터
- 크롤링 데이터

## 6. 성능 요구사항
- AR 스캔 응답 시간: 1초 이내
- 가격 정보 로딩: 2초 이내
- 앱 시작 시간: 3초 이내
- 배터리 효율성 최적화

## 7. 보안 요구사항
- 사용자 데이터 암호화
- 안전한 API 통신
- 개인정보 보호
- 데이터 백업 시스템

## 8. 향후 확장 계획
- AI 기반 가격 예측
- 소셜 기능 추가
- 쿠폰/할인 정보 통합
- 다국어 지원

## 9. 성공 지표
- 일일 활성 사용자 수
- 스캔 성공률
- 사용자 만족도
- 가격 정보 정확도
- 앱 스토어 평점
