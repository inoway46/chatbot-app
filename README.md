## 起動手順

1. .env.sampleを.envにリネーム
2. 環境変数を入れる（LINE DevelopersアカウントとPostgreSQLのセッティング）
3. `npm install`
4. `npx prisma migrate dev`
5. `npm run start`

## 機能説明

### ユーザー登録・一覧表示

- LINE Messaging APIの管理画面のQRコードから友達追加
- メッセージを送るとUserテーブルに登録される
  - 自動返信で「（ユーザーのメッセージ）ですね。」と返す
- `/users`でユーザー一覧の表示
  - ユーザー個別の「メッセージ一覧」「希望条件」ページに遷移できる

### メッセージの表示・送信

- `/users/:id/messages`で以下のことができる
- suumoの物件URLを入力し、「取得」ボタンを押すと、下部のtextareaに物件情報が自動入力される
- textareaにメッセージを入力し、「送信」ボタンを押すと、登録ユーザーにプッシュ通知できる
- ユーザーとのメッセージ履歴が表示される

### 希望条件の登録

- `/users/:id/condition`で家賃、平米数、間取り、都道府県の登録・更新が可能
