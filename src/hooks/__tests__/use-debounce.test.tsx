import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import { useDebounce } from '../use-debounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Initial value
    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'changed', delay: 500 });
    expect(result.current).toBe('initial'); // Should still be old value

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current).toBe('changed');
    });
  });

  it('resets timer when value changes before delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'first' } }
    );

    // Change value quickly
    rerender({ value: 'second' });
    act(() => {
      jest.advanceTimersByTime(300); // Not enough time
    });
    expect(result.current).toBe('first'); // Should still be first value

    // Change again
    rerender({ value: 'third' });
    act(() => {
      jest.advanceTimersByTime(500); // Full delay
    });

    expect(result.current).toBe('third');
  });

  it('works with different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'start', delay: 1000 } }
    );

    rerender({ value: 'changed', delay: 1000 });
    act(() => {
      jest.advanceTimersByTime(999); // Just under delay
    });
    expect(result.current).toBe('start');

    act(() => {
      jest.advanceTimersByTime(1); // Complete delay
    });
    expect(result.current).toBe('changed');
  });

  it('works with different data types', () => {
    // String
    const { result: stringResult, rerender: rerenderString } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'string' } }
    );

    rerenderString({ value: 'updated string' });
    act(() => jest.advanceTimersByTime(300));
    expect(stringResult.current).toBe('updated string');

    // Number
    const { result: numberResult, rerender: rerenderNumber } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 42 } }
    );

    rerenderNumber({ value: 100 });
    act(() => jest.advanceTimersByTime(300));
    expect(numberResult.current).toBe(100);

    // Object
    const obj1 = { id: 1, name: 'test' };
    const obj2 = { id: 2, name: 'updated' };
    const { result: objectResult, rerender: rerenderObject } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: obj1 } }
    );

    rerenderObject({ value: obj2 });
    act(() => jest.advanceTimersByTime(300));
    expect(objectResult.current).toBe(obj2);
  });

  it('clears timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() => useDebounce('test', 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
