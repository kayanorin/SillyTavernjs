// main.js - 酒馆助手核心脚本
// 文言字符替换与字典系统

(function() {
  'use strict';
  
  // ==================== 配置区 ====================
  const CONFIG = {
    // 字典文件URL（修改为你的实际URL）
    dictionaryUrl: 'https://你的字典文件URL/dictionary.js',
    
    // 正则替换作用域
    regexScope: 'ai', // 'ai' | 'user' | 'all'
    
    // 样式配置
    highlightColor: '#e6f3ff',
    highlightHoverColor: '#cce5ff',
    popupZIndex: 10000
  };
  
  // ==================== 全局变量 ====================
  let dictionary = null;
  let scanRegex = null;
  let isInitialized = false;
  
  // ==================== 初始化 ====================
  async function initialize() {
    if (isInitialized) return;
    
    console.log('[文言字典] 开始初始化...');
    
    // 1. 加载字典
    await loadDictionary();
    
    if (!dictionary) {
      console.error('[文言字典] 字典加载失败，系统未启动');
      return;
    }
    
    // 2. 创建酒馆正则规则
    createTavernRegexRules();
    
    // 3. 构建扫描正则
    buildScanRegex();
    
    // 4. 注册消息监听
    registerMessageListener();
    
    // 5. 创建样式
    injectStyles();
    
    isInitialized = true;
    console.log('[文言字典] 初始化完成');
  }
  
  // ==================== 字典加载 ====================
  async function loadDictionary() {
    try {
      // 检查是否已经通过import加载
      if (window.CharDictionary && window.CharDictionary._loaded) {
        dictionary = window.CharDictionary;
        console.log(`[文言字典] 字典已加载 v${dictionary._version}`);
        return;
      }
      
      // 动态加载脚本
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = CONFIG.dictionaryUrl;
        script.onload = () => {
          if (window.CharDictionary && window.CharDictionary._loaded) {
            dictionary = window.CharDictionary;
            resolve();
          } else {
            reject(new Error('字典文件格式错误'));
          }
        };
        script.onerror = () => reject(new Error('字典文件加载失败'));
        document.head.appendChild(script);
      });
      
    } catch (error) {
      console.error('[文言字典] 加载失败:', error);
    }
  }
  
  // ==================== 酒馆正则规则生成 ====================
  function createTavernRegexRules() {
    if (!window.executeSlashCommands) {
      console.warn('[文言字典] 未找到酒馆命令系统，跳过正则创建');
      return;
    }
    
    const rules = [];
    
    for (const [targetChar, data] of Object.entries(dictionary)) {
      if (data.enableReplace && data.original) {
        rules.push({
          original: data.original,
          target: targetChar
        });
      }
    }
    
    if (rules.length === 0) {
      console.log('[文言字典] 没有需要替换的字符');
      return;
    }
    
    // 通过酒馆命令创建正则
    // 注意：这里使用酒馆的正则系统，具体API可能需要根据实际情况调整
    rules.forEach(rule => {
      const scriptName = `文言替换_${rule.original}到${rule.target}`;
      const regexPattern = rule.original;
      const replacement = rule.target;
      
      // 构建酒馆正则命令
      const command = `/regex-add name="${scriptName}" find="${regexPattern}" replace="${replacement}" scope="${CONFIG.regexScope}" enabled=on`;
      
      try {
        window.executeSlashCommands(command);
        console.log(`[文言字典] 已创建替换规则: ${rule.original} → ${rule.target}`);
      } catch (error) {
        console.error(`[文言字典] 创建规则失败:`, error);
      }
    });
    
    console.log(`[文言字典] 共创建 ${rules.length} 条替换规则`);
  }
  
  // ==================== 扫描正则构建 ====================
  function buildScanRegex() {
    const chars = Object.keys(dictionary).filter(key => !key.startsWith('_'));
    
    if (chars.length === 0) {
      console.warn('[文言字典] 字典为空');
      return;
    }
    
    // 创建匹配所有字典字符的正则
    const pattern = chars.map(char => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    scanRegex = new RegExp(`(${pattern})`, 'g');
    
    console.log(`[文言字典] 扫描正则已构建，监控 ${chars.length} 个字符`);
  }
  
  // ==================== 消息监听 ====================
  function registerMessageListener() {
    // 监听酒馆消息渲染事件
    // 注意：事件名称可能需要根据实际酒馆版本调整
    const events = [
      'CHARACTER_MESSAGE_RENDERED',
      'USER_MESSAGE_RENDERED',
      'message_rendered'
    ];
    
    events.forEach(eventName => {
      document.addEventListener(eventName, handleMessageRendered);
    });
    
    // 使用 MutationObserver 作为后备方案
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.classList && 
              (node.classList.contains('mes') || node.querySelector('.mes_text'))) {
            processMessage(node);
          }
        });
      });
    });
    
    const chatContainer = document.querySelector('#chat') || document.body;
    observer.observe(chatContainer, {
      childList: true,
      subtree: true
    });
    
    console.log('[文言字典] 消息监听已注册');
  }
  
  function handleMessageRendered(event) {
    const messageElement = event.detail?.messageElement || event.target;
    if (messageElement) {
      processMessage(messageElement);
    }
  }
  
  // ==================== 消息处理 ====================
  function processMessage(messageElement) {
    if (!scanRegex || !dictionary) return;
    
    // 查找消息文本容器
    const textContainer = messageElement.querySelector('.mes_text') || 
                         messageElement.querySelector('[class*="message"]') ||
                         messageElement;
    
    if (!textContainer) return;
    
    // 避免重复处理
    if (textContainer.dataset.dictProcessed === 'true') return;
    
    // 递归处理所有文本节点
    processTextNodes(textContainer);
    
    // 标记为已处理
    textContainer.dataset.dictProcessed = 'true';
  }
  
  function processTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text || !scanRegex.test(text)) return;
      
      // 重置正则
      scanRegex.lastIndex = 0;
      
      // 替换文本节点
      const span = document.createElement('span');
      span.innerHTML = text.replace(scanRegex, (match) => {
        return `<span class="dict-char" data-char="${match}" title="点击查看释义">${match}</span>`;
      });
      
      node.parentNode.replaceChild(span, node);
      
    } else if (node.nodeType === Node.ELEMENT_NODE && 
               !node.classList.contains('dict-char')) {
      // 递归处理子节点，但跳过已标记的字符
      Array.from(node.childNodes).forEach(child => processTextNodes(child));
    }
  }
  
  // ==================== 弹窗UI ====================
  function showDictPopup(char, clickEvent) {
    const data = dictionary[char];
    if (!data) return;
    
    // 移除旧弹窗
    const oldPopup = document.getElementById('dict-popup');
    if (oldPopup) oldPopup.remove();
    
    // 创建弹窗
    const popup = document.createElement('div');
    popup.id = 'dict-popup';
    popup.className = 'dict-popup';
    
    // 构建内容
    let content = `
      <div class="dict-popup-header">
        <span class="dict-popup-char">${char}</span>
        <button class="dict-popup-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="dict-popup-body">
    `;
    
    if (data.original) {
      content += `<div class="dict-row"><span class="dict-label">对应:</span><span class="dict-value">${data.original}</span></div>`;
    }
    
    content += `
      <div class="dict-row"><span class="dict-label">释义:</span><span class="dict-value">${data.meaning}</span></div>
    `;
    
    if (data.note) {
      content += `<div class="dict-row"><span class="dict-label">说明:</span><span class="dict-value">${data.note}</span></div>`;
    }
    
    if (data.examples) {
      content += `<div class="dict-row"><span class="dict-label">例词:</span><span class="dict-value">${data.examples}</span></div>`;
    }
    
    content += `</div>`;
    popup.innerHTML = content;
    
    // 定位弹窗
    document.body.appendChild(popup);
    
    const rect = clickEvent.target.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - (popupRect.width / 2);
    let top = rect.bottom + 8;
    
    // 边界检测
    if (left < 10) left = 10;
    if (left + popupRect.width > window.innerWidth - 10) {
      left = window.innerWidth - popupRect.width - 10;
    }
    if (top + popupRect.height > window.innerHeight - 10) {
      top = rect.top - popupRect.height - 8;
    }
    
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    
    // 点击外部关闭
    setTimeout(() => {
      document.addEventListener('click', function closePopup(e) {
        if (!popup.contains(e.target)) {
          popup.remove();
          document.removeEventListener('click', closePopup);
        }
      });
    }, 0);
  }
  
  // ==================== 事件代理 ====================
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('dict-char')) {
      e.preventDefault();
      e.stopPropagation();
      const char = e.target.dataset.char;
      showDictPopup(char, e);
    }
  });
  
  // ==================== 样式注入 ====================
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* 字典字符样式 */
      .dict-char {
        background-color: ${CONFIG.highlightColor};
        padding: 0 2px;
        border-radius: 2px;
        cursor: help;
        transition: background-color 0.2s;
        border-bottom: 1px dashed #4a90e2;
      }
      
      .dict-char:hover {
        background-color: ${CONFIG.highlightHoverColor};
      }
      
      /* 弹窗容器 */
      .dict-popup {
        position: fixed;
        min-width: 280px;
        max-width: 400px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: ${CONFIG.popupZIndex};
        font-family: 'Microsoft YaHei', '微软雅黑', sans-serif;
        animation: dict-popup-fadein 0.2s ease;
      }
      
      @keyframes dict-popup-fadein {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* 弹窗头部 */
      .dict-popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 8px 8px 0 0;
        color: white;
      }
      
      .dict-popup-char {
        font-size: 24px;
        font-weight: bold;
      }
      
      .dict-popup-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background 0.2s;
      }
      
      .dict-popup-close:hover {
        background: rgba(255,255,255,0.2);
      }
      
      /* 弹窗主体 */
      .dict-popup-body {
        padding: 12px 16px;
      }
      
      .dict-row {
        margin-bottom: 8px;
        line-height: 1.6;
      }
      
      .dict-row:last-child {
        margin-bottom: 0;
      }
      
      .dict-label {
        display: inline-block;
        min-width: 50px;
        font-weight: 600;
        color: #666;
      }
      
      .dict-value {
        color: #333;
      }
      
      /* 暗色主题适配 */
      body.theme-dark .dict-popup {
        background: #2d2d2d;
        border-color: #444;
        color: #e0e0e0;
      }
      
      body.theme-dark .dict-label {
        color: #aaa;
      }
      
      body.theme-dark .dict-value {
        color: #e0e0e0;
      }
    `;
    document.head.appendChild(style);
  }
  
  // ==================== 启动 ====================
  // 等待DOM加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // 暴露全局接口（便于调试）
  window.WenYanDict = {
    version: '1.0.0',
    reload: initialize,
    getDictionary: () => dictionary,
    getConfig: () => CONFIG
  };
  
})();
