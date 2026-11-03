# GitHub 공개 전 최종 확인

- [x] Firebase Hosting 설정(`firebase.json`, `.firebaserc`) 제거
- [x] `package.json`의 Firebase 배포 스크립트 제거
- [x] 앱에 고정된 기존 Firebase Hosting 주소 제거 및 현재 접속 주소 기반 QR 링크 처리
- [x] 팀 내부 문서 분리 및 공개용 README 작성
- [x] Gemini 개발자 기본 키 포함 경로 제거, 사용자 키 입력(BYOK) 유지
- [x] `.env.local` 및 일반 인증파일 `.gitignore` 처리
- [ ] 본인 기여 사항, 팀 인원, 개발 기간을 README에 사실대로 추가
- [ ] 코드, 음성, 이미지, 로고, QR 등 모든 파일에 대한 공개 권한 확인
- [ ] 브라우저에 공개되는 Kakao/ODsay 키의 허용 도메인·쿼터 점검
- [ ] 과거 배포판에 노출된 키가 있었다면 폐기/재발급
- [ ] `npm ci && npm run check && npm test` 통과 확인
- [ ] GitHub에 올리기 전 실제 Git 추적 이력의 비밀정보 확인

주의: GitHub 공개와 Firebase 배포는 별개입니다. 이 ZIP은 Firebase Hosting 구성 파일을 포함하지 않습니다.
