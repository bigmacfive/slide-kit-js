# SlideKit

HTML 기반 프레젠테이션 라이브러리

## 소개

SlideKit은 웹 기반 프레젠테이션을 쉽게 만들 수 있는 자바스크립트 라이브러리입니다. HTML, CSS, JavaScript를 이용하여 아름답고 인터랙티브한 슬라이드쇼를 만들 수 있습니다.

## 특징

- 쉬운 HTML 슬라이드 생성
- 다양한 전환 효과
- 테마 시스템
- 플러그인 지원
- 마크다운 지원
- 코드 구문 강조
- 발표자 모드

## 설치

```bash
npm install slidekit
```

## 사용 방법

### 기본 사용법

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/slidekit/dist/slidekit.css">
</head>
<body>
  <div class="slidekit-container">
    <div class="slide">
      <h1>첫 번째 슬라이드</h1>
      <p>환영합니다!</p>
    </div>
    <div class="slide">
      <h1>두 번째 슬라이드</h1>
      <p>SlideKit으로 멋진 프레젠테이션을 만들어보세요!</p>
    </div>
  </div>

  <script src="node_modules/slidekit/dist/slidekit.js"></script>
  <script>
    const presentation = new SlideKit.Presentation();
    presentation.init();
  </script>
</body>
</html>
```

## 문서

자세한 사용법은 [문서](docs/README.md)를 참조하세요.

## 라이선스

MIT 