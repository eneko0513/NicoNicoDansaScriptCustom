## 開発者向けドキュメント
### ディレクトリ構造
<pre>
.
├── assets 静的なファイルの保管 ビルド時にdistにコピーされる
├── dist ビルド成果物の出力先
├── src ソースコード保管フォルダ
│   ├── @types 型定義ファイル用
│   ├── assets 画像とかSVGとか用
│   ├── components 各コンポーネントを格納 CSSを含むものはフォルダに入れてまとめる
│   ├── footers プレイヤー外下に表示されるブロック
│   ├── headers プレイヤー外上に表示されるブロック
│   ├── layer 動画上に表示されるレイヤー
│   ├── libraries 便利ツールとか
│   ├── main プレイヤー下に表示されるブロック
│   ├── options 設定機能
│   ├── memo メモ機能
│   └── popup ポップアップ(相互変換)用
└── test デバッグ用ツールとか
</pre>

### TSの書き方
#### Null/Undefinedの取り扱い
TypeGuard(src/libraries/typeGuard.ts)を使うか、ifで確認をする  
!で握りつぶすとlintに怒られるので注意

#### 型キャスト
`<type>hoge`とするとJSXと混同するため型をキャストするときは`hoge as type`でキャスト  

#### 拡張子
React(JSX)を含むものはtsxに、それ以外はtsにする

#### データ
データを保管する場合はtsファイルで変数に型付きで定義して、exportする  
JSONは型定義ができないので使用しない

#### メディア
メディアはsvgならJSXとして、画像ならblobとして`src/assets`にts/tsx形式で保存する  
メインのコードはscriptタグで挿入しているため、拡張機能側の機能を触れないので注意

### リリースの仕方
1. mainブランチにPullRequestを出しマージする
2. mainブランチ宛にバージョン名の変更,README.mdの変更をpushする。
2. main->ReleaseでPullRequestを出しマージする
3. Releaseブランチでmain->Releaseのマージコミット宛にバージョン名(vx.x.x)のタグをpushする
4. Actionが実行される（自動）
5. Discordの配布チャンネルでリリースノートを貼り付ける
6. Twitterで告知を行う