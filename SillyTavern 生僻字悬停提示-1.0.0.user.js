// ==UserScript==
// @name         SillyTavern 生僻字悬停提示
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  为 SillyTavern 对话中的异体字添加悬停提示
// @author       kayanorin
// @match        http://localhost:8000/*
// @match        http://127.0.0.1:8000/*
// @match        http://localhost:*/*
// @match        https://your-sillytavern-domain.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=localhost
// @grant        GM_addStyle
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_NAME = 'VariantCharsTooltip';
    const DICT_URL = 'https://cdn.jsdelivr.net/gh/kayanorin/SillyTavernjs@main/variant-chars-dict.js';

    let VARIANT_DICT = null;
    let isProcessing = false;

    // ============ 备用字典 ============
    const FALLBACK_DICT = {
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

    // ============ 注入CSS样式 ============
    GM_addStyle(`
        .variant-char {
            position: relative;
            display: inline;
            cursor: help;
            color: #667eea !important;
            font-weight: 500;
            border-bottom: 1px dashed rgba(102, 126, 234, 0.5);
            transition: all 0.2s ease;
        }

        .variant-char:hover {
            color: #5a67d8 !important;
            border-bottom-color: #5a67d8;
        }

        .variant-char-tooltip {
            position: absolute;
            bottom: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 14px;
            background: rgba(0, 0, 0, 0.95);
            color: #fff;
            border-radius: 6px;
            font-size: 13px;
            font-weight: normal;
            line-height: 1.5;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
            z-index: 99999 !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .variant-char:hover .variant-char-tooltip {
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateX(-50%) translateY(-3px);
        }

        .variant-char-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 6px solid transparent;
            border-top-color: rgba(0, 0, 0, 0.95);
        }

        .variant-tooltip-line {
            display: block;
            text-align: center;
        }

        .variant-tooltip-original {
            color: #fbbf24;
            font-weight: 600;
        }

        .variant-tooltip-arrow {
            color: #9ca3af;
            margin: 0 6px;
        }

        .variant-tooltip-explanation {
            color: #d1d5db;
            font-size: 12px;
            margin-top: 6px;
            padding-top: 6px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
    `);

    console.log(`[${SCRIPT_NAME}] CSS样式已注入`);

    // ============ 加载字典 ============
    async function loadDictionary() {
        try {
            console.log(`[${SCRIPT_NAME}] 正在加载字典...`);

            const response = await fetch(DICT_URL + '?v=' + Date.now());
            const scriptText = await response.text();

            // 执行脚本
            eval(scriptText);

            // 等待变量可用
            await new Promise(resolve => setTimeout(resolve, 200));

            if (window.VARIANT_DICT && Object.keys(window.VARIANT_DICT).length > 0) {
                VARIANT_DICT = window.VARIANT_DICT;
                console.log(`[${SCRIPT_NAME}] 字典加载成功，共 ${Object.keys(VARIANT_DICT).length} 个词条`);
                return true;
            } else {
                throw new Error('字典变量未定义');
            }
        } catch (error) {
            console.error(`[${SCRIPT_NAME}] 字典加载失败:`, error);
            VARIANT_DICT = FALLBACK_DICT;
            console.log(`[${SCRIPT_NAME}] 使用备用字典，共 ${Object.keys(FALLBACK_DICT).length} 个词条`);
            return false;
        }
    }

    // ============ 生成正则表达式 ============
    function createRegex() {
        if (!VARIANT_DICT) return null;

        const words = Object.keys(VARIANT_DICT).sort((a, b) => b.length - a.length);
        const escapedWords = words.map(word =>
            word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        );

        return new RegExp(`(${escapedWords.join('|')})`, 'g');
    }

    // ============ 创建 Tooltip 元素 ============
    function createTooltipElement(word, data) {
        const wrapper = document.createElement('span');
        wrapper.className = 'variant-char';
        wrapper.textContent = word;

        const tooltip = document.createElement('span');
        tooltip.className = 'variant-char-tooltip';

        const line = document.createElement('span');
        line.className = 'variant-tooltip-line';

        const original = document.createElement('span');
        original.className = 'variant-tooltip-original';
        original.textContent = data.original;

        const arrow = document.createElement('span');
        arrow.className = 'variant-tooltip-arrow';
        arrow.textContent = '→';

        line.appendChild(original);
        line.appendChild(arrow);
        line.appendChild(document.createTextNode(word));

        const explanation = document.createElement('span');
        explanation.className = 'variant-tooltip-explanation';
        explanation.textContent = data.explanation;

        tooltip.appendChild(line);
        tooltip.appendChild(explanation);
        wrapper.appendChild(tooltip);

        return wrapper;
    }

    // ============ 处理消息文本 ============
    function processMessages() {
        if (isProcessing || !VARIANT_DICT) return;

        isProcessing = true;
        let processedCount = 0;
        const regex = createRegex();

        if (!regex) {
            isProcessing = false;
            return;
        }

        // SillyTavern 的消息容器选择器（根据实际情况调整）
        const messageSelectors = [
            '.mes .mes_text',           // 标准消息
            '#chat .message .mes_text', // 聊天消息
            '.swipe-text'               // 滑动消息
        ];

        messageSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(mesText => {
                if (mesText.dataset.variantTooltipProcessed) return;

                const text = mesText.textContent;
                if (!text) return;

                // 检查是否包含目标词
                let hasMatch = false;
                for (let word in VARIANT_DICT) {
                    if (text.includes(word)) {
                        hasMatch = true;
                        break;
                    }
                }

                if (!hasMatch) return;

                // 获取所有匹配项
                const matches = [];
                let match;
                regex.lastIndex = 0;

                while ((match = regex.exec(text)) !== null) {
                    matches.push({
                        word: match[0],
                        index: match.index
                    });
                }

                if (matches.length === 0) return;

                // 清空并重新构建
                mesText.innerHTML = '';

                let lastIndex = 0;
                matches.forEach(matchInfo => {
                    // 添加前面的文本
                    if (matchInfo.index > lastIndex) {
                        mesText.appendChild(
                            document.createTextNode(text.substring(lastIndex, matchInfo.index))
                        );
                    }

                    // 添加 tooltip 元素
                    const data = VARIANT_DICT[matchInfo.word];
                    if (data) {
                        mesText.appendChild(createTooltipElement(matchInfo.word, data));
                    } else {
                        mesText.appendChild(document.createTextNode(matchInfo.word));
                    }

                    lastIndex = matchInfo.index + matchInfo.word.length;
                });

                // 添加剩余文本
                if (lastIndex < text.length) {
                    mesText.appendChild(document.createTextNode(text.substring(lastIndex)));
                }

                mesText.dataset.variantTooltipProcessed = 'true';
                processedCount++;
            });
        });

        if (processedCount > 0) {
            console.log(`[${SCRIPT_NAME}] 已处理 ${processedCount} 条消息`);
        }

        isProcessing = false;
    }

    // ============ 监听DOM变化 ============
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            setTimeout(processMessages, 300);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log(`[${SCRIPT_NAME}] DOM监听已启动`);
    }

    // ============ 初始化 ============
    async function init() {
        console.log(`[${SCRIPT_NAME}] ======== 开始初始化 ========`);

        // 等待页面完全加载
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // 加载字典
        await loadDictionary();

        // 等待酒馆初始化（多等一会儿）
        setTimeout(() => {
            processMessages();
            setupObserver();

            // 定时处理（备用）
            setInterval(processMessages, 3000);

            console.log(`[${SCRIPT_NAME}] ======== 初始化完成 ========`);
        }, 2000);
    }

    init();

})();
