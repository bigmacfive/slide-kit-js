export class Navigation {
  constructor(presentation) {
    this.presentation = presentation;
    this.keyboardEnabled = true;
    this.touchEnabled = true;
    this.swipeThreshold = 50; // 스와이프 감지 임계값 (픽셀)
    this.touchStartX = 0;
    this.touchEndX = 0;
  }
  
  bindEvents() {
    if (this.keyboardEnabled) {
      document.addEventListener('keydown', this.handleKeydown.bind(this));
    }
    
    if (this.touchEnabled) {
      const container = this.presentation.container;
      container.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
      container.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
    }
    
    // 해시 변경 이벤트 리스너 (URL 기반 탐색)
    window.addEventListener('hashchange', this.handleHashChange.bind(this));
    this.syncHash();
  }
  
  handleKeydown(event) {
    switch (event.key) {
      case 'ArrowRight':
      case 'Space':
      case 'PageDown':
        this.presentation.nextSlide();
        event.preventDefault();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        this.presentation.previousSlide();
        event.preventDefault();
        break;
      case 'Home':
        this.presentation.goToSlide(0);
        event.preventDefault();
        break;
      case 'End':
        this.presentation.goToSlide(this.presentation.slides.length - 1);
        event.preventDefault();
        break;
    }
  }
  
  handleTouchStart(event) {
    this.touchStartX = event.changedTouches[0].screenX;
  }
  
  handleTouchEnd(event) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }
  
  handleSwipe() {
    const distance = this.touchEndX - this.touchStartX;
    if (Math.abs(distance) > this.swipeThreshold) {
      if (distance > 0) {
        // 오른쪽으로 스와이프 - 이전 슬라이드
        this.presentation.previousSlide();
      } else {
        // 왼쪽으로 스와이프 - 다음 슬라이드
        this.presentation.nextSlide();
      }
    }
  }
  
  // URL 해시 관리
  syncHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const slideIndex = parseInt(hash, 10);
      if (!isNaN(slideIndex) && slideIndex >= 0 && slideIndex < this.presentation.slides.length) {
        this.presentation.goToSlide(slideIndex);
      }
    }
    
    // 현재 슬라이드 인덱스를 해시로 설정
    window.location.hash = this.presentation.currentSlideIndex;
  }
  
  handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const slideIndex = parseInt(hash, 10);
      if (!isNaN(slideIndex) && slideIndex >= 0 && slideIndex < this.presentation.slides.length) {
        this.presentation.goToSlide(slideIndex);
      }
    }
  }
  
  // 내비게이션 컨트롤 생성 및 추가
  createControls() {
    const controls = document.createElement('div');
    controls.className = 'slidekit-controls';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'slidekit-prev';
    prevButton.innerHTML = '&larr;';
    prevButton.addEventListener('click', () => this.presentation.previousSlide());
    
    const nextButton = document.createElement('button');
    nextButton.className = 'slidekit-next';
    nextButton.innerHTML = '&rarr;';
    nextButton.addEventListener('click', () => this.presentation.nextSlide());
    
    controls.appendChild(prevButton);
    controls.appendChild(nextButton);
    
    this.presentation.container.appendChild(controls);
  }
} 