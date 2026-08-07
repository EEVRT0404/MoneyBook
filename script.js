const STORAGE_KEY = 'records';
const BUDGET_KEY = 'budget';
const THEME_KEY = 'theme';
const DEFAULT_TYPE_KEY = 'defaultType';
const EXPENSE_CATEGORY_KEY = 'expenseCategories';
const INCOME_CATEGORY_KEY = 'incomeCategories';
const CATEGORY_ICON_KEY = 'categoryIcons';
const PLUGIN_STATE_KEY = 'pluginStates';
const QUICK_TEMPLATE_KEY = 'quickTemplatesData';
const DEBT_RECORD_KEY = 'debtRecords';
const THEME_PACK_KEY = 'themePackChoice';
const CURRENCY_KEY = 'selectedCurrency';
const SAVINGS_GOAL_KEY = 'savingsGoal';
const BILL_REMINDERS_KEY = 'billReminders';
const APP_LOCK_KEY = 'appLockPasscode';
const RECEIPT_SCAN_KEY = 'receiptScanData';
const SHARED_LEDGER_KEY = 'sharedLedgerName';
const CLOUD_BACKUP_KEY = 'cloudBackupData';
const LAST_BACKUP_TIME_KEY = 'lastBackupTime';
const RECURRING_KEY = 'recurringExpensesData';

const pluginCatalog = [
  {
    id: 'calculator',
    name: '小算盤',
    description: '在新增記帳頁快速計算金額，方便輸入支出與收入。',
    defaultEnabled: true,
  },
];

const themePackPalette = {
  default: {
    bg: '#eef5ff',
    text: '#223459',
    textMuted: '#6b7a99',
    primary: '#4f8cff',
    secondary: '#6473f0',
    success: '#45c490',
    danger: '#ff5f6a',
    cardBorder: 'rgba(79, 140, 255, 0.16)',
    panel: 'rgba(255, 255, 255, 0.9)',
    soft: 'rgba(79, 140, 255, 0.07)',
    shadowSoft: '0 16px 40px rgba(79, 140, 255, 0.12)',
    shadowStrong: '0 20px 48px rgba(31, 69, 143, 0.18)',
    appBgTop: '#f8fbff',
    appBgBottom: '#eef4ff',
    appAccentLeft: 'rgba(130, 178, 255, 0.35)',
    appAccentRight: 'rgba(102, 119, 248, 0.2)',
    bottomNavBg: 'rgba(255, 255, 255, 0.92)',
    bottomNavShadow: '0 -6px 24px rgba(76, 110, 181, 0.12)',
  },
  ocean: {
    bg: '#f4fbff',
    text: '#18436a',
    textMuted: '#5c7897',
    primary: '#2a78cc',
    secondary: '#4e9bd8',
    success: '#2f9d93',
    danger: '#ee6b73',
    cardBorder: 'rgba(42, 120, 204, 0.18)',
    panel: 'rgba(255, 255, 255, 0.9)',
    soft: 'rgba(42, 120, 204, 0.08)',
    shadowSoft: '0 16px 40px rgba(42, 120, 204, 0.16)',
    shadowStrong: '0 20px 48px rgba(12, 72, 146, 0.18)',
    appBgTop: '#f3fbff',
    appBgBottom: '#dfeeff',
    appAccentLeft: 'rgba(95, 179, 244, 0.32)',
    appAccentRight: 'rgba(32, 108, 198, 0.22)',
    bottomNavBg: 'rgba(255, 255, 255, 0.92)',
    bottomNavShadow: '0 -6px 24px rgba(42, 120, 204, 0.14)',
  },
  forest: {
    bg: '#f4fbf7',
    text: '#1f3d31',
    textMuted: '#5d7d6e',
    primary: '#228b66',
    secondary: '#59b37d',
    success: '#32a56b',
    danger: '#df5b5b',
    cardBorder: 'rgba(34, 139, 102, 0.18)',
    panel: 'rgba(255, 255, 255, 0.9)',
    soft: 'rgba(34, 139, 102, 0.08)',
    shadowSoft: '0 16px 40px rgba(34, 139, 102, 0.14)',
    shadowStrong: '0 20px 48px rgba(28, 107, 75, 0.2)',
    appBgTop: '#f6fff9',
    appBgBottom: '#e3f8eb',
    appAccentLeft: 'rgba(109, 200, 147, 0.32)',
    appAccentRight: 'rgba(58, 149, 113, 0.2)',
    bottomNavBg: 'rgba(255, 255, 255, 0.92)',
    bottomNavShadow: '0 -6px 24px rgba(34, 139, 102, 0.16)',
  },
  sunset: {
    bg: '#fff8f4',
    text: '#72442d',
    textMuted: '#9d7965',
    primary: '#d8743b',
    secondary: '#f0a45a',
    success: '#58a68a',
    danger: '#e76866',
    cardBorder: 'rgba(216, 116, 59, 0.18)',
    panel: 'rgba(255, 255, 255, 0.92)',
    soft: 'rgba(216, 116, 59, 0.09)',
    shadowSoft: '0 16px 40px rgba(216, 116, 59, 0.16)',
    shadowStrong: '0 20px 48px rgba(174, 76, 26, 0.18)',
    appBgTop: '#fff8f3',
    appBgBottom: '#ffe7d3',
    appAccentLeft: 'rgba(242, 175, 115, 0.36)',
    appAccentRight: 'rgba(216, 116, 59, 0.2)',
    bottomNavBg: 'rgba(255, 255, 255, 0.92)',
    bottomNavShadow: '0 -6px 24px rgba(216, 116, 59, 0.16)',
  },
};

const defaultExpenseCategories = ['食物', '交通', '醫療', '娛樂', '電腦', '房租', '水電', '保險', '教育', '服飾', '禮物', '其他'];
const defaultIncomeCategories = ['薪水', '獎金', '投資', '禮金', '紅包', '其他'];

function safeParseJSON(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

let records = safeParseJSON(localStorage.getItem(STORAGE_KEY), []);
let debtRecords = safeParseJSON(localStorage.getItem(DEBT_RECORD_KEY), []);
let expenseCategories = safeParseJSON(localStorage.getItem(EXPENSE_CATEGORY_KEY), defaultExpenseCategories);
let incomeCategories = safeParseJSON(localStorage.getItem(INCOME_CATEGORY_KEY), defaultIncomeCategories);
let deferredInstallPrompt = null;
let canPromptPwaInstall = false;

function formatNumber(value) {
  return new Intl.NumberFormat('zh-TW').format(Math.max(0, Number(value) || 0));
}

function normalizeRecordDate(date) {
  if (!date) return new Date().toISOString().slice(0, 10);
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString().slice(0, 10) : parsed.toISOString().slice(0, 10);
}

function parseRecordDate(date) {
  if (!date) return null;
  const iso = String(date).slice(0, 10);
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatRecordDate(date) {
  const parsed = parseRecordDate(date);
  if (!parsed) return date || '';
  return parsed.toLocaleDateString('zh-TW');
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function loadBudget() {
  return Number(localStorage.getItem(BUDGET_KEY) || 0);
}

function saveBudget(value) {
  localStorage.setItem(BUDGET_KEY, String(value));
}

function loadDefaultType() {
  return localStorage.getItem(DEFAULT_TYPE_KEY) || 'expense';
}

function saveDefaultType(type) {
  localStorage.setItem(DEFAULT_TYPE_KEY, type);
}

function saveCategoryLists() {
  localStorage.setItem(EXPENSE_CATEGORY_KEY, JSON.stringify(expenseCategories));
  localStorage.setItem(INCOME_CATEGORY_KEY, JSON.stringify(incomeCategories));
}

function getCategoryIcons() {
  return safeParseJSON(localStorage.getItem(CATEGORY_ICON_KEY), {});
}

function saveCategoryIcon(category, icon) {
  const map = getCategoryIcons();
  map[category] = icon;
  localStorage.setItem(CATEGORY_ICON_KEY, JSON.stringify(map));
}

function loadDebtRecords() {
  return safeParseJSON(localStorage.getItem(DEBT_RECORD_KEY), []);
}

function saveDebtRecords(recordsToSave) {
  localStorage.setItem(DEBT_RECORD_KEY, JSON.stringify(recordsToSave));
  debtRecords = recordsToSave;
}

function createDebtRecord(data) {
  return {
    id: `debt-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: data.type,
    person: data.person,
    amount: Number(data.amount) || 0,
    note: data.note || '',
    date: normalizeRecordDate(data.date),
    cleared: false,
  };
}

function deleteDebtRecord(id) {
  const index = debtRecords.findIndex((record) => record.id === id);
  if (index < 0) return;
  debtRecords.splice(index, 1);
  saveDebtRecords(debtRecords);
}

function toggleDebtCleared(id) {
  const record = debtRecords.find((item) => item.id === id);
  if (!record) return;
  record.cleared = !record.cleared;
  saveDebtRecords(debtRecords);
}

function formatDebtLabel(type) {
  return type === 'owedToMe' ? '別人欠我' : '我欠別人';
}

function applyTheme(mode) {
  const isDark = mode === 'dark';
  document.body.classList.toggle('theme-dark', isDark);
  document.documentElement.classList.toggle('theme-dark', isDark);
}

function loadThemePack() {
  const storedPack = localStorage.getItem(THEME_PACK_KEY);
  const normalizedPack = themePackPalette[storedPack] ? storedPack : 'default';

  if (storedPack !== normalizedPack) {
    localStorage.setItem(THEME_PACK_KEY, normalizedPack);
  }

  return normalizedPack;
}

function applyThemePack(pack = loadThemePack()) {
  const chosenPack = themePackPalette[pack] || themePackPalette.default;
  const root = document.documentElement;

  Object.entries(chosenPack).forEach(([key, value]) => {
    root.style.setProperty(`--${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`, value);
  });
}

function saveThemePack(pack) {
  const normalizedPack = themePackPalette[pack] ? pack : 'default';
  localStorage.setItem(THEME_PACK_KEY, normalizedPack);
  applyThemePack(normalizedPack);
}

function saveTheme(mode) {
  localStorage.setItem(THEME_KEY, mode);
  applyTheme(mode);
}

function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function isStandalonePwa() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function updateInstallAppButton() {
  const installBtn = document.getElementById('install-app');
  const installItem = installBtn?.closest('.settings-item');
  if (!installBtn || !installItem) return;

  if (isStandalonePwa()) {
    installItem.style.display = 'none';
    return;
  }

  installItem.style.display = canPromptPwaInstall ? 'block' : 'none';
}

function loadPluginStates() {
  return safeParseJSON(localStorage.getItem(PLUGIN_STATE_KEY), {});
}

function savePluginStates(states) {
  localStorage.setItem(PLUGIN_STATE_KEY, JSON.stringify(states));
}

function getPluginStateMap() {
  const states = loadPluginStates();
  const nextMap = {};
  pluginCatalog.forEach((plugin) => {
    nextMap[plugin.id] = states[plugin.id] ?? plugin.defaultEnabled;
  });
  return nextMap;
}

function pluginIsEnabled(pluginId) {
  return !!getPluginStateMap()[pluginId];
}

function renderPluginsPage() {
  const pluginList = document.getElementById('plugin-list');
  const pluginConfigs = document.getElementById('plugin-configs');
  if (!pluginList || !pluginConfigs) return;

  const stateMap = getPluginStateMap();
  pluginList.innerHTML = '';

  pluginCatalog.forEach((plugin) => {
    const item = document.createElement('li');
    item.className = 'settings-item settings-toggle-row';
    item.innerHTML = `
      <div class="settings-icon"><i class="fa-solid fa-calculator"></i></div>
      <span class="settings-item-text">
        <span class="settings-item-label">${plugin.name}</span>
        <span class="settings-item-desc">${plugin.description}</span>
      </span>
      <label class="switch">
        <input id="plugin-toggle-${plugin.id}" type="checkbox" ${stateMap[plugin.id] ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
    `;
    pluginList.appendChild(item);

    const toggle = document.getElementById(`plugin-toggle-${plugin.id}`);
    toggle?.addEventListener('change', () => {
      const nextMap = getPluginStateMap();
      nextMap[plugin.id] = toggle.checked;
      savePluginStates(nextMap);
      renderPluginsPage();
      renderPluginControls();
      showToast(`${plugin.name} ${toggle.checked ? '已啟用' : '已停用'}`, 'success');
    });
  });

  const enabledPlugins = pluginCatalog.filter((plugin) => pluginIsEnabled(plugin.id));
  if (!enabledPlugins.length) {
    pluginConfigs.innerHTML = '<p class="empty-msg">目前沒有啟用中的擴充功能</p>';
    return;
  }

  pluginConfigs.innerHTML = enabledPlugins.map((plugin) => {
    if (plugin.id === 'calculator') {
      return `
        <div class="plugin-config-card">
          <div class="settings-card-title">${plugin.name} 介紹</div>
          <p class="settings-item-desc">啟用後，新增記帳頁會額外顯示小算盤，讓你直接在表單中計算金額。</p>
        </div>
      `;
    }
    return `
      <div class="plugin-config-card">
        <div class="settings-card-title">${plugin.name} 設定</div>
        <p class="settings-item-desc">此擴充功能已啟用。</p>
      </div>
    `;
  }).join('');
}

function renderPluginControls() {
  const container = document.getElementById('plugin-extra-controls');
  if (!container) return;

  if (!pluginIsEnabled('calculator')) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="plugin-calculator-card">
      <div class="calculator-header">
        <span class="calculator-title">小算盤</span>
        <span class="calculator-tip">快速計算</span>
      </div>
      <div class="calculator-top-row">
        <input id="calculator-display" type="text" value="0" readonly>
        <button id="calculator-send" class="primary-btn" type="button">送入金額</button>
      </div>
      <div class="calculator-grid">
        <button class="calculator-btn" data-value="7" type="button">7</button>
        <button class="calculator-btn" data-value="8" type="button">8</button>
        <button class="calculator-btn" data-value="9" type="button">9</button>
        <button class="calculator-btn operator-btn" data-value="/" type="button">÷</button>
        <button class="calculator-btn" data-value="4" type="button">4</button>
        <button class="calculator-btn" data-value="5" type="button">5</button>
        <button class="calculator-btn" data-value="6" type="button">6</button>
        <button class="calculator-btn operator-btn" data-value="*" type="button">×</button>
        <button class="calculator-btn" data-value="1" type="button">1</button>
        <button class="calculator-btn" data-value="2" type="button">2</button>
        <button class="calculator-btn" data-value="3" type="button">3</button>
        <button class="calculator-btn operator-btn" data-value="-" type="button">-</button>
        <button class="calculator-btn" data-value="0" type="button">0</button>
        <button class="calculator-btn" data-value="." type="button">.</button>
        <button class="calculator-btn equal-btn" data-value="=" type="button">=</button>
        <button class="calculator-btn operator-btn" data-value="+" type="button">+</button>
        <button class="calculator-btn wide-btn" data-value="C" type="button">清除</button>
        <button class="calculator-btn wide-btn" data-value="DEL" type="button">刪除</button>
      </div>
    </div>
  `;

  const display = document.getElementById('calculator-display');
  let expression = '';

  const updateDisplay = (value) => {
    display.value = value;
  };

  const appendValue = (value) => {
    if (value === 'C') {
      expression = '';
      updateDisplay('0');
      return;
    }
    if (value === 'DEL') {
      expression = expression.slice(0, -1);
      updateDisplay(expression || '0');
      return;
    }
    if (value === '=') {
      try {
        const safeExpression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/／/g, '/');
        const sanitized = safeExpression.replace(/[^0-9+\-*/().]/g, '');
        if (!sanitized) {
          updateDisplay('0');
          return;
        }
        const result = Function(`"use strict"; return (${sanitized});`)();
        if (!Number.isFinite(result)) {
          throw new Error('不支援這個運算');
        }
        expression = String(Number(result));
        updateDisplay(expression);
      } catch {
        showToast('請輸入有效的計算式', 'warning');
      }
      return;
    }

    expression += value;
    updateDisplay(expression);
  };

  container.querySelectorAll('.calculator-btn').forEach((button) => {
    button.addEventListener('click', () => appendValue(button.dataset.value));
  });

  const calculatorKeydownHandler = (event) => {
    const activeTag = document.activeElement?.tagName;
    const isTypingInTextField = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT';
    if (isTypingInTextField) {
      return;
    }

    const key = event.key;
    if (/^[0-9.]$/.test(key)) {
      event.preventDefault();
      appendValue(key);
      return;
    }

    if (['+', '-', '*', '/'].includes(key)) {
      event.preventDefault();
      appendValue(key);
      return;
    }

    if (key === 'Enter' || key === '=') {
      event.preventDefault();
      appendValue('=');
      return;
    }

    if (key === 'Backspace' || key === 'Delete') {
      event.preventDefault();
      appendValue('DEL');
      return;
    }

    if (key === 'Escape') {
      event.preventDefault();
      appendValue('C');
    }
  };

  document.addEventListener('keydown', calculatorKeydownHandler);

  document.getElementById('calculator-send')?.addEventListener('click', () => {
    const amountInput = document.getElementById('amount');
    const displayValue = Number(display.value);
    if (!amountInput || Number.isNaN(displayValue)) {
      showToast('小算盤目前沒有可送入的金額', 'warning');
      return;
    }
    amountInput.value = displayValue;
    showToast('金額已送入小算盤結果', 'success');
  });
}

function showToast(message, type = 'default', timeout = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 250);
  }, timeout);
}

function getSelectedType() {
  const checked = document.querySelector('input[name="record-type"]:checked');
  return checked ? checked.value : 'expense';
}

function updateCategoryOptions() {
  const categorySelect = document.getElementById('category');
  if (!categorySelect) return;
  const type = getSelectedType();
  const list = type === 'income' ? incomeCategories : expenseCategories;
  const icons = getCategoryIcons();
  categorySelect.innerHTML = '';
  list.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = icons[category] ? `${icons[category]} ${category}` : category;
    categorySelect.appendChild(option);
  });
}

function bindCategoryChangeIcon() {
  const categorySelect = document.getElementById('category');
  if (!categorySelect) return;
  categorySelect.onchange = () => {
    const icons = getCategoryIcons();
    const selected = categorySelect.value;
    const iconField = document.getElementById('icon');
    if (iconField && icons[selected]) {
      iconField.value = icons[selected];
    }
  };
}

function addRecord() {
  const itemInput = document.getElementById('item');
  const amountInput = document.getElementById('amount');
  const categoryInput = document.getElementById('category');
  const noteInput = document.getElementById('note');
  const dateInput = document.getElementById('date');

  if (!itemInput || !amountInput || !categoryInput || !noteInput) return;

  const item = itemInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;
  const note = noteInput.value.trim();
  const type = getSelectedType();

  if (!item) return showToast('請輸入項目名稱', 'warning');
  if (!amount || amount <= 0) return showToast('請輸入正確金額', 'warning');

  const icons = getCategoryIcons();
  const record = {
    date: normalizeRecordDate(dateInput?.value || new Date()),
    item,
    amount,
    category,
    type,
    note,
    icon: icons[category] || '💸',
  };

  records.push(record);
  saveRecords();

  try {
    sessionStorage.setItem('pendingToast', JSON.stringify({ message: '新增成功！', type: 'success', timeout: 3000 }));
  } catch {}

  window.location.href = 'index.html';
}

function deleteRecord(index) {
  if (index < 0 || index >= records.length) return;
  records.splice(index, 1);
  saveRecords();
  renderCurrentPage();
}

function renderHome() {
  const incomeEl = document.getElementById('income');
  const expenseEl = document.getElementById('expense');
  const budgetEl = document.getElementById('budget-text');
  const balanceEl = document.getElementById('balance');
  const recentList = document.getElementById('recent-list');
  const emptyMsg = document.getElementById('empty-msg');

  if (!incomeEl || !expenseEl || !budgetEl || !balanceEl || !recentList || !emptyMsg) return;

  const budget = loadBudget();
  const totalIncome = records.filter((r) => r.type === 'income').reduce((sum, r) => sum + Number(r.amount), 0);
  const totalExpense = records.filter((r) => r.type === 'expense').reduce((sum, r) => sum + Number(r.amount), 0);

  incomeEl.textContent = `NT$${formatNumber(totalIncome)}`;
  expenseEl.textContent = `NT$${formatNumber(totalExpense)}`;
  budgetEl.textContent = `NT$${formatNumber(budget)}`;
  balanceEl.textContent = `NT$${formatNumber(budget + totalIncome - totalExpense)}`;

  recentList.innerHTML = '';
  const recentRecords = [...records]
    .sort((a, b) => {
      const aTime = parseRecordDate(a.date)?.getTime() || 0;
      const bTime = parseRecordDate(b.date)?.getTime() || 0;
      return bTime - aTime;
    })
    .slice(0, 5);

  if (!recentRecords.length) {
    emptyMsg.style.display = 'block';
    return;
  }

  emptyMsg.style.display = 'none';
  recentRecords.forEach((record) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="record-top">
        <strong><span class="record-icon">${record.icon || '💸'}</span>${record.item}</strong>
        <span class="record-badge ${record.type === 'income' ? 'income' : 'expense'}">${record.type === 'income' ? '收入' : '支出'}</span>
      </div>
      <div class="record-bottom">
        <span>${record.category}</span>
        <span>${formatRecordDate(record.date)}</span>
        <span>NT$${formatNumber(record.amount)}</span>
      </div>
      <p class="record-note">${record.note || '無備註'}</p>
    `;
    recentList.appendChild(li);
  });
}

function renderDetail() {
  const filterType = document.getElementById('filter-type');
  const filterCategory = document.getElementById('filter-category');
  const searchInput = document.getElementById('filter-search');
  const startInput = document.getElementById('filter-start');
  const endInput = document.getElementById('filter-end');
  const list = document.getElementById('detail-list');
  const empty = document.getElementById('detail-empty');

  if (!filterType || !filterCategory || !searchInput || !list || !empty) return;

  const typeValue = filterType.value;
  const categoryValue = filterCategory.value;
  const searchValue = searchInput.value.trim().toLowerCase();
  const startValue = startInput?.value || '';
  const endValue = endInput?.value || '';

  const options = typeValue === 'income' ? incomeCategories : expenseCategories;
  filterCategory.innerHTML = '<option value="">全部分類</option>';
  options.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    if (categoryValue === category) option.selected = true;
    filterCategory.appendChild(option);
  });

  const filtered = records
    .filter((record) => {
      if (typeValue && record.type !== typeValue) return false;
      if (categoryValue && record.category !== categoryValue) return false;

      const recDate = parseRecordDate(record.date);
      if ((startValue || endValue) && !recDate) return false;
      if (startValue && recDate < new Date(startValue)) return false;
      if (endValue) {
        const endDate = new Date(endValue);
        endDate.setHours(23, 59, 59, 999);
        if (recDate > endDate) return false;
      }

      if (searchValue) {
        const haystack = `${record.item} ${record.note} ${record.category}`.toLowerCase();
        return haystack.includes(searchValue);
      }
      return true;
    })
    .sort((a, b) => {
      const aTime = parseRecordDate(a.date)?.getTime() || 0;
      const bTime = parseRecordDate(b.date)?.getTime() || 0;
      return bTime - aTime;
    });

  list.innerHTML = '';
  if (!filtered.length) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  filtered.forEach((record) => {
    const recordIndex = records.indexOf(record);
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="record-top">
        <strong><span class="record-icon">${record.icon || '💸'}</span>${record.item}</strong>
        <span class="record-badge ${record.type === 'income' ? 'income' : 'expense'}">${record.type === 'income' ? '收入' : '支出'}</span>
      </div>
      <div class="record-bottom">
        <span>${record.category}</span>
        <span>${formatRecordDate(record.date)}</span>
        <span>NT$${formatNumber(record.amount)}</span>
      </div>
      <p class="record-note">${record.note || '無備註'}</p>
      <button class="danger-btn" onclick="deleteRecord(${recordIndex})">刪除</button>
    `;
    list.appendChild(li);
  });
}

function renderStat() {
  const incomeTotalEl = document.getElementById('stat-income');
  const expenseTotalEl = document.getElementById('stat-expense');
  const balanceTotalEl = document.getElementById('stat-balance');
  const countEl = document.getElementById('record-count');
  const incomeBars = document.getElementById('income-bars');
  const expenseBars = document.getElementById('expense-bars');

  if (!incomeTotalEl || !expenseTotalEl || !balanceTotalEl || !countEl || !incomeBars || !expenseBars) return;

  const totalIncome = records.filter((r) => r.type === 'income').reduce((sum, r) => sum + Number(r.amount), 0);
  const totalExpense = records.filter((r) => r.type === 'expense').reduce((sum, r) => sum + Number(r.amount), 0);
  const budget = loadBudget();

  incomeTotalEl.textContent = `NT$${formatNumber(totalIncome)}`;
  expenseTotalEl.textContent = `NT$${formatNumber(totalExpense)}`;
  balanceTotalEl.textContent = `NT$${formatNumber(budget + totalIncome - totalExpense)}`;
  countEl.textContent = `${records.length} 筆記錄`;

  const incomeGroups = incomeCategories.map((category) => ({
    category,
    amount: records.filter((r) => r.type === 'income' && r.category === category).reduce((sum, r) => sum + Number(r.amount), 0),
  })).filter((group) => group.amount > 0);

  const expenseGroups = expenseCategories.map((category) => ({
    category,
    amount: records.filter((r) => r.type === 'expense' && r.category === category).reduce((sum, r) => sum + Number(r.amount), 0),
  })).filter((group) => group.amount > 0);

  incomeBars.innerHTML = incomeGroups.length ? incomeGroups.map((group) => `
    <div class="bar-item">
      <span class="bar-label">${group.category}</span>
      <div class="bar-track"><div class="bar-fill income" style="width:${Math.max(6, (group.amount / (incomeGroups.reduce((max, item) => Math.max(max, item.amount), 0) || 1)) * 100)}%"></div></div>
      <span class="bar-value">NT$${formatNumber(group.amount)}</span>
    </div>
  `).join('') : '<p class="empty-msg">尚無收入分類資料</p>';

  expenseBars.innerHTML = expenseGroups.length ? expenseGroups.map((group) => `
    <div class="bar-item">
      <span class="bar-label">${group.category}</span>
      <div class="bar-track"><div class="bar-fill expense" style="width:${Math.max(6, (group.amount / (expenseGroups.reduce((max, item) => Math.max(max, item.amount), 0) || 1)) * 100)}%"></div></div>
      <span class="bar-value">NT$${formatNumber(group.amount)}</span>
    </div>
  `).join('') : '<p class="empty-msg">尚無支出分類資料</p>';
}

function renderDebtPage() {
  const pageContent = document.getElementById('debt-page-content');
  if (!pageContent) return;

  const owedToMeTotal = debtRecords
    .filter((record) => record.type === 'owedToMe')
    .reduce((sum, record) => sum + Number(record.amount), 0);
  const owedByMeTotal = debtRecords
    .filter((record) => record.type === 'owedByMe')
    .reduce((sum, record) => sum + Number(record.amount), 0);

  pageContent.innerHTML = `
    <div class="debt-summary-grid">
      <div class="card">
        <strong>別人欠我</strong>
        <div class="debt-summary-value">NT$${formatNumber(owedToMeTotal)}</div>
      </div>
      <div class="card">
        <strong>我欠別人</strong>
        <div class="debt-summary-value">NT$${formatNumber(owedByMeTotal)}</div>
      </div>
    </div>
    <div class="debt-actions">
      <button id="toggle-debt-form" class="debt-tab-button active">新增欠款</button>
    </div>
    <div id="debt-modal" class="debt-modal hidden">
      <div class="debt-modal-panel">
        <div class="debt-modal-header">
          <div>
            <p class="sub-title">新增欠款紀錄</p>
            <h2>新增欠款</h2>
          </div>
          <button id="cancel-debt" class="icon-close" type="button">×</button>
        </div>
        <div id="debt-form" class="debt-form">
          <div class="template-form-row">
            <div class="template-type-group">
              <label><input type="radio" name="debt-type" value="owedToMe" checked> 別人欠我</label>
              <label><input type="radio" name="debt-type" value="owedByMe"> 我欠別人</label>
            </div>
          </div>
          <div class="template-form-row">
            <input id="debt-person" type="text" placeholder="對方姓名/項目">
            <input id="debt-amount" type="number" placeholder="金額" min="0">
          </div>
          <div class="template-form-row">
            <input id="debt-date" type="date">
            <input id="debt-note" type="text" placeholder="備註（選填）">
          </div>
          <div class="template-actions">
            <button id="save-debt" class="debt-tab-button">儲存欠款</button>
          </div>
        </div>
      </div>
    </div>
    <div class="debt-filter-row">
      <button class="debt-tab-button active" data-filter="all">全部</button>
      <button class="debt-tab-button" data-filter="owedToMe">別人欠我</button>
      <button class="debt-tab-button" data-filter="owedByMe">我欠別人</button>
      <button class="debt-tab-button" data-filter="outstanding">未結清</button>
      <button class="debt-tab-button" data-filter="cleared">已結清</button>
    </div>
    <ul id="debt-list" class="debt-list"></ul>
    <p id="debt-empty" class="empty-msg"></p>
  `;

  const debtModal = document.getElementById('debt-modal');
  const debtForm = document.getElementById('debt-form');
  const debtList = document.getElementById('debt-list');
  const debtEmpty = document.getElementById('debt-empty');
  const filterButtons = Array.from(document.querySelectorAll('.debt-filter-row .debt-tab-button'));
  let activeFilter = 'all';

  const renderDebtList = () => {
    if (!debtList || !debtEmpty) return;

    const filtered = debtRecords.filter((record) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'outstanding') return !record.cleared;
      if (activeFilter === 'cleared') return record.cleared;
      return record.type === activeFilter;
    });

    if (!filtered.length) {
      debtList.innerHTML = '';
      debtEmpty.textContent = '目前沒有對應的欠款紀錄';
      return;
    }

    debtEmpty.textContent = '';
    debtList.innerHTML = filtered.map((record) => `
      <li class="debt-item ${record.cleared ? 'debt-cleared' : ''}">
        <div class="debt-item-row">
          <span class="debt-item-type">${formatDebtLabel(record.type)}</span>
          <strong>${record.person}</strong>
          <span class="debt-item-amount">NT$${formatNumber(record.amount)}</span>
        </div>
        <div class="debt-item-row debt-item-meta">
          <span>${formatRecordDate(record.date)}</span>
          <span>${record.note || '無備註'}</span>
        </div>
        <div class="debt-item-actions">
          <button class="secondary-btn debt-toggle-clear" data-id="${record.id}">${record.cleared ? '取消結清' : '結清'}</button>
          <button class="danger-btn debt-delete" data-id="${record.id}">刪除</button>
        </div>
      </li>
    `).join('');

    debtList.querySelectorAll('.debt-toggle-clear').forEach((button) => {
      button.addEventListener('click', () => {
        toggleDebtCleared(button.dataset.id);
        renderDebtPage();
      });
    });

    debtList.querySelectorAll('.debt-delete').forEach((button) => {
      button.addEventListener('click', () => {
        if (!confirm('確定要刪除此欠款紀錄嗎？')) return;
        deleteDebtRecord(button.dataset.id);
        renderDebtPage();
      });
    });
  };

  const updateFilterButtons = () => {
    filterButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.filter === activeFilter);
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      updateFilterButtons();
      renderDebtList();
    });
  });

  document.getElementById('toggle-debt-form')?.addEventListener('click', () => {
    debtModal?.classList.toggle('hidden');
  });

  document.getElementById('cancel-debt')?.addEventListener('click', () => {
    debtModal?.classList.add('hidden');
  });

  document.getElementById('save-debt')?.addEventListener('click', () => {
    const type = document.querySelector('input[name="debt-type"]:checked')?.value || 'owedToMe';
    const personInput = document.getElementById('debt-person');
    const amountInput = document.getElementById('debt-amount');
    const dateInput = document.getElementById('debt-date');
    const noteInput = document.getElementById('debt-note');

    const person = personInput?.value.trim();
    const amount = Number(amountInput?.value);
    const date = dateInput?.value;
    const note = noteInput?.value.trim();

    if (!person) return showToast('請輸入對方姓名或項目', 'warning');
    if (!amount || amount <= 0) return showToast('請輸入有效金額', 'warning');

    debtRecords.push(createDebtRecord({ type, person, amount, note, date: date || new Date() }));
    saveDebtRecords(debtRecords);
    renderDebtPage();
    showToast('已新增欠款紀錄', 'success');
  });

  document.getElementById('debt-date')?.setAttribute('value', new Date().toISOString().slice(0, 10));
  renderDebtList();
}

function renderCategoryLists() {
  const expenseList = document.getElementById('expense-category-list');
  const incomeList = document.getElementById('income-category-list');
  if (!expenseList || !incomeList) return;
  const icons = getCategoryIcons();

  expenseList.innerHTML = expenseCategories.map((category, index) => `
    <li>
      <div class="category-chip-row">
        <span class="record-icon">${icons[category] || '💸'}</span>
        <span>${category}</span>
        <input class="category-icon-input" type="text" maxlength="2" value="${icons[category] || '💸'}">
        <button class="primary-btn set-icon-btn" data-category="${category}" type="button">儲存</button>
        <button class="category-delete-btn" data-remove-expense="${index}" type="button">刪除</button>
      </div>
    </li>
  `).join('');

  incomeList.innerHTML = incomeCategories.map((category, index) => `
    <li>
      <div class="category-chip-row">
        <span class="record-icon">${icons[category] || '💸'}</span>
        <span>${category}</span>
        <input class="category-icon-input" type="text" maxlength="2" value="${icons[category] || '💸'}">
        <button class="primary-btn set-icon-btn" data-category="${category}" type="button">儲存</button>
        <button class="category-delete-btn" data-remove-income="${index}" type="button">刪除</button>
      </div>
    </li>
  `).join('');

  expenseList.querySelectorAll('.set-icon-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      const input = btn.parentElement.querySelector('.category-icon-input');
      saveCategoryIcon(category, input.value.trim() || '💸');
      renderCategoryLists();
      updateCategoryOptions();
    });
  });

  incomeList.querySelectorAll('.set-icon-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      const input = btn.parentElement.querySelector('.category-icon-input');
      saveCategoryIcon(category, input.value.trim() || '💸');
      renderCategoryLists();
      updateCategoryOptions();
    });
  });

  expenseList.querySelectorAll('[data-remove-expense]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (expenseCategories.length <= 1) return showToast('至少需保留一個支出分類', 'warning');
      expenseCategories.splice(Number(btn.dataset.removeExpense), 1);
      saveCategoryLists();
      renderCategoryLists();
      updateCategoryOptions();
    });
  });

  incomeList.querySelectorAll('[data-remove-income]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (incomeCategories.length <= 1) return showToast('至少需保留一個收入分類', 'warning');
      incomeCategories.splice(Number(btn.dataset.removeIncome), 1);
      saveCategoryLists();
      renderCategoryLists();
      updateCategoryOptions();
    });
  });
}

function renderSetting() {
  const budgetInput = document.getElementById('budget-input');
  const themeToggle = document.getElementById('theme-toggle');
  const debtManagementBtn = document.getElementById('debt-management');
  const saveBudgetBtn = document.getElementById('save-budget');
  const defaultTypeSelect = document.getElementById('default-type');
  const resetBtn = document.getElementById('reset-settings');
  const clearBtn = document.getElementById('clear-records');
  const exportBtn = document.getElementById('export-records');
  const importBtn = document.getElementById('import-records');
  const importFileInput = document.getElementById('import-file');
  const addExpenseBtn = document.getElementById('add-expense-category');
  const addIncomeBtn = document.getElementById('add-income-category');
  const newExpenseCategoryInput = document.getElementById('new-expense-category');
  const newIncomeCategoryInput = document.getElementById('new-income-category');
  const installBtn = document.getElementById('install-app');

  updateInstallAppButton();

  if (debtManagementBtn) {
    debtManagementBtn.addEventListener('click', () => {
      window.location.href = 'debts.html';
    });
  }

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredInstallPrompt) {
        updateInstallAppButton();
        return;
      }

      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        showToast('已成功安裝', 'success');
      } else {
        showToast('安裝已取消', 'warning');
      }

      deferredInstallPrompt = null;
      canPromptPwaInstall = false;
      updateInstallAppButton();
    });
  }

  if (budgetInput) budgetInput.value = loadBudget();
  if (defaultTypeSelect) defaultTypeSelect.value = loadDefaultType();
  if (themeToggle) themeToggle.checked = loadTheme() === 'dark';

  if (saveBudgetBtn && budgetInput) {
    saveBudgetBtn.addEventListener('click', () => {
      const value = Number(budgetInput.value);
      if (Number.isNaN(value) || value < 0) return showToast('請輸入有效預算', 'warning');
      saveBudget(value);
      renderHome();
      renderStat();
      showToast('預算已儲存', 'success');
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      saveTheme(themeToggle.checked ? 'dark' : 'light');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!confirm('重設設定會清除預算、主題與分類，自動回到預設值。')) return;
      saveBudget(0);
      saveTheme('light');
      saveDefaultType('expense');
      expenseCategories = [...defaultExpenseCategories];
      incomeCategories = [...defaultIncomeCategories];
      saveCategoryLists();
      renderCategoryLists();
      updateCategoryOptions();
      if (budgetInput) budgetInput.value = loadBudget();
      if (defaultTypeSelect) defaultTypeSelect.value = loadDefaultType();
      showToast('已恢復預設設定', 'success');
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (!confirm('確定要清除全部記錄嗎？')) return;
      records = [];
      saveRecords();
      renderCurrentPage();
      showToast('已清除全部記錄', 'success');
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (!records.length) return showToast('目前沒有記錄可匯出', 'warning');
      const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `記帳資料_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (importBtn && importFileInput) {
    importBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', async () => {
      const file = importFileInput.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const imported = JSON.parse(text);
        if (!Array.isArray(imported)) throw new Error('格式錯誤');
        if (!confirm(`匯入 ${imported.length} 筆資料將覆蓋目前資料，確定嗎？`)) {
          importFileInput.value = '';
          return;
        }
        records = imported.map((item) => ({ ...item }));
        saveRecords();
        renderCurrentPage();
        showToast('匯入成功', 'success');
      } catch {
        showToast('匯入失敗，請使用正確的 JSON 格式', 'danger');
      } finally {
        importFileInput.value = '';
      }
    });
  }

  if (addExpenseBtn && newExpenseCategoryInput) {
    addExpenseBtn.addEventListener('click', () => {
      const name = newExpenseCategoryInput.value.trim();
      if (!name) return showToast('請輸入支出分類名稱', 'warning');
      if (expenseCategories.includes(name)) return showToast('此分類已存在', 'warning');
      expenseCategories.push(name);
      saveCategoryLists();
      renderCategoryLists();
      updateCategoryOptions();
      newExpenseCategoryInput.value = '';
      showToast('新增支出分類成功', 'success');
    });
  }

  if (addIncomeBtn && newIncomeCategoryInput) {
    addIncomeBtn.addEventListener('click', () => {
      const name = newIncomeCategoryInput.value.trim();
      if (!name) return showToast('請輸入收入分類名稱', 'warning');
      if (incomeCategories.includes(name)) return showToast('此分類已存在', 'warning');
      incomeCategories.push(name);
      saveCategoryLists();
      renderCategoryLists();
      updateCategoryOptions();
      newIncomeCategoryInput.value = '';
      showToast('新增收入分類成功', 'success');
    });
  }

  renderCategoryLists();
}

function goToNew() {
  window.location.href = 'new.html';
}

function highlightActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.bottom-nav .nav-item').forEach((link) => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === current);
  });
}

function renderCurrentPage() {
  highlightActiveNav();
  const current = window.location.pathname.split('/').pop() || 'index.html';
  if (current === 'index.html' || current === '') renderHome();
  if (current === 'detail.html') renderDetail();
  if (current === 'stat.html') renderStat();
  if (current === 'setting.html') renderSetting();
  if (current === 'debts.html') renderDebtPage();
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  canPromptPwaInstall = true;
  updateInstallAppButton();
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  canPromptPwaInstall = false;
  updateInstallAppButton();
});

function initPage() {
  applyTheme(loadTheme());
  applyThemePack(loadThemePack());
  highlightActiveNav();

  const current = window.location.pathname.split('/').pop() || 'index.html';
  if (current === 'index.html' || current === '') {
    renderHome();
  }

  if (current === 'new.html') {
    const defaultType = loadDefaultType();
    const radio = document.querySelector(`input[name="record-type"][value="${defaultType}"]`);
    if (radio) radio.checked = true;
    updateCategoryOptions();
    bindCategoryChangeIcon();
    renderPluginControls();
    document.querySelectorAll('input[name="record-type"]').forEach((item) => {
      item.addEventListener('change', () => {
        updateCategoryOptions();
        bindCategoryChangeIcon();
      });
    });
    const dateEl = document.getElementById('date');
    if (dateEl) dateEl.value = new Date().toISOString().slice(0, 10);
  }

  if (current === 'detail.html') {
    renderDetail();
    document.getElementById('filter-type')?.addEventListener('change', renderDetail);
    document.getElementById('filter-category')?.addEventListener('change', renderDetail);
    document.getElementById('filter-search')?.addEventListener('input', renderDetail);
    document.getElementById('filter-start')?.addEventListener('change', renderDetail);
    document.getElementById('filter-end')?.addEventListener('change', renderDetail);
  }

  if (current === 'stat.html') {
    renderStat();
  }

  if (current === 'setting.html') {
    renderSetting();
  }

  if (current === 'debts.html') {
    renderDebtPage();
  }

  if (current === 'plugins.html') {
    renderPluginsPage();
  }
}

window.addEventListener('DOMContentLoaded', initPage);

const shareAppBtn = document.getElementById('share-app');
if (shareAppBtn) {
  shareAppBtn.addEventListener('click', async () => {
    const link = shareAppBtn.dataset.link || 'https://eevrt0404.github.io/CashJournal/';
    try {
      await navigator.clipboard.writeText(link);
      showToast('連結已複製', 'success');
    } catch {
      showToast('複製失敗，請再試一次', 'danger');
    }
  });
}
