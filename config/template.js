// ========================================
// KONFIGURACJA SZABLONU
// ========================================
// TEMPLATE_MODE = 0  -> Pokazuje menu z możliwością zmiany szablonu
// TEMPLATE_MODE = 1  -> Zawsze pokazuje szablon 1 (fotowoltaika)
// TEMPLATE_MODE = 2  -> Zawsze pokazuje szablon 2 (fotowoltaika-v2)
// TEMPLATE_MODE = 3  -> Zawsze pokazuje szablon 3 (fotowoltaika-v3)
// TEMPLATE_MODE = 4  -> Zawsze pokazuje szablon 4 (fotowoltaika-v4)
// TEMPLATE_MODE = 5  -> Zawsze pokazuje szablon 5 (fotowoltaika-v5)

export const TEMPLATE_MODE = 0;  // <-- ZMIEŃ TU: 0 = menu, 1-5 = konkretny szablon

export const templateMap = {
  0: 'fotowoltaika',        // domyślny gdy menu
  1: 'fotowoltaika',
  2: 'fotowoltaika-v2',
  3: 'fotowoltaika-v3',
  4: 'fotowoltaika-v4',
  5: 'fotowoltaika-v5'
};

export function getTemplateId(searchParams) {
  if (TEMPLATE_MODE === 0) {
    return searchParams?.template || templateMap[0];
  } else {
    return templateMap[TEMPLATE_MODE] || templateMap[1];
  }
}

export function shouldShowSwitcher() {
  return TEMPLATE_MODE === 0;
}
