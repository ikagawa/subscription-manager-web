import React, { useState } from 'react';
import { useSubscriptions, type SubscriptionCategory, type BillingCycle } from '../context/SubscriptionContext';
import { X } from 'lucide-react';

const CATEGORIES: Array<{ id: SubscriptionCategory; label: string }> = [
  { id: 'streaming', label: 'Streaming' },
  { id: 'software', label: 'Software' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'other', label: 'Other' },
];

const BILLING_CYCLES: Array<{ id: BillingCycle; label: string }> = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
  { id: 'other', label: 'Other' },
];

interface AddModalProps {
  onClose: () => void;
}

export function AddModal({ onClose }: AddModalProps) {
  const { addSubscription } = useSubscriptions();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<SubscriptionCategory>('streaming');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [renewalDate, setRenewalDate] = useState(new Date().toISOString().split('T')[0]);
  const [isActive, setIsActive] = useState(true);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !price.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await addSubscription({
        name: name.trim(),
        price: parseFloat(price),
        category,
        billingCycle,
        startDate: new Date(startDate).toISOString(),
        renewalDate: new Date(renewalDate).toISOString(),
        status: isActive ? 'active' : 'paused',
        notes: notes.trim(),
      });

      alert('Subscription added successfully');
      onClose();
    } catch (error) {
      alert('Failed to add subscription');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-primary text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add Subscription</h2>
          <button onClick={onClose} className="p-1 hover:bg-white hover:bg-opacity-20 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-foreground font-medium mb-2">Service Name *</label>
            <input
              type="text"
              placeholder="e.g., Netflix, Spotify"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-foreground font-medium mb-2">Price *</label>
            <div className="flex items-center bg-surface border border-border rounded-lg px-4 py-2">
              <span className="text-foreground mr-2">$</span>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1 bg-transparent text-foreground outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-foreground font-medium mb-2">Category</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    category === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-surface border border-border text-foreground hover:bg-border'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Billing Cycle */}
          <div>
            <label className="block text-foreground font-medium mb-2">Billing Cycle</label>
            <div className="flex gap-2">
              {BILLING_CYCLES.map((cycle) => (
                <button
                  key={cycle.id}
                  type="button"
                  onClick={() => setBillingCycle(cycle.id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition ${
                    billingCycle === cycle.id
                      ? 'bg-primary text-white'
                      : 'bg-surface border border-border text-foreground hover:bg-border'
                  }`}
                >
                  {cycle.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-foreground font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Renewal Date */}
          <div>
            <label className="block text-foreground font-medium mb-2">Renewal Date</label>
            <input
              type="date"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status */}
          <div className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between">
            <label className="text-foreground font-medium">{isActive ? 'Active' : 'Paused'}</label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-foreground font-medium mb-2">Notes (Optional)</label>
            <textarea
              placeholder="Add any notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface border border-border text-foreground rounded-lg py-2 font-medium hover:bg-border transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-white rounded-lg py-2 font-medium hover:bg-opacity-90 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
