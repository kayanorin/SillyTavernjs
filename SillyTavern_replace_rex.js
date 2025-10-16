// 脚本代码
(async () => {
  try {
    // 加载字典
    const DICT_URL = 'https://cdn.jsdelivr.net/gh/kayanorin/SillyTavernjs@main/replace_dict.json';
    toastr.info('正在加载替换字典...');
    
    const response = await fetch(DICT_URL);
    if (!response.ok) throw new Error(`加载失败: ${response.status}`);
    
    const replaceDict = await response.json();
    const pairCount = Object.keys(replaceDict).length;
    toastr.success(`字典加载成功，共 ${pairCount} 对规则`);
    
    // 获取所有消息
    const lastMessageId = getLastMessageId();
    const allMessages = getChatMessages(`0-${lastMessageId}`);
    
    let totalReplacements = 0;
    let affectedMessages = 0;
    
    // 对每条消息应用替换
    const updatedMessages = allMessages.map((msg, index) => {
      let newMessage = msg.message;
      let messageChanged = false;
      
      // 应用字典中的所有替换规则
      for (const [oldText, newText] of Object.entries(replaceDict)) {
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
        
        // 根据消息来源确定 source 参数
        const source = msg.is_user ? 'user_input' : 'ai_output';
        
        // 同时应用 display 和 prompt 两个目标
        // 先应用现有的酒馆正则，再应用我们的替换
        const displayText = formatAsTavernRegexedString(
          newMessage, 
          source, 
          'display', 
          { depth: index }
        );
        
        const promptText = formatAsTavernRegexedString(
          newMessage, 
          source, 
          'prompt', 
          { depth: index }
        );
        
        return {
          message_id: msg.message_id,
          message: newMessage,  // 更新原始消息
          // 注意：这里可能需要更新其他字段来确保显示生效
        };
      }
      
      return null;
    }).filter(msg => msg !== null);
    
    // 批量更新消息
    if (updatedMessages.length > 0) {
      await setChatMessages(updatedMessages, { refresh: 'all' });
      
      toastr.success(
        `替换完成!\n影响消息: ${affectedMessages} 条\n替换次数: ${totalReplacements} 次`,
        '批量替换',
        { timeOut: 5000 }
      );
    } else {
      toastr.info('未发现需要替换的内容');
    }
    
  } catch (error) {
    console.error('批量替换失败:', error);
    toastr.error(`执行失败: ${error.message}`);
  }
})();
