// ========================================
// KONFIGURACJA SZABLONU
// ========================================

// WYBIERZ BRANŻĘ - zmień tutaj na: fotowoltaika, instalator, budowlana, medyczny, fryzjer, warsztat
const SELECTED_INDUSTRY = 'fotowoltaika';

// SELECTED_TEMPLATE:
// 0 = tryb demo - pokazuje przełącznik szablonów (fotowoltaika-v1 do v5)
// 1 = zawsze szablon 1 (fotowoltaika)
// 2 = zawsze szablon 2 (fotowoltaika-v2)
// 3 = zawsze szablon 3 (fotowoltaika-v3)
// 4 = zawsze szablon 4 (fotowoltaika-v4)
// 5 = zawsze szablon 5 (fotowoltaika-v5)
const SELECTED_TEMPLATE = 0;

export const TEMPLATE_MODE = SELECTED_TEMPLATE;  

// Mapa szablonów dla branży fotowoltaika
const fotowoltaikaTemplates = {
  0: 'fotowoltaika',        // domyślny gdy demo
  1: 'fotowoltaika',
  2: 'fotowoltaika-v2',
  3: 'fotowoltaika-v3',
  4: 'fotowoltaika-v4',
  5: 'fotowoltaika-v5'
};

// Dla innych branż używamy tylko jednego szablonu
const industryTemplates = {
  'fotowoltaika': fotowoltaikaTemplates,
  'instalator': { 0: 'instalator', 1: 'instalator' },
  'budowlana': { 0: 'budowlana', 1: 'budowlana' },
  'medyczny': { 0: 'medyczny', 1: 'medyczny' },
  'fryzjer': { 0: 'fryzjer', 1: 'fryzjer' },
  'warsztat': { 0: 'warsztat', 1: 'warsztat' }
};

export const templateMap = industryTemplates[SELECTED_INDUSTRY] || fotowoltaikaTemplates;

export function getTemplateId(searchParams) {
  if (TEMPLATE_MODE === 0) {
    // Tryb demo - umożliwia zmianę przez URL lub pokazuje domyślny
    const requestedTemplate = searchParams?.template;
    
    // Jeśli branża to fotowoltaika i jest podany template w URL, użyj go
    if (SELECTED_INDUSTRY === 'fotowoltaika' && requestedTemplate) {
      return requestedTemplate;
    }
    
    return templateMap[0];
  } else {
    // Konkretny szablon - zawsze ten sam
    return templateMap[TEMPLATE_MODE] || templateMap[1];
  }
}

export function shouldShowSwitcher() {
  // Pokazuj przełącznik tylko gdy:
  // 1. SELECTED_TEMPLATE = 0 (tryb demo)
  // 2. Branża to fotowoltaika (bo tylko ona ma 5 wersji)
  return TEMPLATE_MODE === 0 && SELECTED_INDUSTRY === 'fotowoltaika';
}

// Export dla łatwego dostępu
export { SELECTED_INDUSTRY, SELECTED_TEMPLATE };
