import textRecognition from '@react-native-ml-kit/text-recognition';

export interface TextRecognitionResult {
  text: string;
  blocks: Array<{
    text: string;
    frame: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    lines: Array<{
      text: string;
      frame: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }>;
  }>;
}

export interface ProductTextInfo {
  productName?: string;
  brand?: string;
  price?: string;
  weight?: string;
  expiryDate?: string;
  ingredients?: string[];
  allText: string;
}

export class TextRecognitionService {
  /**
   * Extract text from image using ML Kit
   */
  static async recognizeText(imageUri: string): Promise<TextRecognitionResult> {
    try {
      const result = await textRecognition.recognize(imageUri);
      return result;
    } catch (error) {
      console.error('Text recognition failed:', error);
      throw new Error('텍스트 인식에 실패했습니다.');
    }
  }

  /**
   * Process recognized text to extract product information
   */
  static extractProductInfo(textResult: TextRecognitionResult): ProductTextInfo {
    const allText = textResult.text;
    const lines = textResult.blocks.flatMap(block => 
      block.lines.map(line => line.text.trim())
    ).filter(line => line.length > 0);

    const productInfo: ProductTextInfo = {
      allText,
    };

    // Extract potential product name (usually the largest or first significant text)
    const potentialNames = lines.filter(line => 
      line.length > 3 && 
      line.length < 50 && 
      !this.isPriceText(line) &&
      !this.isWeightText(line) &&
      !this.isDateText(line)
    );
    
    if (potentialNames.length > 0) {
      productInfo.productName = potentialNames[0];
    }

    // Extract brand (look for common brand patterns)
    const brandPatterns = [
      /브랜드[:\s]*([가-힣a-zA-Z\s]+)/i,
      /제조사[:\s]*([가-힣a-zA-Z\s]+)/i,
      /회사[:\s]*([가-힣a-zA-Z\s]+)/i,
    ];
    
    for (const line of lines) {
      for (const pattern of brandPatterns) {
        const match = line.match(pattern);
        if (match) {
          productInfo.brand = match[1].trim();
          break;
        }
      }
      if (productInfo.brand) break;
    }

    // Extract price
    for (const line of lines) {
      if (this.isPriceText(line)) {
        productInfo.price = line;
        break;
      }
    }

    // Extract weight/volume
    for (const line of lines) {
      if (this.isWeightText(line)) {
        productInfo.weight = line;
        break;
      }
    }

    // Extract expiry date
    for (const line of lines) {
      if (this.isDateText(line)) {
        productInfo.expiryDate = line;
        break;
      }
    }

    // Extract ingredients (look for ingredient list)
    const ingredientKeywords = ['원료', '성분', '재료', 'ingredients'];
    let foundIngredients = false;
    const ingredients: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (ingredientKeywords.some(keyword => line.includes(keyword))) {
        foundIngredients = true;
        continue;
      }
      
      if (foundIngredients) {
        // Extract ingredients until we hit a new section
        if (line.length > 10 && !this.isOtherSection(line)) {
          ingredients.push(lines[i]);
        } else if (ingredients.length > 0) {
          break;
        }
      }
    }
    
    if (ingredients.length > 0) {
      productInfo.ingredients = ingredients;
    }

    return productInfo;
  }

  /**
   * Check if text looks like a price
   */
  private static isPriceText(text: string): boolean {
    const pricePatterns = [
      /\d+[,.]?\d*\s*원/,
      /₩\s*\d+[,.]?\d*/,
      /\$\s*\d+[.]?\d*/,
      /가격[:\s]*\d+/,
      /\d+[,.]?\d*\s*KRW/i,
    ];
    
    return pricePatterns.some(pattern => pattern.test(text));
  }

  /**
   * Check if text looks like weight/volume
   */
  private static isWeightText(text: string): boolean {
    const weightPatterns = [
      /\d+[.]?\d*\s*(g|kg|ml|l|oz|lb)/i,
      /\d+[.]?\d*\s*(그램|킬로|리터|밀리리터)/,
      /중량[:\s]*\d+/,
      /용량[:\s]*\d+/,
      /내용량[:\s]*\d+/,
    ];
    
    return weightPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Check if text looks like a date
   */
  private static isDateText(text: string): boolean {
    const datePatterns = [
      /\d{4}[.-]\d{1,2}[.-]\d{1,2}/,
      /\d{1,2}[.-]\d{1,2}[.-]\d{4}/,
      /\d{4}년\s*\d{1,2}월\s*\d{1,2}일/,
      /(유통기한|제조일자|소비기한)[:\s]*\d/,
      /까지\s*\d{4}/,
    ];
    
    return datePatterns.some(pattern => pattern.test(text));
  }

  /**
   * Check if text indicates a new section (to stop ingredient parsing)
   */
  private static isOtherSection(text: string): boolean {
    const sectionKeywords = [
      '영양정보', '보관방법', '주의사항', '알레르기', '제조사',
      'nutrition', 'storage', 'warning', 'allergen', 'manufacturer'
    ];
    
    return sectionKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * Format extracted product info for display
   */
  static formatProductInfo(info: ProductTextInfo): string {
    const parts: string[] = [];
    
    if (info.productName) {
      parts.push(`상품명: ${info.productName}`);
    }
    
    if (info.brand) {
      parts.push(`브랜드: ${info.brand}`);
    }
    
    if (info.price) {
      parts.push(`가격: ${info.price}`);
    }
    
    if (info.weight) {
      parts.push(`용량: ${info.weight}`);
    }
    
    if (info.expiryDate) {
      parts.push(`유통기한: ${info.expiryDate}`);
    }
    
    return parts.join('\n');
  }

  /**
   * Extract potential search keywords for price comparison
   */
  static extractSearchKeywords(info: ProductTextInfo): string[] {
    const keywords: string[] = [];
    
    if (info.productName) {
      keywords.push(info.productName);
    }
    
    if (info.brand && info.productName) {
      keywords.push(`${info.brand} ${info.productName}`);
    }
    
    // Remove common non-product words
    const filtered = keywords.map(keyword => 
      keyword.replace(/\b(주식회사|회사|브랜드|제품|상품)\b/g, '').trim()
    ).filter(keyword => keyword.length > 2);
    
    return [...new Set(filtered)]; // Remove duplicates
  }
}