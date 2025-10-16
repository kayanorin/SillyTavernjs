(function() {
    'use strict';
    
    // 使用立即执行函数确保变量立即可用
    window.VARIANT_DICT = {
        "慊弃": { original: "嫌弃", explanation: "厌恶而不愿接近" },
        "忮愱": { original: "嫉妒", explanation: "因别人比自己好而憎恨" },
        "忮忌": { original: "嫉妒", explanation: "嫉妒忌恨" },
        "倒楣": { original: "倒霉", explanation: "遭遇不顺利" },
        "秽气": { original: "晦气", explanation: "不吉利、运气不好" },
        "闝倡": { original: "嫖娼", explanation: "狎妓" },
        "白剽": { original: "白嫖", explanation: "不付费而获取" },
        "贪惏": { original: "贪婪", explanation: "贪得无厌" },
        "虜隶": { original: "奴隶", explanation: "被奴役的人" },
        "螙药": { original: "毒药", explanation: "有毒的药物" }
    };
    
    // 触发自定义事件通知加载完成
    window.dispatchEvent(new CustomEvent('variantDictLoaded', {
        detail: { count: Object.keys(window.VARIANT_DICT).length }
    }));
    
    console.log('[VariantDict] 字典已加载，共', Object.keys(window.VARIANT_DICT).length, '个词条');
})();
