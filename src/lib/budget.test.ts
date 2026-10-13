import { describe, expect, it } from 'vitest';
import { estimateBudget } from './budget';
describe('event budget rules', () => {
  it('limits teams to 50 people', () => { expect(estimateBudget(80, 'essential').guests).toBe(50); });
  it('supports one-person events', () => { expect(estimateBudget(0, 'essential').guests).toBe(1); });
  it('calculates essential estimates', () => { expect(estimateBudget(20, 'essential').total).toBe(18000); });
  it('calculates signature estimates', () => { expect(estimateBudget(20, 'signature').total).toBe(34000); });
  it('calculates premium estimates', () => { expect(estimateBudget(50, 'premium').total).toBe(128000); });
});