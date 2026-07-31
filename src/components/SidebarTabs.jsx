import { useEffect, useRef, useState } from 'react'
import PantryPanel from './PantryPanel.jsx'
import RecipeLibrary from './RecipeLibrary.jsx'
import FavoritesSidebar from './FavoritesSidebar.jsx'
import StatsSidebar from './StatsSidebar.jsx'

const TABS = [
  { id: 'ingredients', label: 'Ingredients' },
  { id: 'recipes', label: 'Recipes' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'stats', label: 'Data' },
]

function SectionToggle({ section, onSectionChange }) {
  return (
    <div className="section-toggle" data-active={section} role="tablist" aria-label="Food or drinks">
      <div className="section-toggle__pill">
        <div className="section-toggle__indicator" />
        <button
          type="button"
          role="tab"
          aria-selected={section === 'food'}
          className="section-toggle__option"
          data-active={section === 'food' ? 'true' : 'false'}
          onClick={() => onSectionChange('food')}
        >
          Food
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={section === 'drink'}
          className="section-toggle__option"
          data-active={section === 'drink' ? 'true' : 'false'}
          onClick={() => onSectionChange('drink')}
        >
          Drinks
        </button>
      </div>
    </div>
  )
}

export default function SidebarTabs({
  activeTab,
  onTabChange,
  section,
  onSectionChange,
  recipeLibraryProps,
  pantryPanelProps,
  favoritesSidebarProps,
  statsProps,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isPanelExpanded, setIsPanelExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 860px)').matches)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const lastScrollYRef = useRef(0)

  // The compact/collapse behavior only makes sense on mobile — desktop
  // keeps the panel fully visible and normally scrollable regardless of
  // breakpoint, so resizing never leaves the sidebar stuck in a collapsed
  // state.
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 860px)')
    const handleChange = (event) => setIsMobile(event.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  // Once the pantry section has collapsed, scrolling further down hides the
  // hamburger bar and scrolling back up brings it back — same idea as the
  // panel's own compact state, just tracking scroll direction instead of
  // scroll position.
  useEffect(() => {
    if (!isMobile) {
      setIsScrollingDown(false)
      return undefined
    }

    lastScrollYRef.current = window.scrollY

    function handleScroll() {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollYRef.current
      if (Math.abs(delta) > 4) {
        setIsScrollingDown(delta > 0)
        lastScrollYRef.current = currentScrollY
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  // While the expanded panel is showing as a fixed overlay, freeze the
  // page underneath it. Without this, selecting a filter/ingredient can
  // resize the recipe grid below the fold, and the browser's own
  // scroll-anchoring reacts by jumping the page to an unrelated position.
  useEffect(() => {
    if (!(isMobile && isPanelExpanded)) return undefined

    const scrollY = window.scrollY
    const { body } = document
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'

    return () => {
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      window.scrollTo(0, scrollY)
    }
  }, [isMobile, isPanelExpanded])

  function selectTab(tabId) {
    onTabChange(tabId)
    setIsMobileMenuOpen(false)
  }

  function selectSection(nextSection) {
    onSectionChange(nextSection)
    setIsMobileMenuOpen(false)
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen((current) => !current)
    setIsScrollingDown(false)
  }

  const isCompactMode = isMobile
  const showFullContent = !isCompactMode || isPanelExpanded
  const isHeaderHidden = isCompactMode && isScrollingDown && !isMobileMenuOpen

  return (
    <>
      <div className="sidebar-tabs-wrap" data-hidden={isHeaderHidden ? 'true' : 'false'}>
        <div className="sidebar-tabs" role="tablist" aria-label="Sidebar sections">
          <div className="sidebar-tabs__group">
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

          <SectionToggle section={section} onSectionChange={onSectionChange} />

          <button
            type="button"
            className="sidebar-tabs__menu-toggle"
            aria-expanded={isMobileMenuOpen}
            aria-label="Menu"
            onClick={toggleMobileMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className="collapsible sidebar-tabs__mobile-menu" data-open={isMobileMenuOpen ? 'true' : 'false'}>
          <div className="collapsible__inner">
            <SectionToggle section={section} onSectionChange={selectSection} />
            <div className="sidebar-tabs__mobile-list" role="tablist" aria-label="Sidebar sections">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className="sidebar-tabs__tab sidebar-tabs__tab--mobile"
                  data-active={activeTab === tab.id ? 'true' : 'false'}
                  onClick={() => selectTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pantry-panel-wrap">
        <section
          className="pantry-panel"
          data-compact={isCompactMode ? 'true' : 'false'}
          data-expanded={isPanelExpanded ? 'true' : 'false'}
          data-header-hidden={isHeaderHidden ? 'true' : 'false'}
          aria-label="Pantry, recipe library, and cooking data"
        >
          {isCompactMode && (
            <button
              type="button"
              className="pantry-panel__compact-bar"
              aria-expanded={isPanelExpanded}
              onClick={() => setIsPanelExpanded((current) => !current)}
            >
              <span>The Pantry</span>
              <span className="pantry-panel__compact-chevron" data-open={isPanelExpanded ? 'true' : 'false'}>
                ▾
              </span>
            </button>
          )}
          <div className="collapsible pantry-panel__body" data-open={showFullContent ? 'true' : 'false'}>
            <div className="collapsible__inner">
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
                id="sidebar-panel-favorites"
                role="tabpanel"
                aria-labelledby="sidebar-tab-favorites"
                hidden={activeTab !== 'favorites'}
              >
                {activeTab === 'favorites' && <FavoritesSidebar {...favoritesSidebarProps} />}
              </div>
              <div
                id="sidebar-panel-stats"
                role="tabpanel"
                aria-labelledby="sidebar-tab-stats"
                hidden={activeTab !== 'stats'}
              >
                {activeTab === 'stats' && <StatsSidebar {...statsProps} />}
              </div>
              {isCompactMode && isPanelExpanded && (
                <button type="button" className="pantry-panel__collapse-bar" onClick={() => setIsPanelExpanded(false)}>
                  Collapse ▴
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
