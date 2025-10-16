(function() {
    'use strict';
    
    // 使用立即执行函数确保变量立即可用
    window.VARIANT_DICT = {
        "王男": { original: "皇男", explanation: "母亲是皇帝或亲王的皇室男性" },
        "㻸郎": { original: "㻸郎", explanation: "㻸zēn，母亲是郡王的皇室男性" },
        "慊弃": { original: "嫌弃", explanation: "厌恶而不愿接近" },
        "忮愱": { original: "嫉妒", explanation: "因别人比自己好而憎恨" },
        "忮忌": { original: "嫉妒", explanation: "嫉妒忌恨" },
        "倒楣": { original: "倒霉", explanation: "遭遇不顺利" },
        "秽气": { original: "晦气", explanation: "不吉利、运气不好" },
        "贪惏": { original: "贪婪", explanation: "贪得无厌" },
        "虜隶": { original: "奴隶", explanation: "被奴役的人" },
        "虏隶": { original: "奴隶", explanation: "被奴役的人" },
        "母父": { original: "父母", explanation: "双亲的总称。" },
        "妻夫": { original: "夫妻", explanation: "合法婚姻关系。" },
        "女男": { original: "男女", explanation: "女人和男人的统称。" },
        "姊妹兄弟": { original: "兄弟姐妹", explanation: "姐妹和兄弟的合称。" },
        "男儿": { original: "儿子", explanation: "所生的男性孩子。" },
        "师傅": { original: "师父", explanation: "对老师或有专门技艺的人的尊称。" },
        "天姥姥": { original: "老天爷", explanation: "对“天”的俗称，也指命运或天意。" },
        "祅": { original: "妖", explanation: "怪异反常之事。" },
        "谀臣": { original: "佞臣", explanation: "指奸邪谄媚的臣子。" },
        "谀幸": { original: "佞幸", explanation: "因善于谄媚而获得君主的宠幸。" },
        "㤃碍": { original: "妨碍", explanation: "干扰、阻碍，使事情不能顺利进行。" },
        "虏隶": { original: "奴隶", explanation: "被压迫、被奴役、完全失去人身自由的人。" },
        "歼": { original: "奸", explanation: "阴险、虚伪、狡诈。" },
        "罔": { original: "妄", explanation: "不真实，不合理。" },
        "疾恶如仇": { original: "嫉恶如仇", explanation: "指对坏人坏事如同对仇敌一样憎恨。" },
        "愱贤忌能": { original: "嫉贤妒能", explanation: "对品德、才能比自己强的人心怀嫉妒。" },
        "伎": { original: "妓", explanation: "指以歌舞卖艺为业的人，也指从事卖淫的人。" },
        "倡": { original: "娼", explanation: "指以歌舞卖艺为业的人，也指从事卖淫的人。" },
        "闝": { original: "嫖", explanation: "指到倡馆寻欢作乐的非法行为。" }
}
    };
    
    // 触发自定义事件通知加载完成
    window.dispatchEvent(new CustomEvent('variantDictLoaded', {
        detail: { count: Object.keys(window.VARIANT_DICT).length }
    }));
    
    console.log('[VariantDict] 字典已加载，共', Object.keys(window.VARIANT_DICT).length, '个词条');
})();
