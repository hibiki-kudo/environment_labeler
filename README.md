# 環境ラベラー Chrome拡張機能

異なる環境（開発・テスト・本番など）を視覚的に区別するための Chrome 拡張機能です。

## 概要

「環境ラベラー」は、異なる環境（開発環境・テスト環境・本番環境など）を視覚的に区別するためのシンプルな Chrome 拡張機能です。URL パターンに基づいてカスタマイズ可能なラベルをページに表示し、誤って本番環境で作業してしまうなどのミスを防ぎます。

### 主な機能

- URLパターンに基づいて環境ラベルを表示
- カスタマイズ可能なラベルテキスト、色、位置
- ホスト名から自動的に環境を推測
- 複数のURLパターンを登録可能
- シンプルで軽量な拡張機能

## インストール方法

### Chrome ウェブストアからのインストール

（公開後に追加予定）

### 開発者モードでのインストール

1. このリポジトリをクローンまたはダウンロードします
2. Chrome ブラウザで `chrome://extensions/` を開きます
3. 右上の「デベロッパーモード」をオンにします
4. 「パッケージ化されていない拡張機能を読み込む」をクリックします
5. ダウンロードしたフォルダを選択します

## 使い方

1. ラベルを追加したいサイトにアクセスします
2. Chrome のツールバーに表示される拡張機能のアイコンをクリックします
3. 「このサイトにラベルを追加」ボタンをクリックすると、現在のサイトのホスト名が自動的に入力されます
4. 環境に合わせてラベルのテキスト、色、位置を設定します
   - ホスト名によって自動的に環境を推測してラベル名と色を提案します
   - 必要に応じて変更可能です
5. 「保存」ボタンをクリックします
6. ページを再読み込みすると、設定したラベルが表示されます

## 設定例

以下は設定例です：

| 環境 | URLパターン | ラベル | 色 | 位置 |
|------|------------|-------|-----|------|
| 本番環境 | example.com | 本番環境 | #e74c3c (赤) | 右上 |
| テスト環境 | staging.example.com | テスト環境 | #f39c12 (オレンジ) | 右上 |
| 開発環境 | dev.example.com | 開発環境 | #3498db (青) | 右上 |
| ローカル環境 | localhost | ローカル環境 | #2ecc71 (緑) | 右上 |

## カスタマイズ方法

### ラベルの表示位置

ラベルは以下の4つの位置に表示できます：

- 右上 (top-right)
- 左上 (top-left)
- 右下 (bottom-right)
- 左下 (bottom-left)

### 自動環境推測ロジックの変更

`popup.js` の `guessEnvironment` 関数を編集することで、ホスト名からの環境推測ロジックをカスタマイズできます。

```javascript
function guessEnvironment(hostname) {
  if (hostname.includes('dev') || hostname.includes('develop')) {
    return '開発環境';
  } else if (hostname.includes('test') || hostname.includes('staging') || hostname.includes('stg')) {
    return 'テスト環境';
  } else if (hostname.includes('prod') || hostname.includes('www')) {
    return '本番環境';
  } else if (hostname.includes('local') || hostname.match(/^127\./)) {
    return 'ローカル環境';
  } else {
    return '環境ラベル';
  }
}
```

### URLマッチングロジックの変更

より複雑なURLマッチングが必要な場合は、`content.js` の `checkUrlPattern` 関数を修正してください。

```javascript
function checkUrlPattern(pattern, url) {
  // デフォルトでは単純な文字列一致
  return url.includes(pattern);
  
  // 正規表現を使用する場合の例
  // return new RegExp(pattern).test(url);
}
```

## ファイル構成

- `manifest.json` - 拡張機能の基本情報
- `popup.html` - 拡張機能の設定画面のHTML
- `popup.css` - 設定画面のスタイル
- `popup.js` - 設定画面の動作スクリプト
- `content.js` - ページにラベルを表示するスクリプト
- `styles.css` - ラベルのスタイル
- `images/` - 拡張機能のアイコン画像

## ブラウザ対応状況

- Google Chrome: サポート
- Microsoft Edge (Chromium版): 動作する可能性あり
- Firefox: 未対応
- Safari: 未対応

## 技術的詳細

- Chrome Extension Manifest V3 を使用
- ユーザー設定は chrome.storage.sync API を利用して保存
- コンテンツスクリプトを使用してページにラベルを挿入
- ページのDOM構造に干渉しないよう、絶対位置指定で表示

## 貢献方法

1. このリポジトリをフォークします
2. 新しいブランチを作成します (`git checkout -b feature/amazing-feature`)
3. 変更をコミットします (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュします (`git push origin feature/amazing-feature`)
5. プルリクエストを作成します


---

**注意**: この拡張機能は、重要なセキュリティ機能ではありません。視覚的な区別のためのツールとして使用し、本質的なセキュリティ対策としては使用しないでください。
