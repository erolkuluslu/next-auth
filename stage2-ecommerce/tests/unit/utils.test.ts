import {
  cn,
  formatPrice,
  formatDate,
  slugify,
  truncateText,
  isValidEmail,
  generateId,
  getFromStorage,
  setToStorage,
  removeFromStorage,
} from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
      expect(cn('px-4', { 'py-2': true, 'bg-red': false })).toBe('px-4 py-2');
    });
  });

  describe('formatPrice', () => {
    it('should format price in Turkish Lira for tr-TR locale', () => {
      const result = formatPrice(99.99, 'tr-TR');
      expect(result).toContain('99,99');
      expect(result).toContain('₺');
    });

    it('should format price in USD for en-US locale', () => {
      const result = formatPrice(99.99, 'en-US');
      expect(result).toContain('99.99');
      expect(result).toContain('$');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-12-25');
      const result = formatDate(date, 'en-US');
      expect(result).toContain('December');
      expect(result).toContain('25');
      expect(result).toContain('2023');
    });
  });

  describe('slugify', () => {
    it('should convert text to URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Special Characters! @#$%')).toBe('special-characters');
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId('test-');
      const id2 = generateId('test-');

      expect(id1).toMatch(/^test-/);
      expect(id2).toMatch(/^test-/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('localStorage utilities', () => {
    beforeEach(() => {
      localStorage.clear();
      jest.clearAllMocks();
    });

    it('should store and retrieve data from localStorage', () => {
      const testData = { name: 'test', value: 123 };

      setToStorage('testKey', testData);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'testKey',
        JSON.stringify(testData)
      );

      (localStorage.getItem as jest.Mock).mockReturnValue(
        JSON.stringify(testData)
      );
      const retrieved = getFromStorage('testKey', {});
      expect(retrieved).toEqual(testData);
    });

    it('should return default value when key does not exist', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);
      const defaultValue = { default: true };

      const result = getFromStorage('nonExistentKey', defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it('should handle JSON parse errors gracefully', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('invalid-json');
      const defaultValue = { default: true };

      const result = getFromStorage('invalidKey', defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it('should remove items from localStorage', () => {
      removeFromStorage('testKey');
      expect(localStorage.removeItem).toHaveBeenCalledWith('testKey');
    });
  });
});
