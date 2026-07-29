import PantryPanel from './PantryPanel.jsx'
import RecipeLibrary from './RecipeLibrary.jsx'
import StatsSidebar from './StatsSidebar.jsx'

const TABS = [
  { id: 'ingredients', label: 'Ingredients' },
  { id: 'recipes', label: 'Recipes' },
  { id: 'stats', label: 'Data' },
]

export default function SidebarTabs({ activeTab, onTabChange, recipeLibraryProps, pantryPanelProps, statsProps }) {
  return (
    <section className="pantry-panel" aria-label="Pantry, recipe library, and cooking data">
      <div className="sidebar-tabs" role="tablist" aria-label="Sidebar sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`sidebar-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`sidebar-panel-${tab.id}`}
            className="sidebar-tabs__tab"
            data-active={activeTab === tab.id ? 'true' : 'false'}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id="sidebar-panel-ingredients"
        role="tabpanel"
        aria-labelledby="sidebar-tab-ingredients"
        hidden={activeTab !== 'ingredients'}
      >
        {activeTab === 'ingredients' && <PantryPanel {...pantryPanelProps} />}
      </div>
      <div
        id="sidebar-panel-recipes"
        role="tabpanel"
        aria-labelledby="sidebar-tab-recipes"
        hidden={activeTab !== 'recipes'}
      >
        {activeTab === 'recipes' && <RecipeLibrary {...recipeLibraryProps} />}
      </div>
      <div
        id="sidebar-panel-stats"
        role="tabpanel"
        aria-labelledby="sidebar-tab-stats"
        hidden={activeTab !== 'stats'}
      >
        {activeTab === 'stats' && <StatsSidebar {...statsProps} />}
      </div>
    </section>
  )
}
