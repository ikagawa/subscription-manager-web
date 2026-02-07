import React, { useEffect, useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import {
  getActiveCount,
  CATEGORY_COLORS,
} from '../utils/subscription-utils';
import { getExchangeRates, convertCurrency, formatCurrencySymbol, type ExchangeRates } from '../utils/exchange-rates';
import { Plus, Calendar, AlertCircle } from 'lucide-react';

interface HomeProps {
  onOpenAddModal: () => void;
}

export function Home({ onOpenAddModal }: HomeProps) {
  const { subscriptions, isLoading, selectedCurrency } = useSubscriptions();
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [ratesLoading, setRatesLoading] = useState(true);

  useEffect(() => {
    loadExchangeRates();
  }, []);

  const loadExchangeRates = async () => {
    try {
      setRatesLoading(true);
      const rates = await getExchangeRates();
      console.log('Exchange rates loaded:', rates);
      setExchangeRates(rates);
    } catch (error) {
      console.error('Failed to load exchange rates:', error);
    } finally {
      setRatesLoading(false);
    }
  };

  const calculateTotalCost = (cycle: 'monthly' | 'annual') => {
    if (!exchangeRates) {
      console.log('Exchange rates not loaded yet');
      return 0;
    }

    const total = subscriptions
      .filter((sub) => sub.status === 'active')
      .reduce((total, sub) => {
        if (!sub.currency || typeof sub.price !== 'number') {
          console.warn('Invalid subscription data:', sub);
          return total;
        }
        const amount = cycle === 'monthly' ? sub.price : sub.price * 12;
        const converted = convertCurrency(amount, sub.currency, selectedCurrency, exchangeRates);
        console.log(`Converting ${amount} ${sub.currency} to ${selectedCurrency}: ${converted}`);
        return total + converted;
      }, 0);

    if (isNaN(total) || !isFinite(total)) {
      console.error('Total calculation resulted in NaN:', total);
      return 0;
    }

    return total;
  };

  const monthlyCost = calculateTotalCost('monthly');
  const annualCost = calculateTotalCost('annual');
  const activeCount = getActiveCount(subscriptions);
  const upcomingRenewals = subscriptions
    .filter((sub) => sub.status === 'active')
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
    .slice(0, 3);

  if (isLoading || ratesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-6 rounded-b-3xl">
        <h1 className="text-3xl font-bold mb-2">Subscriptions</h1>
        <p className="text-white/80">Manage your subscriptions in one place</p>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Cost Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Monthly Cost */}
          <div className="bg-surface rounded-2xl p-4 border border-border">
            <p className="text-muted text-sm mb-2">Monthly Cost</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrencySymbol(selectedCurrency)}
              {isNaN(monthlyCost) ? '0.00' : monthlyCost.toFixed(2)}
            </p>
          </div>

          {/* Annual Cost */}
          <div className="bg-surface rounded-2xl p-4 border border-border">
            <p className="text-muted text-sm mb-2">Annual Cost</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrencySymbol(selectedCurrency)}
              {isNaN(annualCost) ? '0.00' : annualCost.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-surface rounded-2xl p-4 border border-border">
          <p className="text-muted text-sm mb-2">Active Subscriptions</p>
          <p className="text-3xl font-bold text-foreground">{activeCount}</p>
        </div>

        {/* Upcoming Renewals */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Calendar size={20} />
            Upcoming Renewals
          </h2>

          {upcomingRenewals.length > 0 ? (
            <div className="space-y-2">
              {upcomingRenewals.map((sub) => {
                const renewalDate = new Date(sub.renewalDate);
                const today = new Date();
                const daysUntil = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <div key={sub.id} className="bg-surface rounded-lg p-3 border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[sub.category] }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{sub.name}</p>
                        <p className="text-xs text-muted">
                          {renewalDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil}d`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-surface rounded-lg p-4 border border-border text-center">
              <AlertCircle size={24} className="mx-auto text-muted mb-2" />
              <p className="text-muted text-sm">No active subscriptions</p>
            </div>
          )}
        </div>

        {/* Currency Notice */}
        {selectedCurrency !== 'USD' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
            <p>
              <strong>Note:</strong> Totals are converted to {selectedCurrency} using today's exchange rates. Rates are cached for 24 hours.
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
