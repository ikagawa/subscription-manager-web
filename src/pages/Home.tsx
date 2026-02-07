import React from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import {
  calculateMonthlyCost,
  calculateAnnualCost,
  getActiveCount,
  getUpcomingRenewals,
  formatPrice,
  formatDate,
  getDaysUntilRenewal,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '../utils/subscription-utils';
import { Plus, Calendar } from 'lucide-react';

interface HomeProps {
  onOpenAddModal: () => void;
}

export function Home({ onOpenAddModal }: HomeProps) {
  const { subscriptions, isLoading } = useSubscriptions();

  const monthlyCost = calculateMonthlyCost(subscriptions);
  const annualCost = calculateAnnualCost(subscriptions);
  const activeCount = getActiveCount(subscriptions);
  const upcomingRenewals = getUpcomingRenewals(subscriptions);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-6">
        <h1 className="text-3xl font-bold mb-1">My Subscriptions</h1>
        <p className="text-white opacity-80 text-sm">Track all your subscriptions</p>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="space-y-4">
          {/* Monthly Cost Card */}
          <div className="bg-surface rounded-lg p-6 border border-border">
            <p className="text-muted text-sm mb-2">Monthly Cost</p>
            <p className="text-4xl font-bold text-foreground">{formatPrice(monthlyCost)}</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Annual Cost */}
            <div className="bg-surface rounded-lg p-4 border border-border">
              <p className="text-muted text-xs mb-1">Annual Cost</p>
              <p className="text-2xl font-bold text-foreground">{formatPrice(annualCost)}</p>
            </div>

            {/* Active Count */}
            <div className="bg-surface rounded-lg p-4 border border-border">
              <p className="text-muted text-xs mb-1">Active</p>
              <p className="text-2xl font-bold text-foreground">{activeCount}</p>
            </div>

            {/* Upcoming */}
            <div className="bg-surface rounded-lg p-4 border border-border">
              <p className="text-muted text-xs mb-1">Upcoming</p>
              <p className="text-2xl font-bold text-foreground">{upcomingRenewals.length}</p>
            </div>
          </div>
        </div>

        {/* Upcoming Renewals Section */}
        {upcomingRenewals.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Upcoming Renewals</h2>
            </div>

            <div className="space-y-3">
              {upcomingRenewals.slice(0, 5).map((item) => {
                const daysUntil = getDaysUntilRenewal(item.renewalDate);
                return (
                  <div key={item.id} className="bg-surface rounded-lg p-4 border border-border flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-foreground font-semibold mb-1">{item.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
                        />
                        <span>{CATEGORY_LABELS[item.category]}</span>
                        <span>•</span>
                        <span>{formatDate(item.renewalDate)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground font-semibold">{formatPrice(item.price)}</p>
                      <p
                        className={`text-xs font-medium ${
                          daysUntil <= 7 ? 'text-error' : daysUntil <= 14 ? 'text-warning' : 'text-muted'
                        }`}
                      >
                        {daysUntil} days
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {subscriptions.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <Calendar className="w-12 h-12 text-muted mx-auto" />
            <p className="text-foreground font-semibold text-lg">No subscriptions yet</p>
            <p className="text-muted text-sm">
              Add your first subscription to get started tracking your expenses
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onOpenAddModal}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
