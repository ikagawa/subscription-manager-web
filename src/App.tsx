import React, { useState } from 'react';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { Home } from './pages/Home';
import { ListPage } from './pages/List';
import { Settings } from './pages/Settings';
import { AddModal } from './components/AddModal';
import { Home as HomeIcon, List as ListIcon, Settings as SettingsIcon } from 'lucide-react';

type Page = 'home' | 'list' | 'settings';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {currentPage === 'home' && <Home />}
        {currentPage === 'list' && <ListPage />}
        {currentPage === 'settings' && <Settings />}
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto flex justify-around">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition ${
              currentPage === 'home'
                ? 'text-primary'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <HomeIcon size={24} />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => setCurrentPage('list')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition ${
              currentPage === 'list'
                ? 'text-primary'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <ListIcon size={24} />
            <span className="text-xs font-medium">List</span>
          </button>
          <button
            onClick={() => setCurrentPage('settings')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition ${
              currentPage === 'settings'
                ? 'text-primary'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <SettingsIcon size={24} />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </nav>

      {/* Add Modal */}
      {showAddModal && <AddModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <SubscriptionProvider>
      <AppContent />
    </SubscriptionProvider>
  );
}
