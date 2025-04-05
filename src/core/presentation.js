import { Navigation } from './navigation';
import { Effects } from './effects';
import { Themes } from './themes';
import { Plugins } from './plugins';
import { MarkdownSupport } from './markdown';
import { CodeHighlight } from './code-highlight';
import { PresenterMode } from './presenter-mode';

export class Presentation {
  constructor(options = {}) {
    this.options = {
      container: '.slidekit-container',
      slideSelector: '.slide',
      theme: 'default',
      transition: 'fade',
      markdown: true,
      codeHighlight: true,
      presenterMode: false,
      plugins: [],
      ...options
    };
    
    this.container = null;
    this.slides = [];
    this.currentSlideIndex = 0;
    
    this.navigation = null;
    this.effects = null;
    this.themes = null;
    this.plugins = null;
    this.markdown = null;
    this.codeHighlight = null;
    this.presenterMode = null;
  }
  
  init() {
    this.container = document.querySelector(this.options.container);
    if (!this.container) {
      throw new Error(`Container selector '${this.options.container}' not found in document`);
    }
    
    // 슬라이드 요소 수집
    const slideElements = this.container.querySelectorAll(this.options.slideSelector);
    if (slideElements.length === 0) {
      throw new Error('No slides found in container');
    }
    
    // 슬라이드 초기화
    this.slides = Array.from(slideElements);
    
    // 각 구성 요소 초기화
    this.navigation = new Navigation(this);
    this.effects = new Effects(this, this.options.transition);
    this.themes = new Themes(this, this.options.theme);
    this.plugins = new Plugins(this, this.options.plugins);
    
    // 선택적 기능 초기화
    if (this.options.markdown) {
      this.markdown = new MarkdownSupport(this);
    }
    
    if (this.options.codeHighlight) {
      this.codeHighlight = new CodeHighlight(this);
    }
    
    if (this.options.presenterMode) {
      this.presenterMode = new PresenterMode(this);
    }
    
    // 첫 번째 슬라이드 표시
    this.showSlide(0);
    
    // 이벤트 리스너 등록
    this.navigation.bindEvents();
  }
  
  showSlide(index) {
    if (index < 0 || index >= this.slides.length) {
      return;
    }
    
    const prevIndex = this.currentSlideIndex;
    this.currentSlideIndex = index;
    
    // 이전 슬라이드에서 'active' 클래스 제거
    if (this.slides[prevIndex]) {
      this.slides[prevIndex].classList.remove('active');
      this.slides[prevIndex].classList.add(prevIndex < index ? 'prev' : 'next');
    }
    
    // 새 슬라이드에 'active' 클래스 추가
    this.slides[index].classList.add('active');
    this.slides[index].classList.remove('prev', 'next');
    
    // 전환 효과 적용
    this.effects.applyTransition(prevIndex, index);
    
    // 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('slideChanged', {
      detail: { 
        prevIndex, 
        currentIndex: index, 
        slide: this.slides[index] 
      }
    }));
  }
  
  nextSlide() {
    const nextIndex = this.currentSlideIndex + 1;
    if (nextIndex < this.slides.length) {
      this.showSlide(nextIndex);
    }
  }
  
  previousSlide() {
    const prevIndex = this.currentSlideIndex - 1;
    if (prevIndex >= 0) {
      this.showSlide(prevIndex);
    }
  }
  
  goToSlide(index) {
    if (index >= 0 && index < this.slides.length) {
      this.showSlide(index);
    }
  }
} 