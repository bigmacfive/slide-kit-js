export class Themes {
  constructor(presentation, defaultTheme = 'default') {
    this.presentation = presentation;
    this.defaultTheme = defaultTheme;
    this.currentTheme = defaultTheme;
    this.themes = ['default', 'dark', 'light', 'modern', 'minimal'];
  }
  
  applyTheme(theme) {
    if (!this.themes.includes(theme)) {
      console.warn(`Theme '${theme}' not found, using default theme instead`);
      theme = this.defaultTheme;
    }
    
    // 이전 테마 클래스 제거
    this.presentation.container.classList.remove(`theme-${this.currentTheme}`);
    
    // 새 테마 클래스 추가
    this.presentation.container.classList.add(`theme-${theme}`);
    
    this.currentTheme = theme;
    
    // 이벤트 발생
    this.presentation.container.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme }
    }));
    
    return this;
  }
  
  // 사용 가능한 테마 목록 반환
  getAvailableThemes() {
    return [...this.themes];
  }
  
  // 현재 테마 가져오기
  getCurrentTheme() {
    return this.currentTheme;
  }
  
  // 새로운 사용자 정의 테마 추가
  addTheme(name, styles) {
    if (this.themes.includes(name)) {
      console.warn(`Theme '${name}' already exists, overwriting`);
    } else {
      this.themes.push(name);
    }
    
    // 동적 스타일 추가
    const styleElement = document.createElement('style');
    styleElement.id = `slidekit-theme-${name}`;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    return this;
  }
  
  // 테마 CSS 생성 헬퍼
  static createThemeCSS(name, colors, fonts, sizes) {
    return `
      .slidekit-container.theme-${name} {
        --theme-primary-color: ${colors.primary || '#333'};
        --theme-secondary-color: ${colors.secondary || '#666'};
        --theme-accent-color: ${colors.accent || '#3498db'};
        --theme-background-color: ${colors.background || '#fff'};
        --theme-text-color: ${colors.text || '#333'};
        
        --theme-heading-font: ${fonts.heading || 'inherit'};
        --theme-body-font: ${fonts.body || 'inherit'};
        --theme-code-font: ${fonts.code || 'monospace'};
        
        --theme-slide-padding: ${sizes.slidePadding || '40px'};
        
        color: var(--theme-text-color);
        background-color: var(--theme-background-color);
      }
      
      .slidekit-container.theme-${name} h1, 
      .slidekit-container.theme-${name} h2, 
      .slidekit-container.theme-${name} h3,
      .slidekit-container.theme-${name} h4,
      .slidekit-container.theme-${name} h5,
      .slidekit-container.theme-${name} h6 {
        font-family: var(--theme-heading-font);
        color: var(--theme-primary-color);
      }
      
      .slidekit-container.theme-${name} .slide {
        padding: var(--theme-slide-padding);
      }
      
      .slidekit-container.theme-${name} a {
        color: var(--theme-accent-color);
      }
      
      .slidekit-container.theme-${name} code, 
      .slidekit-container.theme-${name} pre {
        font-family: var(--theme-code-font);
      }
    `;
  }
} 