# React Memo App

## About

Velopert 님의 [Express 와 React.js 를 사용한 웹 어플리케이션 만들기](https://velopert.com/1921 "VelopertBlog")
강좌를 토대로 학습한 결과물입니다.

2016년 강좌로 라이브러리들이 현재(2020년) 버전과 달라 문법적으로 변경된 부분들을 수정하고, 개인적으로 추가한 부분이 있습니다.

## 수정 사항
- webpack config 변경
- babel 버전 변경으로 설정문법 변경
- UglifyJsPlugin, HtmlWebPackPlugin 추가
- build 관련 경로 수정
- Animation Component : ReactCSSTransitionGroup -> ReactTransitionGroup
- TimeAgo 언어 한글로 변경
- MongoDB 접속 인증 설정

## 추가 사항
- state 변경하는 부분을 ImmutableJS 사용하여 변경
- Memo 등록 수정 시 TextArea 대신 Toast Editor 적용
- 로그인, 로그아웃 후 컴포넌트 리렌더링이 되지 않아서 수정, 삭제 드롭다운 버튼이 그대로 남아있는 경우를 발견. 로그인, 로그아웃 후 컴포넌트 리렌더링
- 메모 수정 상태에서 로그아웃 시 위와 같은 문제로 Toast Editor 창이 그대로 남아있음. 컴포넌트 리렌더링 변경
- API Server 는 운영중인 NAS 로, Client 소스는 Github page 로 분리
- API Server 분리로 express, axios CORS(Cross-Origin Resource Sharing) 처리 추가

## 추후 학습, 작업이 필요한 부분
- 반복적인 코드 부분 함수분리로 처리
- Eslint, Pretter 적용 (Airbnb Style 로 코드 수정)
- class component 만 사용했는데 필요한 부분은 functional component 사용
- Immutable -> Immer 사용
- Rudex -> Mobx 사용
- Redux-thunk -> Redux-saga 사용
- SSR(Server Side Rendering), Code Splitting => Next.js

## Script
- `npm run development` : 개발환경 실행하기
- `npm run build` : 서버 & 클라이언트 빌드
- `npm run clean` : 서버 & 클라이언트 빌드결과 삭제
- `npm run start` : 운영환경 실행

## Demo Page
https://chaos-develop.github.io/react-memo/

## 문제점
- GITHUB PAGE 에서 경로 문제. '/' 경로로 작성 시 https://chaos-develop.github.io/react-memo 로 인식할 것으로 생각했으나  https://chaos-develop.github.io 로 인식하여 정적 컨텐츠 경로 문제 발생. './' 상대 경로로 수정 시 URL 다이렉트로 접근시 문제가 발생함. package.json 의 homepage 옵션으로 해결안됨. baee url 태그 해결 안됨.
