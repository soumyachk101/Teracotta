import { describe, it, expect } from 'vitest';
import { ROUTES } from '../routes';

// footer links must all resolve to a real route
describe('footer routes', () => {
  it('has routes for every footer support link', () => {
    expect(ROUTES.FAQ).toBe('/faq');
    expect(ROUTES.SHIPPING).toBe('/shipping');
    expect(ROUTES.RETURNS).toBe('/returns');
  });
});
