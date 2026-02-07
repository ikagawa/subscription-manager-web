import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { EditModal } from '../components/EditModal';
import {
  formatPrice,
  formatDate,
  getDaysUntilRenewal,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '../utils/subscription-utils';
import { Search, Trash2 } from 'lucide-react';
import type { SubscriptionCategory, Subscription } from '../context/SubscriptionContext';

type CategoryFilter = 'all' | SubscriptionCategory;

const CATEGORIES: Array<{ id: CategoryFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'streaming', label: 'Streaming' },
  { id: 'software', label: 'Software' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'other', label: 'Other' },
];

export function ListPage() {
  const { subscriptions, deleteSubscription } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteSubscription(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-6">
        <h1 className="text-3xl font-bold mb-4">All Subscriptions</h1>

        {/* Search Bar */}
        <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-3 py-2">
          <Search size={18} className="text-white" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 ml-2 bg-transparent text-white placeholder-white placeholder-opacity-60 outline-none"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-foreground hover:bg-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Subscriptions List */}
        {filteredSubscriptions.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-foreground font-semibold">No subscriptions found</p>
            <p className="text-muted text-sm">
              {subscriptions.length === 0
                ? 'Add your first subscription to get started'
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSubscriptions.map((item) => {
              const daysUntil = getDaysUntilRenewal(item.renewalDate);
              return (
                <div
                  key={item.id}
                  className="bg-surface rounded-lg p-4 border border-border flex items-center justify-between hover:bg-opacity-80 transition cursor-pointer"
                  onClick={() => setSelectedSubscription(item)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
                      />
                      <p className="text-foreground font-semibold text-base">{item.name}</p>
                      {item.status === 'paused' && (
                        <span className="text-xs font-medium text-warning bg-warning bg-opacity-20 px-2 py-1 rounded">
                          Paused
                        </span>
                      )}
                    </div>
                    <p className="text-muted text-xs mb-1">{CATEGORY_LABELS[item.category]}</p>
                    <p className="text-muted text-xs">Renews {formatDate(item.renewalDate)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-foreground font-semibold">{formatPrice(item.price)}</p>
                      <p
                        className={`text-xs font-medium ${
                          daysUntil <= 7 ? 'text-error' : daysUntil <= 14 ? 'text-warning' : 'text-muted'
                        }`}
                      >
                        {daysUntil}d
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-2 text-error hover:bg-error hover:bg-opacity-10 rounded transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {selectedSubscription && (
        <EditModal
          subscription={selectedSubscription}
          onClose={() => setSelectedSubscription(null)}
        />
      )}
    </div>
  );
}
