(function () {
  const palette = {
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
      bottomNavShadow: '0 -6px 24px rgba(76, 110, 181, 0.12)'
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
      bottomNavShadow: '0 -6px 24px rgba(42, 120, 204, 0.14)'
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
      bottomNavShadow: '0 -6px 24px rgba(34, 139, 102, 0.16)'
    },
    purple: {
      bg: '#f8f4ff',
      text: '#4b2e83',
      textMuted: '#7a60a8',
      primary: '#6a4bb0',
      secondary: '#8a6bc0',
      success: '#5ca590',
      danger: '#e76866',
      cardBorder: 'rgba(106, 75, 176, 0.18)',
      panel: 'rgba(255, 255, 255, 0.9)',
      soft: 'rgba(106, 75, 176, 0.08)',
      shadowSoft: '0 16px 40px rgba(106, 75, 176, 0.16)',
      shadowStrong: '0 20px 48px rgba(75, 43, 128, 0.18)',
      appBgTop: '#f8f4ff',
      appBgBottom: '#eae4ff',
      appAccentLeft: 'rgba(138, 107, 192, 0.32)',
      appAccentRight: 'rgba(106, 75, 176, 0.2)',
      bottomNavBg: 'rgba(255, 255, 255, 0.92)',
      bottomNavShadow: '0 -6px 24px rgba(106, 75, 176, 0.16)'
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
      bottomNavShadow: '0 -6px 24px rgba(216, 116, 59, 0.16)'
    },
    red: {
      bg: '#f8f4ff',
      text: '#31181d',
      textMuted: '#31181d',
      primary: '#ff597a',
      secondary: '#E3002C',
      success: '#5ca590',
      danger: '#e76866',
      cardBorder: 'rgba(106, 75, 176, 0.18)',
      panel: 'rgba(255, 255, 255, 0.9)',
      soft: 'rgba(106, 75, 176, 0.08)',
      shadowSoft: '0 16px 40px rgba(106, 75, 176, 0.16)',
      shadowStrong: '0 20px 48px rgba(75, 43, 128, 0.18)',
      appBgTop: '#f8f4ff',
      appBgBottom: '#eae4ff',
      appAccentLeft: 'rgba(138, 107, 192, 0.32)',
      appAccentRight: 'rgba(106, 75, 176, 0.2)',
      bottomNavBg: 'rgba(255, 255, 255, 0.92)',
      bottomNavShadow: '0 -6px 24px rgba(106, 75, 176, 0.16)'
    }
  };

  try {
    const storedPack = localStorage.getItem('themePackChoice');
    const activePack = palette[storedPack] ? storedPack : 'default';
    const root = document.documentElement;

    Object.entries(palette[activePack]).forEach(([key, value]) => {
      root.style.setProperty(`--${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`, value);
    });
  } catch {
    const root = document.documentElement;
    Object.entries(palette.default).forEach(([key, value]) => {
      root.style.setProperty(`--${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`, value);
    });
  }
})();
