// 批量替换脚本 - 从远程字典加载替换对
(async () => {
  try {
    // 字典文件的完整URL
    const DICT_URL = 'https://cdn.jsdelivr.net/gh/kayanorin/SillyTavernjs@main/replace_dict.json';
    
    // 获取字典数据
    toastr.info('正在加载替换字典...');
    const response = await fetch(DICT_URL);
    
    if (!response.ok) {
      throw new Error(`加载字典失败: ${response.status} ${response.statusText}`);
    }
    
    const replaceDict = await response.json();
    
    // 验证字典格式
    if (typeof replaceDict !== 'object' || replaceDict === null) {
      throw new Error('字典格式错误,应为JSON对象');
    }
    
    const pairCount = Object.keys(replaceDict).length;
    toastr.success(`字典加载成功,共 ${pairCount} 对替换规则`);
    
    // 获取所有消息
    const lastMessageId = getLastMessageId();
    const allMessages = getChatMessages(`0-${lastMessageId}`);
    
    let totalReplacements = 0;
    let affectedMessages = 0;
    
    // 对每条消息应用替换
    const updatedMessages = allMessages.map(msg => {
      let newMessage = msg.message;
      let messageChanged = false;
      
      // 应用所有替换规则
      for (const [oldText, newText] of Object.entries(replaceDict)) {
        // 使用全局替换
        const regex = new RegExp(oldText, 'g');
        const matches = (newMessage.match(regex) || []).length;
        
        if (matches > 0) {
          newMessage = newMessage.replace(regex, newText);
          totalReplacements += matches;
          messageChanged = true;
        }
      }
      
      if (messageChanged) {
        affectedMessages++;
        return {
          message_id: msg.message_id,
          message: newMessage
        };
      }
      
      return null;
    }).filter(msg => msg !== null);
    
    // 如果有消息需要更新
    if (updatedMessages.length > 0) {
      // 批量更新消息
      await setChatMessages(updatedMessages, { refresh: 'all' });
      
      toastr.success(
        `替换完成!\n` +
        `影响消息: ${affectedMessages} 条\n` +
        `替换次数: ${totalReplacements} 次`,
        '批量替换',
        { timeOut: 5000 }
      );
    } else {
      toastr.info('未发现需要替换的内容');
    }
    
  } catch (error) {
    console.error('批量替换失败:', error);
    toastr.error(`执行失败: ${error.message}`, '批量替换错误');
  }
})();
