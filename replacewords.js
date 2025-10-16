(async function() {
    'use strict';
    
    const SCRIPT_NAME = 'VariantCharsTooltip';
    const DICT_URL = 'https://cdn.jsdelivr.net/gh/kayanorin/SillyTavernjs/variant-chars-dict.js';
    
    let VARIANT_DICT = null;
    let isProcessing = false;
    let initAttempts = 0;
    const MAX_ATTEMPTS = 5;
    
    // ============ 备用字典（网络失败时使用）============
    const FALLBACK_DICT = {
        "慊弃": { original: "嫌弃", explanation: "厌恶而不愿接近" },
        "忮愱": { original: "嫉妒", explanation: "因别人比自己好而憎恨" },
        "贪惏": { original: "贪婪", explanation: "贪得无厌" },
        "虜隶": { original: "奴隶", explanation: "被奴役的人" }
    };
    
    // ============ 加载字典数据 ============
    async function loadDictionary() {
        return new Promise((resolve, reject) => {
            console.log(`[${SCRIPT_NAME}] 正在加载字典... (尝试 ${initAttempts + 1}/${MAX_ATTEMPTS})`);
            
            // 如果已经存在，直接使用
            if (window.VARIANT_DICT && Object.keys(window.VARIANT_DICT).length > 0) {
                console.log(`[${SCRIPT_NAME}] 检测到已加载的字典`);
                resolve(window.VARIANT_DICT);
                return;
            }
            
            // 监听自定义事件
            const loadHandler = (event) => {
                console.log(`[${SCRIPT_NAME}] 字典加载完成，共 ${event.detail.count} 个词条`);
                resolve(window.VARIANT_DICT);
            };
            window.addEventListener('variantDictLoaded', loadHandler, { once: true });
            
            // 创建脚本标签
            const script = document.createElement('script');
            script.src = `${DICT_URL}?v=${Date.now()}`; // 防止缓存
            script.async = true;
            
            // 超时处理
            const timeoutId = setTimeout(() => {
                window.removeEventListener('variantDictLoaded', loadHandler);
                reject(new Error('字典加载超时'));
            }, 5000); // 5秒超时
            
            script.onload = function() {
                console.log(`[${SCRIPT_NAME}] 字典脚本已加载`);
                // 再等待一下确保执行完成
                setTimeout(() => {
                    clearTimeout(timeoutId);
                    if (window.VARIANT_DICT && Object.keys(window.VARIANT_DICT).length > 0) {
                        window.removeEventListener('variantDictLoaded', loadHandler);
                        resolve(window.VARIANT_DICT);
                    }
                }, 300);
            };
            
            script.onerror = function() {
                clearTimeout(timeoutId);
                window.removeEventListener('variantDictLoaded', loadHandler);
                reject(new Error('字典脚本加载失败'));
            };
            
            document.head.appendChild(script);
        });
    }
    
    // ============ 初始化字典（带重试）============
    async function initDictionary() {
        while (initAttempts < MAX_ATTEMPTS) {
            try {
                VARIANT_DICT = await loadDictionary();
                console.log(`[${SCRIPT_NAME}] 字典初始化成功，共 ${Object.keys(VARIANT_DICT).length} 个词条`);
                return true;
            } catch (error) {
                initAttempts++;
                console.warn(`[${SCRIPT_NAME}] 字典加载失败:`, error.message);
                
                if (initAttempts < MAX_ATTEMPTS) {
                    console.log(`[${SCRIPT_NAME}] ${1000 * initAttempts}ms 后重试...`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * initAttempts));
                } else {
                    console.error(`[${SCRIPT_NAME}] 字典加载失败，使用备用字典`);
                    VARIANT_DICT = FALLBACK_DICT;
                    return false;
                }
            }
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
                    z-index: 10000;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                }
                
                .variant-char:hover .variant-char-tooltip {
                    opacity: 1;
                    visibility: visible;
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
                
                const tooltipHtml = `
                    <span class="variant-tooltip-line">
                        <span class="variant-tooltip-original">${data.original}</span>
                        <span class="variant-tooltip-arrow">←</span>
                        ${match}
                    </span>
                    <span class="variant-tooltip-explanation">${data.explanation}</span>
                `;
                
                return `<span class="variant-char">${match}<span class="variant-char-tooltip">${tooltipHtml}</span></span>`;
            });
            
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
            setTimeout(processMessages, 250);
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log(`[${SCRIPT_NAME}] DOM监听已启动`);
    }
    
    // ============ 主初始化流程 ============
    async function init() {
        console.log(`[${SCRIPT_NAME}] ======== 开始初始化 ========`);
        
        // 1. 先注入样式
        injectStyles();
        
        // 2. 加载字典（带重试）
        await initDictionary();
        
        // 3. 等待DOM就绪
        $(document).ready(() => {
            // 4. 首次处理
            setTimeout(processMessages, 500);
            
            // 5. 定时处理（备用）
            setInterval(processMessages, 2000);
            
            // 6. 设置监听
            setupObserver();
            
            console.log(`[${SCRIPT_NAME}] ======== 初始化完成 ========`);
        });
    }
    
    // 启动
    init();
    
})();
