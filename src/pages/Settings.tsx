import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { Download, Trash2, Moon, Bell } from 'lucide-react';

export function Settings() {
  const { subscriptions } = useSubscriptions();
  const [currency, setCurrency] = useState('USD');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderDays, setReminderDays] = useState(3);

  const handleClearData = () => {
    if (confirm('Are you sure you want to delete all subscriptions? This cannot be undone.')) {
      localStorage.removeItem('subscriptions');
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ['Name', 'Price', 'Billing Cycle', 'Category', 'Status', 'Renewal Date'],
      ...subscriptions.map((sub) => [
        sub.name,
        sub.price,
        sub.billingCycle,
        sub.category,
        sub.status,
        sub.renewalDate,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscriptions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-6">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Preferences Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Preferences</h2>

          {/* Currency Selection */}
          <div className="bg-surface rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-foreground font-medium">Currency</p>
              <p className="text-primary font-semibold">{currency}</p>
            </div>
            <div className="flex gap-2">
              {['USD', 'EUR', 'JPY', 'GBP'].map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`flex-1 py-2 rounded-lg transition ${
                    currency === curr
                      ? 'bg-primary text-white'
                      : 'bg-background border border-border text-foreground hover:bg-border'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-surface rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-primary" />
                <p className="text-foreground font-medium">Renewal Reminders</p>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
            {notificationsEnabled && (
              <div className="flex items-center justify-between">
                <p className="text-muted text-sm">Remind me</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReminderDays(Math.max(1, reminderDays - 1))}
                    className="p-2 hover:bg-border rounded transition"
                  >
                    −
                  </button>
                  <p className="text-foreground font-semibold w-8 text-center">{reminderDays}d</p>
                  <button
                    onClick={() => setReminderDays(reminderDays + 1)}
                    className="p-2 hover:bg-border rounded transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme */}
          <div className="bg-surface rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon size={20} className="text-primary" />
                <p className="text-foreground font-medium">Theme</p>
              </div>
              <p className="text-muted text-sm">Auto</p>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Data Management</h2>

          {/* Export Data */}
          <button
            onClick={handleExportData}
            className="w-full bg-surface rounded-lg p-4 border border-border flex items-center justify-between hover:bg-opacity-80 transition"
          >
            <div className="flex items-center gap-3">
              <Download size={20} className="text-primary" />
              <div className="text-left">
                <p className="text-foreground font-medium">Export Data</p>
                <p className="text-muted text-xs">{subscriptions.length} subscriptions</p>
              </div>
            </div>
            <span className="text-muted">→</span>
          </button>

          {/* Clear Data */}
          <button
            onClick={handleClearData}
            className="w-full bg-surface rounded-lg p-4 border border-error border-opacity-50 flex items-center justify-between hover:bg-opacity-80 transition"
          >
            <div className="flex items-center gap-3">
              <Trash2 size={20} className="text-error" />
              <div className="text-left">
                <p className="text-error font-medium">Clear All Data</p>
                <p className="text-muted text-xs">Delete all subscriptions</p>
              </div>
            </div>
            <span className="text-muted">→</span>
          </button>
        </div>

        {/* About Section */}
        <div className="space-y-4 pb-8">
          <h2 className="text-lg font-semibold text-foreground">About</h2>

          <div className="bg-surface rounded-lg p-4 border border-border space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <p className="text-muted">App Version</p>
              <p className="text-foreground font-medium">1.0.0</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted">Total Subscriptions</p>
              <p className="text-foreground font-medium">{subscriptions.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
