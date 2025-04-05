// SlideKit - 모던 HTML 슬라이드 라이브러리
(function(window) {
  'use strict';

  // SlideKit 네임스페이스
  window.SlideKit = {};

  // Presentation 클래스
  window.SlideKit.Presentation = function(options) {
    // 기본 옵션과 사용자 옵션 병합
    this.options = Object.assign({
      container: '.slidekit-container',
      slideSelector: '.slide',
      showProgress: true,
      showControls: true,
      theme: 'default',
      autoPlay: false,
      autoPlayInterval: 5000,
      enableSwipe: true,
      enableKeyboard: true,
      animateItems: true
    }, options || {});

    this.container = null;
    this.slides = [];
    this.currentIndex = 0;
    this.progressBar = null;
    this.autoPlayTimer = null;
    this.totalSlides = 0;

    // 초기화 메서드
    this.init = function() {
      // 컨테이너 찾기
      this.container = document.querySelector(this.options.container);
      if (!this.container) {
        console.error('SlideKit: 컨테이너를 찾을 수 없습니다.');
        return;
      }

      // 슬라이드 요소 수집
      this.slides = Array.from(this.container.querySelectorAll(this.options.slideSelector));
      this.totalSlides = this.slides.length;
      
      if (this.totalSlides === 0) {
        console.error('SlideKit: 슬라이드를 찾을 수 없습니다.');
        return;
      }

      // 진행 표시줄 추가
      if (this.options.showProgress) {
        this.createProgressBar();
      }

      // 컨트롤 추가
      if (this.options.showControls) {
        this.createControls();
      }

      // 이벤트 리스너 등록
      this.bindEvents();

      // 첫 번째 슬라이드 표시
      this.goToSlide(0);

      // 자동 재생 설정
      if (this.options.autoPlay) {
        this.startAutoPlay();
      }
      
      // 애니메이션 항목 처리
      if (this.options.animateItems) {
        this.setupAnimations();
      }
      
      // 슬라이드킷 초기화 완료 로그
      console.log('SlideKit: 초기화 완료, 총 ' + this.totalSlides + '개의 슬라이드가 있습니다.');
    };

    // 진행 표시줄 생성
    this.createProgressBar = function() {
      this.progressBar = document.createElement('div');
      this.progressBar.className = 'slidekit-progress';
      document.body.appendChild(this.progressBar);
    };

    // 진행 표시줄 업데이트
    this.updateProgressBar = function() {
      if (!this.progressBar) return;
      
      const progress = (this.currentIndex / (this.totalSlides - 1)) * 100;
      this.progressBar.style.width = progress + '%';
    };

    // 네비게이션 컨트롤 생성
    this.createControls = function() {
      const controls = document.createElement('div');
      controls.className = 'slidekit-controls';
      
      const prevButton = document.createElement('button');
      prevButton.className = 'slidekit-prev';
      prevButton.innerHTML = '&larr;';
      prevButton.addEventListener('click', this.prevSlide.bind(this));
      
      const nextButton = document.createElement('button');
      nextButton.className = 'slidekit-next';
      nextButton.innerHTML = '&rarr;';
      nextButton.addEventListener('click', this.nextSlide.bind(this));
      
      controls.appendChild(prevButton);
      controls.appendChild(nextButton);
      this.container.appendChild(controls);
    };

    // 이벤트 바인딩
    this.bindEvents = function() {
      // 키보드 이벤트
      if (this.options.enableKeyboard) {
        document.addEventListener('keydown', this.handleKeydown.bind(this));
      }
      
      // 스와이프 이벤트
      if (this.options.enableSwipe) {
        this.enableSwipeEvents();
      }
      
      // 윈도우 리사이즈 이벤트
      window.addEventListener('resize', this.handleResize.bind(this));
    };
    
    // 키보드 이벤트 처리
    this.handleKeydown = function(event) {
      switch(event.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          this.nextSlide();
          event.preventDefault();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          this.prevSlide();
          event.preventDefault();
          break;
        case 'Home':
          this.goToSlide(0);
          event.preventDefault();
          break;
        case 'End':
          this.goToSlide(this.totalSlides - 1);
          event.preventDefault();
          break;
      }
    };
    
    // 스와이프 이벤트 활성화
    this.enableSwipeEvents = function() {
      let touchStartX = 0;
      let touchEndX = 0;
      
      this.container.addEventListener('touchstart', function(event) {
        touchStartX = event.changedTouches[0].screenX;
      }, false);
      
      this.container.addEventListener('touchend', function(event) {
        touchEndX = event.changedTouches[0].screenX;
        this.handleSwipe(touchStartX, touchEndX);
      }.bind(this), false);
    };
    
    // 스와이프 처리
    this.handleSwipe = function(startX, endX) {
      const swipeThreshold = 50;
      const diff = endX - startX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.prevSlide(); // 오른쪽으로 스와이프 - 이전 슬라이드
        } else {
          this.nextSlide(); // 왼쪽으로 스와이프 - 다음 슬라이드
        }
      }
    };
    
    // 리사이즈 처리
    this.handleResize = function() {
      // 리사이즈 시 필요한 조정 작업
      // 예: 반응형 조정
    };
    
    // 슬라이드 이동
    this.goToSlide = function(index) {
      // 범위 체크
      if (index < 0 || index >= this.totalSlides) return;
      
      // 현재 슬라이드 업데이트
      const prevIndex = this.currentIndex;
      this.currentIndex = index;
      
      // 이전 슬라이드 비활성화
      if (this.slides[prevIndex]) {
        this.slides[prevIndex].classList.remove('active');
        // 애니메이션 요소 리셋
        this.resetAnimations(this.slides[prevIndex]);
      }
      
      // 새 슬라이드 활성화
      this.slides[index].classList.add('active');
      
      // 진행 표시줄 업데이트
      this.updateProgressBar();
      
      // 자동 재생 타이머 재설정
      if (this.options.autoPlay) {
        this.resetAutoPlay();
      }
      
      // 현재 슬라이드의 애니메이션 항목 애니메이션 적용
      setTimeout(() => {
        this.animateItems(this.slides[index]);
      }, 100);
      
      // 슬라이드 변경 이벤트 발생
      this.triggerEvent('slideChanged', {
        prevIndex: prevIndex,
        currentIndex: index
      });
    };
    
    // 다음 슬라이드로 이동
    this.nextSlide = function() {
      if (this.currentIndex < this.totalSlides - 1) {
        this.goToSlide(this.currentIndex + 1);
      }
    };
    
    // 이전 슬라이드로 이동
    this.prevSlide = function() {
      if (this.currentIndex > 0) {
        this.goToSlide(this.currentIndex - 1);
      }
    };
    
    // 애니메이션 설정
    this.setupAnimations = function() {
      this.slides.forEach(slide => {
        const animElements = slide.querySelectorAll('.fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right');
        animElements.forEach(element => {
          // 기본 상태는 보이지 않음
          element.style.opacity = '0';
        });
      });
    };
    
    // 애니메이션 요소 리셋
    this.resetAnimations = function(slide) {
      const animElements = slide.querySelectorAll('.fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right');
      animElements.forEach(element => {
        element.style.opacity = '0';
        element.style.animation = 'none';
      });
    };
    
    // 항목 애니메이션 적용
    this.animateItems = function(slide) {
      const animElements = slide.querySelectorAll('.fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right');
      
      animElements.forEach((element, index) => {
        // 기존 애니메이션 스타일 제거
        element.style.animation = 'none';
        
        // 강제 리플로우
        void element.offsetWidth;
        
        // 지연 시간 계산 (항목별로 다른 지연 적용)
        const delay = index * 0.15;
        
        // 애니메이션 클래스 확인하고 적용
        if (element.classList.contains('fade-in')) {
          element.style.animation = `fadeIn var(--transition-normal) ease ${delay}s forwards`;
        } else if (element.classList.contains('fade-in-up')) {
          element.style.animation = `fadeInUp var(--transition-normal) ease ${delay}s forwards`;
        } else if (element.classList.contains('fade-in-down')) {
          element.style.animation = `fadeInDown var(--transition-normal) ease ${delay}s forwards`;
        } else if (element.classList.contains('fade-in-left')) {
          element.style.animation = `fadeInLeft var(--transition-normal) ease ${delay}s forwards`;
        } else if (element.classList.contains('fade-in-right')) {
          element.style.animation = `fadeInRight var(--transition-normal) ease ${delay}s forwards`;
        }
      });
    };
    
    // 자동 재생 시작
    this.startAutoPlay = function() {
      this.autoPlayTimer = setInterval(() => {
        if (this.currentIndex < this.totalSlides - 1) {
          this.nextSlide();
        } else {
          this.goToSlide(0); // 마지막 슬라이드에서 첫 번째로 순환
        }
      }, this.options.autoPlayInterval);
    };
    
    // 자동 재생 정지
    this.stopAutoPlay = function() {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer);
        this.autoPlayTimer = null;
      }
    };
    
    // 자동 재생 재설정
    this.resetAutoPlay = function() {
      this.stopAutoPlay();
      if (this.options.autoPlay) {
        this.startAutoPlay();
      }
    };
    
    // 사용자 정의 이벤트 발생
    this.triggerEvent = function(eventName, data) {
      const event = new CustomEvent('slidekit:' + eventName, {
        detail: data
      });
      this.container.dispatchEvent(event);
    };
    
    // 이벤트 리스너 등록 헬퍼
    this.on = function(eventName, callback) {
      this.container.addEventListener('slidekit:' + eventName, callback);
    };
  };
})(window);
