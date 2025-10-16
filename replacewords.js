(async function() {
    'use strict';
    
    const SCRIPT_NAME = 'VariantCharsTooltip';
    const DICT_URL = 'https://cdn.jsdelivr.net/gh/kayanorin/SillyTavernjs/variant-chars-dict.js';
    
    let VARIANT_DICT = null;
    let isProcessing = false;
    
    // ============ 加载字典数据 ============
    async function loadDictionary() {
        try {
            console.log(`[${SCRIPT_NAME}] 正在加载字典...`);
            
            const script = document.createElement('script');
            script.src = DICT_URL + '?t=' + Date.now();
            
            await new Promise((resolve, reject) => {
                script.onload = () => {
                    // 等待一小段时间确保脚本执行完成
                    setTimeout(resolve, 100);
                };
                script.onerror = reject;
                document.head.appendChild(script);
            });
            
            // 检查全局变量
            if (window.VARIANT_DICT && Object.keys(window.VARIANT_DICT).length > 0) {
                VARIANT_DICT = window.VARIANT_DICT;
                console.log(`[${SCRIPT_NAME}] 字典加载成功，共 ${Object.keys(VARIANT_DICT).length} 个词条`);
                return true;
            } else {
                throw new Error('字典变量为空或未定义');
            }
        } catch (error) {
            console.error(`[${SCRIPT_NAME}] 字典加载失败:`, error);
            
            // 使用备用字典
            VARIANT_DICT = {
                "慊弃": { original: "嫌弃", explanation: "厌恶而不愿接近" },
                "忮愱": { original: "嫉妒", explanation: "因别人比自己好而憎恨" },
                "贪惏": { original: "贪婪", explanation: "贪得无厌" },
                "虜隶": { original: "奴隶", explanation: "被奴役的人" }
            };
            console.log(`[${SCRIPT_NAME}] 使用备用字典，共 ${Object.keys(VARIANT_DICT).length} 个词条`);
            return false;
        }
    }
    
    // ============ 注入CSS样式 ============
    function injectStyles() {
        if ($('#variant-chars-tooltip-style').length > 0) return;
        
        $('<style id="variant-chars-tooltip-style">')
            .text(`
                .variant-char {
                    position: relative;
                    display: inline;
                    cursor: help;
                    color: #667eea;
                    font-weight: 500;
                    border-bottom: 1px dashed rgba(102, 126, 234, 0.5);
                    transition: all 0.2s ease;
                }
                
                .variant-char:hover {
                    color: #5a67d8;
                    border-bottom-color: #5a67d8;
                }
                
                .variant-char-tooltip {
                    position: absolute;
                    bottom: calc(100% + 8px);
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 8px 12px;
                    background: rgba(0, 0, 0, 0.92);
                    color: #fff;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: normal;
                    line-height: 1.4;
                    white-space: nowrap;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s ease, transform 0.2s ease;
                    z-index: 10000;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }
                
                .variant-char:hover .variant-char-tooltip {
                    opacity: 1;
                    transform: translateX(-50%) translateY(-2px);
                }
                
                .variant-char-tooltip::after {
                    content: '';
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border: 6px solid transparent;
                    border-top-color: rgba(0, 0, 0, 0.92);
                }
                
                .variant-tooltip-original {
                    color: #fbbf24;
                    font-weight: 600;
                }
                
                .variant-tooltip-arrow {
                    color: #9ca3af;
                    margin: 0 4px;
                }
                
                .variant-tooltip-explanation {
                    color: #d1d5db;
                    font-size: 12px;
                    display: block;
                    margin-top: 4px;
                    padding-top: 4px;
                    border-top: 1px solid rgba(255, 255, 255, 0.2);
                }
            `)
            .appendTo('head');
        
        console.log(`[${SCRIPT_NAME}] CSS样式已注入`);
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
        
        $('.mes').each(function() {
            const $message = $(this);
            const $mesText = $message.find('.mes_text');
            
            if ($mesText.length === 0) return;
            if ($mesText.attr('data-variant-tooltip-processed')) return;
            
            let html = $mesText.html();
            if (!html) return;
            
            // 检查是否包含目标词
            let hasMatch = false;
            for (let word in VARIANT_DICT) {
                if (html.includes(word)) {
                    hasMatch = true;
                    break;
                }
            }
            
            if (!hasMatch) return;
            
            // 替换为带tooltip的版本
            const originalHtml = html;
            html = html.replace(regex, function(match) {
                const data = VARIANT_DICT[match];
                if (!data) return match;
                
                // 使用简单的结构，避免嵌套问题
                return `<span class="variant-char">${match}<span class="variant-char-tooltip"><span class="variant-tooltip-original">${data.original}</span><span class="variant-tooltip-arrow">←</span>${match}<span class="variant-tooltip-explanation">${data.explanation}</span></span></span>`;
            });
            
            // 只有内容确实改变了才更新
            if (html !== originalHtml) {
                $mesText.html(html);
                $mesText.attr('data-variant-tooltip-processed', 'true');
                processedCount++;
            }
        });
        
        if (processedCount > 0) {
            console.log(`[${SCRIPT_NAME}] 已处理 ${processedCount} 条消息`);
        }
        
        isProcessing = false;
    }
    
    // ============ 监听DOM变化 ============
    function setupObserver() {
        const observer = new MutationObserver(() => {
            setTimeout(processMessages, 200);
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log(`[${SCRIPT_NAME}] DOM监听已启动`);
    }
    
    // ============ 初始化 ============
    async function init() {
        console.log(`[${SCRIPT_NAME}] 开始初始化...`);
        
        await loadDictionary();
        injectStyles();
        
        $(document).ready(() => {
            setTimeout(processMessages, 300);
            setInterval(processMessages, 1500);
            setupObserver();
            
            console.log(`[${SCRIPT_NAME}] 初始化完成！`);
        });
    }
    
    init();
    
})();