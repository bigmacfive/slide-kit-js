export class Effects {
  constructor(presentation, defaultTransition = 'fade') {
    this.presentation = presentation;
    this.defaultTransition = defaultTransition;
    this.transitions = {
      fade: this.fadeTransition,
      slide: this.slideTransition,
      zoom: this.zoomTransition,
      flip: this.flipTransition,
      cube: this.cubeTransition,
      none: this.noTransition
    };
  }
  
  applyTransition(fromIndex, toIndex) {
    const fromSlide = this.presentation.slides[fromIndex];
    const toSlide = this.presentation.slides[toIndex];
    
    if (!fromSlide || !toSlide) {
      return;
    }
    
    // 슬라이드에 지정된 전환 효과 또는 기본 전환 효과 사용
    const transitionType = toSlide.dataset.transition || this.defaultTransition;
    const transitionFunction = this.transitions[transitionType] || this.transitions.fade;
    
    // 방향 설정 (이전 또는 다음 슬라이드로 이동)
    const direction = fromIndex < toIndex ? 'next' : 'prev';
    
    // 전환 효과 적용
    transitionFunction.call(this, fromSlide, toSlide, direction);
  }
  
  // 페이드 전환 효과
  fadeTransition(fromSlide, toSlide) {
    // CSS 클래스로 처리 (src/scss/_transitions.scss에 정의)
    toSlide.classList.add('transition-fade');
    
    // 전환 완료 후 클래스 제거
    setTimeout(() => {
      toSlide.classList.remove('transition-fade');
    }, 500);
  }
  
  // 슬라이드 전환 효과
  slideTransition(fromSlide, toSlide, direction) {
    const slideClass = direction === 'next' ? 'transition-slide-left' : 'transition-slide-right';
    
    // 이전 슬라이드에 전환 클래스 추가
    fromSlide.classList.add(slideClass + '-out');
    
    // 새 슬라이드에 전환 클래스 추가
    toSlide.classList.add(slideClass + '-in');
    
    // 전환 완료 후 클래스 제거
    setTimeout(() => {
      fromSlide.classList.remove(slideClass + '-out');
      toSlide.classList.remove(slideClass + '-in');
    }, 500);
  }
  
  // 줌 전환 효과
  zoomTransition(fromSlide, toSlide, direction) {
    const zoomClass = direction === 'next' ? 'transition-zoom-out' : 'transition-zoom-in';
    
    // 이전 슬라이드에 전환 클래스 추가
    fromSlide.classList.add(zoomClass + '-out');
    
    // 새 슬라이드에 전환 클래스 추가
    toSlide.classList.add(zoomClass + '-in');
    
    // 전환 완료 후 클래스 제거
    setTimeout(() => {
      fromSlide.classList.remove(zoomClass + '-out');
      toSlide.classList.remove(zoomClass + '-in');
    }, 500);
  }
  
  // 플립 전환 효과
  flipTransition(fromSlide, toSlide, direction) {
    const flipClass = direction === 'next' ? 'transition-flip-left' : 'transition-flip-right';
    
    // 컨테이너에 3D 전환 활성화
    this.presentation.container.classList.add('enable-3d');
    
    // 이전 슬라이드에 전환 클래스 추가
    fromSlide.classList.add(flipClass + '-out');
    
    // 새 슬라이드에 전환 클래스 추가
    toSlide.classList.add(flipClass + '-in');
    
    // 전환 완료 후 클래스 제거
    setTimeout(() => {
      fromSlide.classList.remove(flipClass + '-out');
      toSlide.classList.remove(flipClass + '-in');
      this.presentation.container.classList.remove('enable-3d');
    }, 700);
  }
  
  // 큐브 전환 효과
  cubeTransition(fromSlide, toSlide, direction) {
    const cubeClass = direction === 'next' ? 'transition-cube-left' : 'transition-cube-right';
    
    // 컨테이너에 3D 전환 활성화
    this.presentation.container.classList.add('enable-3d');
    
    // 이전 슬라이드에 전환 클래스 추가
    fromSlide.classList.add(cubeClass + '-out');
    
    // 새 슬라이드에 전환 클래스 추가
    toSlide.classList.add(cubeClass + '-in');
    
    // 전환 완료 후 클래스 제거
    setTimeout(() => {
      fromSlide.classList.remove(cubeClass + '-out');
      toSlide.classList.remove(cubeClass + '-in');
      this.presentation.container.classList.remove('enable-3d');
    }, 700);
  }
  
  // 전환 효과 없음
  noTransition(fromSlide, toSlide) {
    // 전환 효과 없음 - 즉시 변경
  }
} 