// 環境ラベルを作成して表示する関数
function createEnvironmentLabel(rule) {
    // すでに同じパターンのラベルが存在する場合は削除
    const existingLabel = document.querySelector(`.environment-label[data-pattern="${rule.urlPattern}"]`);
    if (existingLabel) {
        existingLabel.remove();
    }

    // 新しいラベル要素を作成
    const label = document.createElement('div');
    label.className = `environment-label ${rule.position}`;
    label.setAttribute('data-pattern', rule.urlPattern);
    label.textContent = rule.labelText;
    label.style.backgroundColor = rule.labelColor;
    label.style.opacity = "0.5"; // 透明度を設定

    // ドキュメントに追加
    document.body.appendChild(label);
}

// 現在のURLとパターンがマッチするかチェック
function checkUrlPattern(pattern, url) {
    // 単純な文字列一致
    return url.includes(pattern);
}

// ページ読み込み時に実行
function initEnvironmentLabels() {
    chrome.storage.sync.get('rules', function(data) {
        const rules = data.rules || [];
        const currentUrl = window.location.href;

        rules.forEach(rule => {
            if (checkUrlPattern(rule.urlPattern, currentUrl)) {
                createEnvironmentLabel(rule);
            }
        });
    });
}

// ページ読み込み完了時に実行
window.addEventListener('load', initEnvironmentLabels);

// ストレージが変更されたときに再適用
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync' && changes.rules) {
        initEnvironmentLabels();
    }
});