export const MAX_GUESTS = 50;
export const tiers = [
  { id: 'essential', name: 'Essential', label: 'Small budget. Big feeling.', base: 5000, perGuest: 650, features: ['Event concept & planning', 'Essential décor & styling', 'Vendor coordination', 'On-the-day checklist'] },
  { id: 'signature', name: 'Signature', label: 'A little extra, everywhere.', base: 10000, perGuest: 1200, features: ['Everything in Essential', 'Custom theme & floral styling', 'Curated food & beverage budget', 'On-site event coordination'] },
  { id: 'premium', name: 'Premium', label: 'Every detail, elevated.', base: 18000, perGuest: 2200, features: ['Everything in Signature', 'Statement décor & lighting', 'Premium dining allocation', 'Photography & entertainment budget'] },
] as const;
export type TierId = typeof tiers[number]['id'];
export function estimateBudget(guests: number, tierId: TierId) {
  const count = Math.min(MAX_GUESTS, Math.max(1, Math.round(Number.isFinite(guests) ? guests : 1)));
  const tier = tiers.find((item) => item.id === tierId) ?? tiers[0];
  return { guests: count, planning: tier.base, guestCosts: count * tier.perGuest, total: tier.base + count * tier.perGuest };
}
export const currency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);