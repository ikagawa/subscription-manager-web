import React, { createContext, useContext, useEffect, useState } from 'react';

export type SubscriptionCategory = 'streaming' | 'software' | 'fitness' | 'entertainment' | 'other';
export type BillingCycle = 'monthly' | 'yearly' | 'other';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  billingCycle: BillingCycle;
  category: SubscriptionCategory;
  startDate: string;
  renewalDate: string;
  status: SubscriptionStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  getSubscriptionById: (id: string) => Subscription | undefined;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const STORAGE_KEY = 'subscriptions';

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setIsLoading(true);
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        setSubscriptions(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSubscriptions = async (updatedSubscriptions: Subscription[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSubscriptions));
      setSubscriptions(updatedSubscriptions);
    } catch (error) {
      console.error('Failed to save subscriptions:', error);
    }
  };

  const addSubscription = async (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveSubscriptions([...subscriptions, newSubscription]);
  };

  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    const updated = subscriptions.map((sub) =>
      sub.id === id
        ? {
            ...sub,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        : sub
    );
    await saveSubscriptions(updated);
  };

  const deleteSubscription = async (id: string) => {
    const updated = subscriptions.filter((sub) => sub.id !== id);
    await saveSubscriptions(updated);
  };

  const getSubscriptionById = (id: string) => {
    return subscriptions.find((sub) => sub.id === id);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        getSubscriptionById,
        isLoading,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within SubscriptionProvider');
  }
  return context;
}
