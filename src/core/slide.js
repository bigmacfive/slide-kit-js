export class Slide {
  constructor(options = {}) {
    this.options = {
      content: '',
      type: 'default',
      transition: null,
      background: null,
      classes: [],
      notes: '',
      ...options
    };
    
    this.element = null;
  }
  
  // HTML 요소 생성
  create() {
    const slideElement = document.createElement('div');
    slideElement.className = 'slide';
    
    // 슬라이드 타입 클래스 추가
    if (this.options.type) {
      slideElement.classList.add(this.options.type + '-slide');
    }
    
    // 사용자 정의 클래스 추가
    if (this.options.classes && this.options.classes.length > 0) {
      this.options.classes.forEach(className => {
        slideElement.classList.add(className);
      });
    }
    
    // 전환 효과 데이터 속성 설정
    if (this.options.transition) {
      slideElement.dataset.transition = this.options.transition;
    }
    
    // 배경 설정
    if (this.options.background) {
      if (this.options.background.startsWith('#') || this.options.background.startsWith('rgb')) {
        // 배경 색상
        slideElement.style.backgroundColor = this.options.background;
      } else if (this.options.background.match(/\.(jpeg|jpg|gif|png)$/)) {
        // 배경 이미지
        slideElement.style.backgroundImage = `url(${this.options.background})`;
        slideElement.style.backgroundSize = 'cover';
        slideElement.style.backgroundPosition = 'center';
      } else {
        // 그라데이션이나 다른 CSS 배경
        slideElement.style.background = this.options.background;
      }
    }
    
    // 콘텐츠 설정
    slideElement.innerHTML = this.options.content;
    
    // 발표자 노트 추가
    if (this.options.notes) {
      const notesElement = document.createElement('div');
      notesElement.className = 'notes';
      notesElement.style.display = 'none';
      notesElement.innerHTML = this.options.notes;
      slideElement.appendChild(notesElement);
    }
    
    this.element = slideElement;
    return slideElement;
  }
  
  // 슬라이드 HTML 문자열 가져오기
  getHTML() {
    if (!this.element) {
      this.create();
    }
    return this.element.outerHTML;
  }
  
  // DOM에 슬라이드 추가
  appendTo(container) {
    if (!this.element) {
      this.create();
    }
    
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    
    if (container) {
      container.appendChild(this.element);
      return true;
    }
    
    return false;
  }
  
  // 슬라이드 내용 업데이트
  updateContent(content) {
    this.options.content = content;
    
    if (this.element) {
      // 노트 요소 백업
      const notesElement = this.element.querySelector('.notes');
      
      // 새 콘텐츠로 업데이트
      this.element.innerHTML = content;
      
      // 노트 요소가 있었다면 다시 추가
      if (notesElement) {
        this.element.appendChild(notesElement);
      }
    }
    
    return this;
  }
  
  // 슬라이드 옵션 업데이트
  update(options) {
    this.options = { ...this.options, ...options };
    
    if (this.element) {
      // 필요한 경우 새 슬라이드 요소 생성
      const newElement = this.create();
      
      // 기존 요소 교체
      if (this.element.parentNode) {
        this.element.parentNode.replaceChild(newElement, this.element);
      }
      
      this.element = newElement;
    }
    
    return this;
  }
  
  // 정적 메서드: 마크다운에서 슬라이드 배열 생성
  static fromMarkdown(markdown, slideDelimiter = '---') {
    if (!markdown) return [];
    
    // 마크다운을 슬라이드로 분할
    const slideContents = markdown.split(new RegExp(`\\n${slideDelimiter}\\n`, 'g'));
    
    // 각 슬라이드 콘텐츠에서 Slide 객체 생성
    return slideContents.map(content => {
      // 발표자 노트 추출 (<!-- Note: ... --> 형식)
      let notes = '';
      const notesMatch = content.match(/<!--\s*Note:\s*([\s\S]*?)\s*-->/);
      
      if (notesMatch) {
        notes = notesMatch[1].trim();
        content = content.replace(notesMatch[0], '').trim();
      }
      
      // 슬라이드 타입 추출 (<!-- Type: ... --> 형식)
      let type = 'default';
      const typeMatch = content.match(/<!--\s*Type:\s*(\w+)\s*-->/);
      
      if (typeMatch) {
        type = typeMatch[1].trim();
        content = content.replace(typeMatch[0], '').trim();
      }
      
      // 전환 효과 추출 (<!-- Transition: ... --> 형식)
      let transition = null;
      const transitionMatch = content.match(/<!--\s*Transition:\s*(\w+)\s*-->/);
      
      if (transitionMatch) {
        transition = transitionMatch[1].trim();
        content = content.replace(transitionMatch[0], '').trim();
      }
      
      // 배경 추출 (<!-- Background: ... --> 형식)
      let background = null;
      const backgroundMatch = content.match(/<!--\s*Background:\s*([\s\S]*?)\s*-->/);
      
      if (backgroundMatch) {
        background = backgroundMatch[1].trim();
        content = content.replace(backgroundMatch[0], '').trim();
      }
      
      return new Slide({
        content, // 마크다운 콘텐츠가 HTML로 변환되어야 함
        type,
        transition,
        background,
        notes
      });
    });
  }
} 