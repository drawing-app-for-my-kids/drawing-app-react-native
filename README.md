# Drawing App For My Kids 🎨

- 아이들을 위한 아이패드용 그림 그리기/색칠 앱입니다.
- React Native로 만든 아이패드 전용앱니다. 오프라인에서도 사용이 가능합니다.
- 앱을 통해 사진첩 혹은 URL을 통해 다운 받은 그림의 채색을 제거하여 색칠할 수 있습니다.

## 기술 스택

- React Native
- Styled Components
- react-native-openCv3
- react-native-skia
- React Native CLI
- Expo CLI
- Prettier
- ESLint

## 앱 기능

- 그림 노트북 생성 기능
- 그림 생성 기능
  - 빈 그림 생성 기능
  - 사진첩 이미지 불러오기 기능
  - URL로 다운 받은 이미지 불러오기 기능
- 이미지 채색 제거 기능
  - openCv라이브러리를 통한 Canny Edge Detection 알고리즘 적용
  - 이를 통해 색이 있는 그림의 색을 제거할 수 있습니다.
  - 알고리즘에 중요 변수들을 조절하여 알고리즘을 적용할 수 있습니다.
- 그림판 기능
  - 파일 저장
  - 기기 사진첩 저장
  - 그리기
  - 지우기
  - 브러쉬 선택
  - 색 선택
  - Undo
  - 삭제

## 앱 사용 화면

## 실행 방법(로컬) (작성중))

프로젝트의 클론을 생성합니다.

```bash
  git clone https://github.com/drawing-app-for-my-kids/drawing-app-react-native.git
```

해당 프로젝트 디렉토리로 이동합니다.

```bash
  cd drawaing
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## 내가 배운 것들

- 개발을 위한 에코시스템의 중요성
- 리액트 네이티브의 한계점
- Expo CLI와 React Native CLI의 차이점
- 렌더링 최적화

## 최적화

- 그림판의 최적화를 위해 어떤 고민을 하였는가?

## 라이센스

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

## 만든 사람

- 남원일 / apotatos11dev@gmail.com
