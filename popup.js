// 現在のタブのURLを取得して表示
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentUrl = tabs[0].url;
    document.getElementById('current-url').textContent = currentUrl;

    // 「このサイトにラベルを追加」ボタンのイベントリスナー
    document.getElementById('add-current').addEventListener('click', function() {
        // URLからホスト名部分を抽出
        const url = new URL(currentUrl);
        const hostname = url.hostname;

        // フォームに入力
        document.getElementById('url-pattern').value = hostname;
        document.getElementById('label-text').value = guessEnvironment(hostname);
        document.getElementById('label-color').value = getColorForEnvironment(guessEnvironment(hostname));
    });
});

// 保存ボタンのイベントリスナー
document.getElementById('save').addEventListener('click', function() {
    const urlPattern = document.getElementById('url-pattern').value.trim();
    const labelText = document.getElementById('label-text').value.trim();
    const labelColor = document.getElementById('label-color').value;
    const position = document.getElementById('position').value;

    if (!urlPattern || !labelText) {
        alert('URLパターンとラベルテキストを入力してください');
        return;
    }

    // 新しいルールを保存
    chrome.storage.sync.get('rules', function(data) {
        const rules = data.rules || [];

        // 既存のパターンと重複していないか確認
        const existingRuleIndex = rules.findIndex(rule => rule.urlPattern === urlPattern);

        if (existingRuleIndex !== -1) {
            // 既存のルールを更新
            rules[existingRuleIndex] = {
                urlPattern,
                labelText,
                labelColor,
                position
            };
        } else {
            // 新しいルールを追加
            rules.push({
                urlPattern,
                labelText,
                labelColor,
                position
            });
        }

        chrome.storage.sync.set({ rules }, function() {
            displayRules();
            // フォームをリセット
            document.getElementById('url-pattern').value = '';
            document.getElementById('label-text').value = '';
        });
    });
});

// ルール一覧を表示
function displayRules() {
    chrome.storage.sync.get('rules', function(data) {
        const rules = data.rules || [];
        const rulesListElement = document.getElementById('rules-list');

        rulesListElement.innerHTML = '';

        if (rules.length === 0) {
            rulesListElement.innerHTML = '<p>設定されたルールはありません</p>';
            return;
        }

        rules.forEach((rule, index) => {
            const ruleElement = document.createElement('div');
            ruleElement.className = 'rule-item';

            const positionText = {
                'top-right': '右上',
                'top-left': '左上',
                'bottom-right': '右下',
                'bottom-left': '左下'
            };

            ruleElement.innerHTML = `
        <div>
          <span class="label-sample" style="background-color: ${rule.labelColor}">${rule.labelText}</span>
          <span class="rule-pattern">${rule.urlPattern}</span>
        </div>
        <div class="position">位置: ${positionText[rule.position]}</div>
        <button class="delete-btn" data-index="${index}">×</button>
      `;

            rulesListElement.appendChild(ruleElement);
        });

        // 削除ボタンのイベントリスナーを追加
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));

                chrome.storage.sync.get('rules', function(data) {
                    const rules = data.rules || [];
                    rules.splice(index, 1);
                    chrome.storage.sync.set({ rules }, function() {
                        displayRules();
                    });
                });
            });
        });
    });
}

// ページ読み込み時にルール一覧を表示
document.addEventListener('DOMContentLoaded', displayRules);

// ホスト名から環境を推測する関数
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

// 環境名から色を取得する関数
function getColorForEnvironment(env) {
    switch (env) {
        case '開発環境':
            return '#3498db'; // 青
        case 'テスト環境':
            return '#f39c12'; // オレンジ
        case '本番環境':
            return '#e74c3c'; // 赤
        case 'ローカル環境':
            return '#2ecc71'; // 緑
        default:
            return '#9b59b6'; // 紫
    }
}