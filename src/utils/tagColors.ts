// Tag color categorization system with fallback
// Maps tag names to semantic color categories from the design system

type TagColorCategory = 
  | 'equipment'   // Blue - technical/reliability
  | 'soil'        // Green - growth/health
  | 'market'      // Amber - financial
  | 'safety'      // Red - caution/alert
  | 'default';    // Gray - neutral fallback

interface TagColorMap {
  [key: string]: TagColorCategory;
}

// Central mapping of tags to color categories
const tagColorMap: TagColorMap = {
  // Equipment & Maintenance (Blue)
  'equipment': 'equipment',
  'maintenance': 'equipment',
  'combine': 'equipment',
  'parts': 'equipment',
  'manual': 'equipment',
  
  // Soil & Fertility (Green)
  'soil': 'soil',
  'soil-health': 'soil',
  'soil-test': 'soil',
  'fertility': 'soil',
  'analysis': 'soil',
  'laboratory': 'soil',
  'plant-health': 'soil',
  'agronomy': 'soil',
  'organic-matter': 'soil',
  'carbon': 'soil',
  'regenerative': 'soil',
  'sustainability': 'soil',
  
  // Market & Financial (Amber)
  'market': 'market',
  'pricing': 'market',
  'canola': 'market',
  'trading': 'market',
  
  // Safety & Emergency (Red)
  'safety': 'safety',
  'emergency': 'safety',
  'protocols': 'safety',
  'hazard': 'safety',
};

/**
 * Get the color category for a tag
 * Returns 'default' for unmapped tags
 */
export function getTagColorCategory(tag: string): TagColorCategory {
  const normalizedTag = tag.toLowerCase().trim();
  return tagColorMap[normalizedTag] || 'default';
}

/**
 * Get Tailwind class names for a tag based on its color category
 * Returns both background and text color classes for proper contrast
 */
export function getTagColorClasses(tag: string): string {
  const category = getTagColorCategory(tag);
  
  switch (category) {
    case 'equipment':
      return 'bg-trader-light text-trader border-trader/30';
    case 'soil':
      return 'bg-farmer-light text-farmer border-farmer/30';
    case 'market':
      return 'bg-accounting-light text-accounting border-accounting/30';
    case 'safety':
      return 'bg-destructive/10 text-destructive border-destructive/30';
    case 'default':
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}

/**
 * Add a new tag mapping (for dynamic expansion)
 * This allows runtime addition of new semantic categories
 */
export function addTagMapping(tag: string, category: TagColorCategory): void {
  tagColorMap[tag.toLowerCase().trim()] = category;
}
