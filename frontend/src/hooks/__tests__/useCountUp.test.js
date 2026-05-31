import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountUp } from '../useCountUp';

describe('useCountUp', () => {
  let rafCallbacks = [];
  let currentTime = 0;

  beforeEach(() => {
    rafCallbacks = [];
    currentTime = 0;

    // Mock requestAnimationFrame to capture callbacks
    vi.stubGlobal('requestAnimationFrame', (cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    vi.stubGlobal('cancelAnimationFrame', (id) => {
      rafCallbacks[id - 1] = null;
    });
    vi.stubGlobal('performance', {
      now: () => currentTime,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should start at 0 when shouldStart is false', () => {
    const { result } = renderHook(() => useCountUp(1000, false));
    expect(result.current).toBe(0);
  });

  it('should start counting when shouldStart is true', () => {
    const { result } = renderHook(() => useCountUp(100, true, 1000));
    // Initially at 0 before first animation frame
    expect(result.current).toBe(0);
  });

  it('should reach target value after duration', () => {
    const { result } = renderHook(() => useCountUp(500, true, 100));

    // Simulate time passing beyond duration
    currentTime = 150;

    // Flush all pending animation frame callbacks
    act(() => {
      rafCallbacks.forEach((cb) => cb && cb(currentTime));
    });

    expect(result.current).toBe(500);
  });

  it('should not exceed target value', () => {
    const { result } = renderHook(() => useCountUp(100, true, 50));

    // Simulate time passing well beyond duration
    currentTime = 200;

    act(() => {
      rafCallbacks.forEach((cb) => cb && cb(currentTime));
    });

    expect(result.current).toBe(100);
  });
});
