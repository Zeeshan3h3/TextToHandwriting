export const encodeStateToUrl = (settings, extendedConfig) => {
  try {
    // Only encode essential configuration to keep URL relatively short
    const state = {
      f: settings.font,
      s: settings.fontSize,
      p: settings.paperType,
      i: settings.inkColor,
      l: settings.lineHeight,
      // Advanced config
      ep: extendedConfig.advancedPaperType,
      sz: extendedConfig.pageSize,
      m: [extendedConfig.leftMargin, extendedConfig.topMargin, extendedConfig.bottomMargin],
      r: extendedConfig.realismLevel,
      he: extendedConfig.headerEnabled ? 1 : 0,
      se: extendedConfig.scannerEffectEnabled ? 1 : 0,
      si: extendedConfig.scannerIntensity
    };
    
    const json = JSON.stringify(state);
    const base64 = btoa(encodeURIComponent(json));
    
    const url = new URL(window.location.href);
    url.searchParams.set('share', base64);
    return url.toString();
  } catch (err) {
    console.error('Error encoding state:', err);
    return window.location.href;
  }
};

export const decodeStateFromUrl = () => {
  try {
    const url = new URL(window.location.href);
    const share = url.searchParams.get('share');
    if (!share) return null;
    
    const json = decodeURIComponent(atob(share));
    const state = JSON.parse(json);
    
    return {
      settings: {
        font: state.f,
        fontSize: state.s,
        paperType: state.p,
        inkColor: state.i,
        lineHeight: state.l,
      },
      extendedConfig: {
        advancedPaperType: state.ep,
        pageSize: state.sz,
        leftMargin: state.m?.[0] || 80,
        topMargin: state.m?.[1] || 80,
        bottomMargin: state.m?.[2] || 40,
        realismLevel: state.r,
        headerEnabled: state.he === 1,
        scannerEffectEnabled: state.se === 1,
        scannerIntensity: state.si
      }
    };
  } catch (err) {
    console.error('Error decoding state:', err);
    return null;
  }
};
