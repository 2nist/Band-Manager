/**
 * TabNavigation.jsx - Tab switching UI
 * 
 * Provides consistent tab navigation with icons
 * and active state styling
 */
export const TabNavigation = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex gap-1 px-2 py-1 overflow-x-auto border-b bg-muted border-border/20 flex-shrink-0">
    {tabs.map(tab => {
      const IconComponent = tab.icon;
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          title={tab.label}
          className={`px-2 py-1 rounded-md flex items-center gap-1.5 whitespace-nowrap transition-all text-xs font-medium flex-shrink-0 ${
            isActive
              ? 'bg-primary text-primary-foreground border border-primary'
              : 'bg-input text-muted-foreground border border-transparent hover:bg-input/80 hover:border-primary/40'
          }`}
        >
          {IconComponent && <IconComponent size={14} />}
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      );
    })}
  </div>
);
