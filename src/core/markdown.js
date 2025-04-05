import { marked } from 'marked';

export class MarkdownSupport {
  constructor(presentation) {
    this.presentation = presentation;
    this.mdElements = [];
    
    // 마크다운 설정
    this.markedOptions = {
      gfm: true,
      breaks: true,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: true
    };
    
    // 마크다운 초기화
    this.init();
  }
  
  init() {
    // 마크다운으로 작성된 요소 찾기
    this.mdElements = Array.from(this.presentation.container.querySelectorAll('[data-markdown]'));
    
    // 마크다운 요소 처리
    this.processMarkdown();
    
    // 슬라이드 변경 이벤트 리스너 추가
    this.presentation.container.addEventListener('slideChanged', () => {
      // 동적으로 추가된 새 마크다운 요소 찾기
      const newMdElements = Array.from(this.presentation.container.querySelectorAll('[data-markdown]'))
        .filter(element => !this.mdElements.includes(element));
      
      if (newMdElements.length > 0) {
        this.mdElements = [...this.mdElements, ...newMdElements];
        this.processMarkdown(newMdElements);
      }
    });
  }
  
  // 마크다운 요소 처리
  processMarkdown(elements = this.mdElements) {
    elements.forEach(element => {
      // 마크다운 소스 가져오기
      let markdown = '';
      
      // 요소에 data-markdown-src 속성이 있는 경우
      const markdownSrc = element.getAttribute('data-markdown-src');
      if (markdownSrc) {
        // 외부 마크다운 파일 불러오기
        this.loadExternalMarkdown(element, markdownSrc);
        return;
      }
      
      // 요소의 내용을 마크다운으로 처리
      markdown = element.textContent;
      
      // 마크다운을 HTML로 변환
      const html = this.renderMarkdown(markdown);
      
      // 요소에 HTML 적용
      element.innerHTML = html;
      
      // 처리가 완료된 요소는 data-markdown 속성 제거
      element.removeAttribute('data-markdown');
      element.setAttribute('data-markdown-processed', 'true');
    });
  }
  
  // 외부 마크다운 파일 불러오기
  loadExternalMarkdown(element, src) {
    fetch(src)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(markdown => {
        // 마크다운을 HTML로 변환
        const html = this.renderMarkdown(markdown);
        
        // 요소에 HTML 적용
        element.innerHTML = html;
        
        // 처리가 완료된 요소는 data-markdown 속성 제거
        element.removeAttribute('data-markdown');
        element.removeAttribute('data-markdown-src');
        element.setAttribute('data-markdown-processed', 'true');
      })
      .catch(error => {
        console.error('마크다운 파일 로드 실패:', error);
        element.innerHTML = `<p class="error">마크다운 파일 로드 실패: ${error.message}</p>`;
      });
  }
  
  // 마크다운을 HTML로 변환
  renderMarkdown(markdown) {
    return marked.parse(markdown, this.markedOptions);
  }
  
  // 외부에서 마크다운 처리하기 위한 메서드
  render(markdown) {
    return this.renderMarkdown(markdown);
  }
} 