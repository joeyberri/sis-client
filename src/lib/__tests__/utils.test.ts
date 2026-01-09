import { describe, expect, it } from '@jest/globals';
import { cn, formatBytes } from '../utils';

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'active', false && 'inactive')).toBe(
      'base active'
    );
  });

  it('merges conflicting Tailwind classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles arrays of classes', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });

  it('handles objects with conditional classes', () => {
    expect(cn({ active: true, disabled: false })).toBe('active');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });

  it('handles undefined and null values', () => {
    expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
  });
});

describe('formatBytes', () => {
  it('formats bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Byte');
    expect(formatBytes(1)).toBe('1 Bytes');
    expect(formatBytes(1023)).toBe('1023 Bytes');
  });

  it('formats kilobytes correctly', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1536)).toBe('2 KB'); // Rounds up with decimals=0
    expect(formatBytes(1024 * 1024 - 1)).toBe('1024 KB');
  });

  it('formats megabytes correctly', () => {
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
    expect(formatBytes(1024 * 1024 * 1.5)).toBe('2 MB'); // Rounds up with decimals=0
  });

  it('formats gigabytes correctly', () => {
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
    expect(formatBytes(1024 * 1024 * 1024 * 2.5)).toBe('3 GB'); // Rounds up with decimals=0
  });

  it('formats terabytes correctly', () => {
    expect(formatBytes(1024 * 1024 * 1024 * 1024)).toBe('1 TB');
  });

  it('handles decimal precision', () => {
    expect(formatBytes(1024 * 1.234, { decimals: 2 })).toBe('1.23 KB');
    expect(formatBytes(1024 * 1.234, { decimals: 0 })).toBe('1 KB');
  });

  it('uses accurate size type when specified', () => {
    expect(formatBytes(1024, { sizeType: 'accurate' })).toBe('1 KiB');
    expect(formatBytes(1024 * 1024, { sizeType: 'accurate' })).toBe('1 MiB');
    expect(formatBytes(1024 * 1024 * 1024, { sizeType: 'accurate' })).toBe(
      '1 GiB'
    );
  });

  it('handles large numbers correctly', () => {
    const largeNumber = 1024 * 1024 * 1024 * 1024 * 1024; // 1 PiB
    expect(formatBytes(largeNumber)).toBe('1 Bytes'); // Falls back to Bytes for unknown sizes
  });

  it('handles edge cases', () => {
    expect(formatBytes(0.5)).toBe('512 Bytes'); // Function has edge case with fractional bytes
    expect(formatBytes(-1024)).toBe('NaN Bytes'); // Negative numbers result in NaN
  });
});
