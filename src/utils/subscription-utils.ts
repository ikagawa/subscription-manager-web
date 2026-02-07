import { Subscription, SubscriptionCategory } from '../context/SubscriptionContext';

export const CATEGORY_COLORS: Record<SubscriptionCategory, string> = {
  streaming: '#FF6B6B',
  software: '#4ECDC4',
  fitness: '#95E1D3',
  entertainment: '#FFD93D',
  other: '#A8DADC',
};

export const CATEGORY_LABELS: Record<SubscriptionCategory, string> = {
  streaming: 'Streaming',
  software: 'Software',
  fitness: 'Fitness',
  entertainment: 'Entertainment',
  other: 'Other',
};

export const BILLING_CYCLE_LABELS: Record<string, string> = {
  monthly: 'Monthly',
  yearly: 'Yearly',
  other: 'Other',
};

export function calculateMonthlyCost(subscriptions: Subscription[]): number {
  return subscriptions
    .filter((sub) => sub.status === 'active')
    .reduce((total, sub) => {
      if (sub.billingCycle === 'monthly') {
        return total + sub.price;
      } else if (sub.billingCycle === 'yearly') {
        return total + sub.price / 12;
      }
      return total;
    }, 0);
}

export function calculateAnnualCost(subscriptions: Subscription[]): number {
  return subscriptions
    .filter((sub) => sub.status === 'active')
    .reduce((total, sub) => {
      if (sub.billingCycle === 'monthly') {
        return total + sub.price * 12;
      } else if (sub.billingCycle === 'yearly') {
        return total + sub.price;
      }
      return total;
    }, 0);
}

export function getActiveCount(subscriptions: Subscription[]): number {
  return subscriptions.filter((sub) => sub.status === 'active').length;
}

export function getUpcomingRenewals(subscriptions: Subscription[]): Subscription[] {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return subscriptions
    .filter((sub) => {
      if (sub.status !== 'active') return false;
      const renewalDate = new Date(sub.renewalDate);
      return renewalDate >= now && renewalDate <= thirtyDaysFromNow;
    })
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());
}

export function getDaysUntilRenewal(renewalDate: string): number {
  const now = new Date();
  const renewal = new Date(renewalDate);
  const diff = renewal.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

export function groupByCategory(subscriptions: Subscription[]): Record<SubscriptionCategory, Subscription[]> {
  const grouped: Record<SubscriptionCategory, Subscription[]> = {
    streaming: [],
    software: [],
    fitness: [],
    entertainment: [],
    other: [],
  };

  subscriptions.forEach((sub) => {
    grouped[sub.category].push(sub);
  });

  return grouped;
}

export function getCategoryBreakdown(subscriptions: Subscription[]): Array<{
  category: SubscriptionCategory;
  label: string;
  count: number;
  percentage: number;
  color: string;
}> {
  const grouped = groupByCategory(subscriptions.filter((sub) => sub.status === 'active'));
  const total = subscriptions.filter((sub) => sub.status === 'active').length;

  return Object.entries(grouped)
    .map(([category, subs]) => ({
      category: category as SubscriptionCategory,
      label: CATEGORY_LABELS[category as SubscriptionCategory],
      count: subs.length,
      percentage: total > 0 ? (subs.length / total) * 100 : 0,
      color: CATEGORY_COLORS[category as SubscriptionCategory],
    }))
    .filter((item) => item.count > 0);
}
