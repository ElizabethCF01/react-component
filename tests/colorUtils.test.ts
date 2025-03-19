import { describe, it, expect } from 'vitest';
import { generateRandomHex, hexToRgb, hexToHsl } from '../src/utils/colorUtils';

describe('Color Utility Functions', () => {
  describe('generateRandomHex', () => {
    it('should generate a valid hex color code', () => {
      const hexColor = generateRandomHex();

      // Check format: #RRGGBB
      expect(hexColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should generate different colors on multiple calls', () => {
      const hexColor1 = generateRandomHex();
      const hexColor2 = generateRandomHex();
      const hexColor3 = generateRandomHex();

      // This test could theoretically fail if we get the same random color twice,
      // but the probability is extremely low
      const uniqueColors = new Set([hexColor1, hexColor2, hexColor3]);
      expect(uniqueColors.size).toBeGreaterThan(1);
    });
  });

  describe('hexToRgb', () => {
    it('should convert black correctly', () => {
      expect(hexToRgb('#000000')).toBe('rgb(0, 0, 0)');
    });

    it('should convert white correctly', () => {
      expect(hexToRgb('#FFFFFF')).toBe('rgb(255, 255, 255)');
    });

    it('should convert red correctly', () => {
      expect(hexToRgb('#FF0000')).toBe('rgb(255, 0, 0)');
    });

    it('should convert green correctly', () => {
      expect(hexToRgb('#00FF00')).toBe('rgb(0, 255, 0)');
    });

    it('should convert blue correctly', () => {
      expect(hexToRgb('#0000FF')).toBe('rgb(0, 0, 255)');
    });

    it('should handle lowercase hex values', () => {
      expect(hexToRgb('#ff5500')).toBe('rgb(255, 85, 0)');
    });
  });

  describe('hexToHsl', () => {
    it('should convert black correctly', () => {
      expect(hexToHsl('#000000')).toBe('hsl(0, 0%, 0%)');
    });

    it('should convert white correctly', () => {
      expect(hexToHsl('#FFFFFF')).toBe('hsl(0, 0%, 100%)');
    });

    it('should convert red correctly', () => {
      expect(hexToHsl('#FF0000')).toBe('hsl(0, 100%, 50%)');
    });

    it('should convert green correctly', () => {
      expect(hexToHsl('#00FF00')).toBe('hsl(120, 100%, 50%)');
    });

    it('should convert blue correctly', () => {
      expect(hexToHsl('#0000FF')).toBe('hsl(240, 100%, 50%)');
    });

    it('should handle a mixed color correctly', () => {
      // This is approximately hsl(30, 100%, 50%)
      expect(hexToHsl('#FF8000')).toBe('hsl(30, 100%, 50%)');
    });
  });

});
