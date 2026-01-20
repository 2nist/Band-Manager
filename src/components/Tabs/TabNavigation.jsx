/**
 * TabNavigation.jsx - Tab switching UI
 * 
 * Provides consistent tab navigation with icons
 * and active state styling
 */
export const TabNavigation = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex gap-2 px-8 py-4 overflow-x-auto border-b bg-muted border-border/20">
    {tabs.map(tab => {
      const IconComponent = tab.icon;
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          title={tab.label}
          className={`px-4 py-3 rounded-md flex items-center gap-2 whitespace-nowrap transition-all text-sm font-medium ${
            isActive
              ? 'bg-primary text-primary-foreground border-2 border-primary'
              : 'bg-input text-muted-foreground border-2 border-border/20 hover:bg-input/80 hover:border-primary/40'
          }`}
        >
          {IconComponent && <IconComponent size={16} />}
          {tab.label}
        </button>
      );
    })}
  </div>
);
