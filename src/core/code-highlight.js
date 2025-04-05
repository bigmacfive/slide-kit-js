import hljs from 'highlight.js';

export class CodeHighlight {
  constructor(presentation) {
    this.presentation = presentation;
    this.codeElements = [];
    
    // 구문 강조 초기화
    this.init();
  }
  
  init() {
    // 코드 요소 찾기
    this.findCodeElements();
    
    // 코드 요소에 구문 강조 적용
    this.highlightCode();
    
    // 슬라이드 변경 이벤트 리스너 추가
    this.presentation.container.addEventListener('slideChanged', () => {
      // 코드 요소 다시 찾기
      this.findCodeElements();
      
      // 새 코드 요소에 구문 강조 적용
      this.highlightCode();
    });
  }
  
  // 코드 요소 찾기
  findCodeElements() {
    const allElements = Array.from(this.presentation.container.querySelectorAll('pre code'));
    this.codeElements = allElements.filter(element => !element.hasAttribute('data-highlighted'));
  }
  
  // 코드 구문 강조 적용
  highlightCode() {
    this.codeElements.forEach(element => {
      // 언어 지정 확인
      const language = this.getLanguage(element);
      
      try {
        if (language && language !== 'none') {
          // 특정 언어로 강조 처리
          hljs.highlightElement(element);
        } else if (language !== 'none') {
          // 자동 언어 감지로 강조 처리
          hljs.highlightAuto(element);
        }
        
        // 처리 완료 표시
        element.setAttribute('data-highlighted', 'true');
      } catch (error) {
        console.error('코드 강조 오류:', error);
      }
    });
  }
  
  // 언어 가져오기
  getLanguage(element) {
    // className을 확인하여 언어 가져오기 (예: language-javascript)
    const className = element.className;
    
    if (className.indexOf('language-') === 0) {
      return className.substring(9); // 'language-' 이후의 문자열
    }
    
    // data-language 속성 확인
    const dataLang = element.getAttribute('data-language');
    if (dataLang) {
      return dataLang;
    }
    
    return null;
  }
  
  // 외부에서 코드 강조를 위한 메서드
  highlight(code, language) {
    if (language) {
      return hljs.highlight(code, { language }).value;
    } else {
      return hljs.highlightAuto(code).value;
    }
  }
} 