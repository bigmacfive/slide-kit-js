export class PresenterMode {
  constructor(presentation) {
    this.presentation = presentation;
    this.presenterWindow = null;
    this.timerStartTime = null;
    this.timerInterval = null;
    
    // 발표자 노트 엘리먼트
    this.notes = [];
    
    // 초기화
    this.init();
  }
  
  init() {
    // 발표자 노트 엘리먼트 찾기
    this.findNotes();
    
    // 슬라이드 변경 이벤트 리스너 추가
    this.presentation.container.addEventListener('slideChanged', event => {
      const { currentIndex } = event.detail;
      
      // 발표자 창이 열려있는 경우 업데이트
      if (this.presenterWindow && !this.presenterWindow.closed) {
        this.updatePresenterWindow(currentIndex);
      }
    });
    
    // 단축키 리스너 추가
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }
  
  // 단축키 처리
  handleKeydown(event) {
    // 'p' 키 - 발표자 모드 토글
    if (event.key.toLowerCase() === 'p' && event.altKey) {
      this.togglePresenterMode();
      event.preventDefault();
    }
  }
  
  // 발표자 노트 찾기
  findNotes() {
    this.notes = this.presentation.slides.map(slide => {
      const notesElement = slide.querySelector('.notes');
      return notesElement ? notesElement.innerHTML : '';
    });
  }
  
  // 발표자 모드 토글
  togglePresenterMode() {
    if (this.presenterWindow && !this.presenterWindow.closed) {
      this.closePresenterMode();
    } else {
      this.openPresenterMode();
    }
  }
  
  // 발표자 모드 열기
  openPresenterMode() {
    // 팝업 창 열기
    this.presenterWindow = window.open('', 'presenter-view', 'width=1000,height=700');
    
    if (!this.presenterWindow) {
      alert('팝업 창이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.');
      return;
    }
    
    // 발표자 창 HTML 설정
    this.setupPresenterWindow();
    
    // 현재 슬라이드 정보로 발표자 창 업데이트
    this.updatePresenterWindow(this.presentation.currentSlideIndex);
    
    // 타이머 시작
    this.startTimer();
  }
  
  // 발표자 모드 닫기
  closePresenterMode() {
    if (this.presenterWindow) {
      this.presenterWindow.close();
      this.presenterWindow = null;
    }
    
    // 타이머 정지
    this.stopTimer();
  }
  
  // 발표자 창 HTML 설정
  setupPresenterWindow() {
    const doc = this.presenterWindow.document;
    
    // 발표자 뷰 스타일 설정
    doc.head.innerHTML = `
      <title>발표자 모드 - SlideKit</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f5f5f5;
          color: #333;
        }
        .presenter-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto 1fr auto;
          gap: 20px;
          height: calc(100vh - 40px);
        }
        .header {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #2c3e50;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
        }
        .current-slide {
          border: 1px solid #ddd;
          background: white;
          border-radius: 5px;
          padding: 10px;
          overflow: hidden;
          position: relative;
        }
        .current-slide::after {
          content: "현재 슬라이드";
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.5);
          color: white;
          padding: 5px 10px;
          border-radius: 3px;
          font-size: 12px;
        }
        .next-slide {
          border: 1px solid #ddd;
          background: white;
          border-radius: 5px;
          padding: 10px;
          overflow: hidden;
          position: relative;
          opacity: 0.8;
        }
        .next-slide::after {
          content: "다음 슬라이드";
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.5);
          color: white;
          padding: 5px 10px;
          border-radius: 3px;
          font-size: 12px;
        }
        .notes-container {
          grid-column: 1 / -1;
          background: white;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 20px;
          overflow: auto;
        }
        .notes-container h3 {
          margin-top: 0;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .timer {
          font-size: 2em;
          font-weight: bold;
          text-align: center;
        }
        .controls {
          display: flex;
          gap: 10px;
        }
        button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 3px;
          cursor: pointer;
        }
        button:hover {
          background-color: #2980b9;
        }
        .slide-counter {
          font-size: 1.2em;
        }
      </style>
    `;
    
    // 발표자 뷰 HTML 설정
    doc.body.innerHTML = `
      <div class="presenter-container">
        <div class="header">
          <div class="timer" id="timer">00:00:00</div>
          <div class="slide-counter">
            슬라이드 <span id="current-slide-number">0</span> / <span id="total-slides">0</span>
          </div>
          <div class="controls">
            <button id="reset-timer">타이머 초기화</button>
            <button id="prev-slide">이전 슬라이드</button>
            <button id="next-slide">다음 슬라이드</button>
          </div>
        </div>
        <div class="current-slide" id="current-slide"></div>
        <div class="next-slide" id="next-slide"></div>
        <div class="notes-container">
          <h3>발표자 노트</h3>
          <div id="current-notes"></div>
        </div>
      </div>
    `;
    
    // 이벤트 핸들러 등록
    const resetTimerBtn = doc.getElementById('reset-timer');
    const prevSlideBtn = doc.getElementById('prev-slide');
    const nextSlideBtn = doc.getElementById('next-slide');
    
    resetTimerBtn.addEventListener('click', () => this.resetTimer());
    prevSlideBtn.addEventListener('click', () => {
      this.presentation.previousSlide();
    });
    nextSlideBtn.addEventListener('click', () => {
      this.presentation.nextSlide();
    });
    
    // 발표자 창에서도 키보드 네비게이션 가능하도록 설정
    doc.addEventListener('keydown', event => {
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
      }
    });
  }
  
  // 발표자 창 업데이트
  updatePresenterWindow(currentIndex) {
    if (!this.presenterWindow || this.presenterWindow.closed) return;
    
    const doc = this.presenterWindow.document;
    const totalSlides = this.presentation.slides.length;
    
    // 현재 슬라이드 번호 및 총 슬라이드 수 표시
    doc.getElementById('current-slide-number').textContent = currentIndex + 1;
    doc.getElementById('total-slides').textContent = totalSlides;
    
    // 현재 슬라이드 복제하여 표시
    const currentSlide = this.presentation.slides[currentIndex];
    doc.getElementById('current-slide').innerHTML = currentSlide.outerHTML;
    
    // 다음 슬라이드 표시
    const nextIndex = currentIndex + 1 < totalSlides ? currentIndex + 1 : null;
    const nextSlideElement = doc.getElementById('next-slide');
    
    if (nextIndex !== null) {
      const nextSlide = this.presentation.slides[nextIndex];
      nextSlideElement.innerHTML = nextSlide.outerHTML;
      nextSlideElement.style.display = 'block';
    } else {
      nextSlideElement.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%"><p>마지막 슬라이드입니다</p></div>';
    }
    
    // 발표자 노트 표시
    const notes = this.notes[currentIndex] || '<p>이 슬라이드에 대한 노트가 없습니다.</p>';
    doc.getElementById('current-notes').innerHTML = notes;
  }
  
  // 타이머 시작
  startTimer() {
    this.timerStartTime = Date.now();
    this.updateTimer();
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);
  }
  
  // 타이머 정지
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
  
  // 타이머 초기화
  resetTimer() {
    this.timerStartTime = Date.now();
    this.updateTimer();
  }
  
  // 타이머 업데이트
  updateTimer() {
    if (!this.presenterWindow || this.presenterWindow.closed) {
      this.stopTimer();
      return;
    }
    
    const elapsed = Math.floor((Date.now() - this.timerStartTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    
    const timeString = [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
    
    const timerElement = this.presenterWindow.document.getElementById('timer');
    if (timerElement) {
      timerElement.textContent = timeString;
    }
  }
} 