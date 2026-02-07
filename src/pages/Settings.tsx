import React from 'react';
import { useSubscriptions, type Currency } from '../context/SubscriptionContext';
import { Settings as SettingsIcon, Download, Trash2 } from 'lucide-react';

const CURRENCIES: Array<{ id: Currency; label: string; symbol: string }> = [
  { id: 'USD', label: 'US Dollar', symbol: '$' },
  { id: 'EUR', label: 'Euro', symbol: '€' },
  { id: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { id: 'GBP', label: 'British Pound', symbol: '£' },
];

export function Settings() {
  const { subscriptions, selectedCurrency, setSelectedCurrency } = useSubscriptions();

  const handleExportData = () => {
    const dataStr = JSON.stringify(subscriptions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `subscriptions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to delete ALL subscriptions? This cannot be undone.')) {
      localStorage.removeItem('subscriptions');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-6 rounded-b-3xl">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <SettingsIcon size={28} />
          Settings
        </h1>
        <p className="text-white/80">Customize your experience</p>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Currency Selection */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Currency</h2>
          <p className="text-sm text-muted mb-4">Select your preferred currency for displaying totals</p>

          <div className="grid grid-cols-2 gap-3">
            {CURRENCIES.map((curr) => (
              <button
                key={curr.id}
                onClick={() => setSelectedCurrency(curr.id)}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  selectedCurrency === curr.id
                    ? 'bg-primary border-primary text-white'
                    : 'bg-surface border-border text-foreground hover:border-primary'
                }`}
              >
                <p className="font-bold text-lg">{curr.symbol}</p>
                <p className="text-sm">{curr.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Data Management</h2>

          {/* Export Data */}
          <button
            onClick={handleExportData}
            className="w-full bg-surface border border-border rounded-lg p-4 text-left hover:bg-border transition flex items-center gap-3"
          >
            <Download size={20} className="text-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Export Data</p>
              <p className="text-sm text-muted">Download your subscriptions as JSON</p>
            </div>
          </button>

          {/* Clear All Data */}
          <button
            onClick={handleClearAllData}
            className="w-full bg-error/10 border border-error rounded-lg p-4 text-left hover:bg-error/20 transition flex items-center gap-3"
          >
            <Trash2 size={20} className="text-error flex-shrink-0" />
            <div>
              <p className="font-medium text-error">Clear All Data</p>
              <p className="text-sm text-error/70">Delete all subscriptions permanently</p>
            </div>
          </button>
        </div>

        {/* Statistics */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Statistics</h2>

          <div className="bg-surface rounded-lg p-4 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-muted">Total Subscriptions</p>
              <p className="font-bold text-foreground text-lg">{subscriptions.length}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted">Active</p>
              <p className="font-bold text-success text-lg">
                {subscriptions.filter((s) => s.status === 'active').length}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted">Paused</p>
              <p className="font-bold text-warning text-lg">
                {subscriptions.filter((s) => s.status === 'paused').length}
              </p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">About</h2>

          <div className="bg-surface rounded-lg p-4 border border-border space-y-2">
            <p className="text-sm text-muted">
              <strong>Version:</strong> 1.0.0
            </p>
            <p className="text-sm text-muted">
              <strong>Data Storage:</strong> Browser Local Storage
            </p>
            <p className="text-sm text-muted">
              <strong>Exchange Rates:</strong> Updated daily via exchangerate-api.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
