// dictionary.js - 字典数据文件
// 托管地址示例: https://cdn.jsdelivr.net/gh/username/repo@main/dictionary.js

window.CharDictionary = {
  // 元数据
  _version: "1.0.0",
  _updateTime: "2025-10-16",
  _description: "替换字典",
  
  // 字符数据
  "惏": {
    original: "婪",
    meaning: "贪婪、贪得无厌之意",
    note: "古汉语用法，通'婪'",
    enableReplace: true,
    examples: "贪惏无厌、惏心不足"
  },
  
  "忮忌": {
    original: "嫉妒",
    meaning: "因人胜过自己而产生的忌恨心理",
    note: "繁体古字形式",
    enableReplace: true,
    examples: "眞理、眞诚"
  },
  
  "說": {
    original: "说",
    meaning: "陈述、解释、言论",
    note: "繁体字",
    enableReplace: true,
    examples: "說明、遊說"
  },
  
  "虏": {
    original: "奴",
    meaning: "没有人身自由的人",
    note: "繁体古字",
    enableReplace: true,
    examples: "虏隶"
  },
  
  "觀": {
    original: "观",
    meaning: "看、观察、景象",
    note: "繁体字",
    enableReplace: true,
    examples: "觀察、世界觀"
  },
  
  "學": {
    original: "学",
    meaning: "学习、学问",
    note: "繁体字",
    enableReplace: true,
    examples: "學習、學問"
  },
  
  "氣": {
    original: "气",
    meaning: "气息、气质、气势",
    note: "繁体字",
    enableReplace: true,
    examples: "氣質、勇氣"
  },
  
  "聽": {
    original: "听",
    meaning: "听从、倾听",
    note: "繁体字",
    enableReplace: true,
    examples: "聽從、聆聽"
  },
  
  // 仅显示字典，不自动替换的示例
  "兮": {
    original: null,  // 无对应简化字
    meaning: "文言语气词",
    note: "用于句中或句末，表示感叹、停顿",
    enableReplace: false,
    examples: "路漫漫其修远兮"
  },
  
  "謂": {
    original: "谓",
    meaning: "称为、叫做、认为",
    note: "繁体字，常见于古文",
    enableReplace: false,  // 设为false表示不主动替换
    examples: "所謂、謂之"
  }
};

// 导出标志
window.CharDictionary._loaded = true;
console.log(`[字典] 已加载 v${window.CharDictionary._version}，共 ${Object.keys(window.CharDictionary).filter(k => !k.startsWith('_')).length} 个字符`);
