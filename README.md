# Drawing App For My Kids 🎨

- 아이들을 위한 아이패드용 그림 그리기/색칠 앱입니다.
- 아이패드 전용앱입니다. 오프라인에서도 사용이 가능합니다.
- 사진첩 혹은 URL을 통해 다운 받은 그림의 채색을 제거하고 그 위에 색을 칠할 수 있습니다.
- 다양한 그림과 사진을 편집할 수 있습니다.

# 💡 **프로젝트 동기**

저에게는 두 딸이 있습니다. 특히 6살인 큰 딸은 그림을 그리고 색칠하는 것에 푹 빠져 있습니다. 스케치북에 직접 그림을 그리기도 하지만 자주 아이패드의 앱을 가지고 색칠 놀이를 즐기기도 합니다.

앱스토에서 제공하는 앱들은 아쉬운 점이 여럿 있습니다. 그중 가장 큰 아쉬운 점은 앱에서 색칠할 수 있는 그림이 정해져 있는 것입니다. 요즘 아이들이 좋아하는 그림은 따로 있는데 말이죠. 게다가 앱에서 페인트 효과를 추가하거나 그리고 싶은 그림을 추가하려면 추가로 많은 비용을 지불해야 하는 단점이 있습니다.

이번 프로젝트에서는 기존 드로잉 앱을 사용하면서 느꼈던 아쉬운 점을 고려하여 아이들이 보다 자유롭게 그리고 색칠할 수 있는 아이패드 앱을 만들고자 하였습니다. 이 앱을 통해서 아이들은 쉽게 원하는 이미지를 불러와 채색을 제거하고 자유롭게 색칠 놀이를 할 수 있습니다.

# 👨‍🏫 **프로젝트 설명**

## 📱 앱 기능

### [시연 영상 링크](https://drive.google.com/file/d/10mXnwO511e1OwmTJqGGnZ_eexWI-mcrj/view?usp=sharing)

### ❶ 그림 노트북 생성/제거 기능

- 사용자 혹은 주제에 따른 노트북을 생성할 수 있습니다.
- 지정된 노트북을 삭제 할 수 있습니다.

### ❷ 그림 생성/제거 기능

- 빈 그림 생성 기능
- 사진첩 이미지 불러오기 기능
- URL 이미지 불러오기 기능

### ❸ 이미지 채색 제거 기능

- openCv라이브러리를 이용하여 Edge Detection 알고리즘 중 가장 많이 사용되는 Canny Edge Detection 알고리즘을 적용 하였습니다.
- 이를 통해 색이 있는 그림의 색을 제거하고 윤곽선을 딸 수 있습니다.
- 알고리즘에 작용하는 중요 변수들을 조절하여 채색 제거의 결과를 조정할 수 있습니다.

### ❹ 그림판 기능

- 파일 저장
- 기기 사진첩 저장
- 그리기
  - 펜 종류 선택
  - 색 선택
  - Undo
  - Redo
- 그림 삭제

## 📆 프로젝트 주차별 주요 작업 내용

### 주차별 작업 내용이 담긴 칸반 링크

- [KANBAN 링크](https://www.notion.so/KANBAN-747a6db6a3024087a67ba3fd46e1eb31)

### 𝟏주차：(06/27 월요일 ~ 07/03 일요일)

- 프로젝트 칸반 기획
- 기술스택 정리
- [Figma를 이용하여 프로젝트 Mockup 제작](https://www.figma.com/file/SvQJTP0mqZ3zdDZtPCKD9M/Drawing-App?node-id=0%3A1)
- [ React Native 공식문서 학습 ](https://www.notion.so/General-React-Native-717dcc2fea46441594c4bde7d187f49d)
- 기초 레이아웃 코드 작성
- 노트북 생성 기능 구현

### 𝟐주차：(07/04 월요일 ~ 07/10 일요일)

- [노트북과 그림파일의 CRUD 구현 작업 / Redux 형식으로 로컬파일 CRUD 구현하기](https://www.notion.so/vanillacoding/379ad5a83604482b97b7b8a7134549c9#6114c90db1a54dd8a0f4bd25796508a8)
- [react-natvie-canvas기반 그림판 구현, 그러나 실제 기기 구동시 원인을 알 수 없는 에러 발견](https://www.notion.so/vanillacoding/379ad5a83604482b97b7b8a7134549c9#bb21075a35e648d386cc9bde6d446dce)
- [새로운 캔버스 라이브러리 적용을 위해 Expo-go 환경에서 React Native Cli 환경으로 이전](https://www.notion.so/vanillacoding/379ad5a83604482b97b7b8a7134549c9#8342e4078e384d0c98070695a3c8ee78)
- [새로운 캔버스 라이브러리인 react-native-skia 적용하기](https://www.notion.so/vanillacoding/379ad5a83604482b97b7b8a7134549c9#d301fca20b6545aa9b899403f16dd9af)

### 𝟑주차：(07/11 월요일 ~ 07/15 일요일)

- [이미지 변환 기능 직접 구현 시도, 픽셀데이터를 불러오는 것부터 실패.](https://www.notion.so/vanillacoding/379ad5a83604482b97b7b8a7134549c9#3d5edda8435f4ca083d8d5a8bdd185c8)
- [openCv를 이용한 이미지 채색 제거 기능 구현](https://www.notion.so/vanillacoding/379ad5a83604482b97b7b8a7134549c9#aa545fe9be16490594f5f89eefab1b90)
- [react-natvie-openCv3 사용시 이미지 캡쳐가 안되는 문제 발견 및 해결](https://www.notion.so/vanillacoding/379ad5a83604482b97b7b8a7134549c9#b8992ccfa42b41f69681bcdcc5d45b0b)
- [그림판 최적화 작업](https://www.notion.so/vanillacoding/379ad5a83604482b97b7b8a7134549c9#1f554bc988754233b6c4e1c54aae2869)
- 리드미 초안 작성
- 테스트 코드 토대 작업

## 📚 기술 스택

### − 사용 언어

- Javascript

### − 앱 / 프론트엔드

- Expo-Go(React-Native)
- React Native Cli
- Styled-Components

### − 주요 사용 라이브러리

- react-native-opencv3
- react-native-skia
- react-native-view-shot
- react-native-async-storage
- expo-file-system
- expo-image-picker
- valtio(그림판 상태 관리)

### − 테스트

- Jest-native
- react-test-render

## 앱 기능

- 그림 노트북 생성 기능
<img src="https://user-images.githubusercontent.com/78262571/181182871-ba521ab3-989e-4b0f-8e6b-c5a00a05bb71.gif">

- 그림 생성 기능
  - 빈 그림 생성 기능
  - 사진첩 이미지 불러오기 기능
  - URL로 다운 받은 이미지 불러오기 기능
<img src="https://user-images.githubusercontent.com/78262571/181183004-1d38a377-99bd-4023-a0fd-8ea127a95228.gif">

- 이미지 채색 제거 기능
  - openCv라이브러리를 통한 Canny Edge Detection 알고리즘 적용
  - 이를 통해 색이 있는 그림의 색을 제거할 수 있습니다.
  - 알고리즘에 중요 변수들을 조절하여 알고리즘을 적용할 수 있습니다.
<img src="https://user-images.githubusercontent.com/78262571/181182683-a46a58c0-f98e-4264-82ce-e4536bda9245.gif">

- 그림판 기능
  - 파일 저장
  - 기기 사진첩 저장
  - 그리기
  - 지우기
  - 브러쉬 선택
  - 색 선택
  - Undo
  - 삭제
<img src="https://user-images.githubusercontent.com/78262571/181183272-f1fd392b-e449-46e9-8b3b-c969bc530f9b.gif">


## 실행 방법

- **애플 스토어 배포 준비중입니다.**

## 프로젝트 소감

처음 기획 했던 앱의 모습을 실제로 구현한 점에 대해서 매우 기쁘게 생각합니다. 큰 딸에게 선물 준다고 큰소리 쳤는데 약속을 지킬 수 있게 되어서 정말 다행입니다. 아이가 앱을 재밌게 잘 사용하는 모습을 보면서 굉장히 뿌듯했습니다.

개발 생태계의 중요성을 절실히 깨달았습니다. 여기저기서 React 생태계가 잘 되어있어서 개발에 큰 도움이 된다는 얘기를 많이 들었습니다. 반면 최근들어 부각 되는 Svelte의 경우 아직 생태계가 크지 않은 점이 단점 이라는 얘기 또한 많이 들었습니다.. 처음에는 이러한 얘기들이 그냥 그런가 보다 했는데 React-Native 프로젝트를 진행하면서 무슨 의미인지 제대로 이해하게 되었습니다.

React-Native 의 생태계는 React에 비해 매우 작고 좁았습니다. 그러한 이유로 프로젝트 과정 중에 발생한 문제를 해결하려고 했을때 그에 필요한 방법과 도구를 찾는게 매우 힘들었습니다. 심지어 관련 예시나 도구가 없는 경우도 즐비했습니다. 그로인해 저같은 초보 개발자에게는 너무 막막한 상황이 자주 연출됐습니다. 왜 사람들이 프로젝트로 React-Native를 피하는지 잘 이해할 수 있었습니다. 문제 해결 과정에서 피치 못하게 해결 할 수 없는 상황을 마주할 확률이 매우 컸기 때문입니다. 반대로 웹 개발환경에서 너무나도 당연하게 쓰고 있던 API와 스택오버플로우의 예시들이 얼마나 고맙고 특별한 건지 잘 이해할 수 있었습니다. 동시에 개발 생태계의 두터움이 생태계 구성원의 학습과 문제 해결에 미치는 영향이 얼마나 큰지 이해하는 계기가 되었습니다. 나도 나중에는 생태계에 기여하고 싶다는 생각이 들었습니다.

지속적으로 마주 했던 문제들을 해결하는 과정이 힘들었지만 배움과 자신감에 큰 도움이 되었습니다. 낯설고 제약이 많은 환경속에서 프로젝트 마지막까지 앱을 완성 시킬 수 있을지 두려웠고 나를 의심했습니다. 결과적으로 이러한 상황을 통해 더욱 깊이 있는 배움을 하고 정신적으로 조금은 단단해진 느낌을 갖게 되었습니다. 고생 끝에 낙이 왔습니다.

## 라이센스

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

## 참고사항

- [React Native CLI 이전 전까지의 코드가 담긴 github 저장소 링크](https://github.com/apotatos11/drawing-app-for-my-kids)

## 만든 사람

- apotatos11dev@gmail.com
