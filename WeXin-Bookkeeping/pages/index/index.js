// pages/index/stats.js
Page({
  data: {
    showTan: false, // 控制菜单显示
    activeType: 'expense', // 存储当前选中的按钮类型
    amount: '',
    money_type: '餐饮',
    notes: false,
    charCount: 0,
    content: '',
    records: [],
    editIndex: null,
    typeOptions: ['餐饮', '交通', '购物', '娱乐', '其他'], // 消费类型选项
    date: '',
  },
  // 跳转到主页
  goToHome: function () {
    wx.navigateTo({
      url: '/pages/index/index' // 确保路径是正确的
    });
  },

  // 再次跳转到统计页面
  goToStats: function () {
    wx.navigateTo({
      url: '/pages/index/stats' // 确保路径是正确的
    });
  },

  // 显示菜单
  showTan: function () {
    this.setData({
      showTan: true
    });
  },

  // 隐藏菜单
  hideTan: function () {
    this.setData({
      showTan: false
    });
  },

  addnotes: function () {
    this.setData({
      showTan: false,
      notes: true
    })
  },

  hidenotes: function () {
    this.setData({
      showTan: true,
      notes: false,
    })
  },

  setActiveType(e) {
    const type = e.currentTarget.dataset.type; // 获取按钮的类型
    this.setData({
      activeType: type
    });
  },

  onInput(e) {
    this.setData({
      amount: e.detail.value
    });
    console.log("当前金额:", e.detail.value);
  },

  updateCharCount: function (e) {
    const inputValue = e.detail.value;
    this.setData({
      content: inputValue,
      charCount: inputValue.length
    });
  },

  addRecord() {
    const {
      activeType,
      amount,
      content,
      records,
      money_type,
      date,
    } = this.data;

    if (!amount) {
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      });
      return;
    }
    const newRecord = {
      type: activeType,
      amount: parseFloat(amount),
      content: content || '无备注',
      money_type,
      date,
    };

    const updatedRecords = [...records, newRecord];
    updatedRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

    wx.setStorageSync('records', updatedRecords); // 使用同步存储

    this.setData({
      records: updatedRecords,
      showTan: false,
      notes: false,
      amount: '',
      content: '',
      charCount: 0,
      money_type: '餐饮', // 重置消费类型
      date: '',
    });

    wx.showToast({
      title: '记录添加成功',
      icon: 'success'
    });
  },
  
  deleteRecord(e) {
    const index = e.currentTarget.dataset.index; // 获取当前记录的索引
    const {
      records
    } = this.data;

    // 提示用户确认删除
    wx.showModal({
      title: '确认删除',
      content: '确定要删除此记录吗？',
      success: (res) => {
        if (res.confirm) {
          records.splice(index, 1); // 删除对应索引的记录
          wx.setStorageSync('records', records); // 更新存储
          this.setData({
            records
          }); // 更新记录列表
          wx.showToast({
            title: '记录已删除',
            icon: 'none'
          }); // 提示用户
        }
      }
    });
  },

  // 点击修改按钮时触发
  editRecord(e) {
    const index = e.currentTarget.dataset.index; // 获取当前记录的索引
    const record = this.data.records[index]; // 获取要修改的记录

    this.setData({
      amount: record.amount.toString(), // 将金额加载到输入框
      content: record.content, // 将备注加载到输入框
      activeType: record.type, // 设置当前类型
      showTan: true, // 打开弹窗
      editIndex: index, // 记录当前编辑的索引
      money_type: record.money_type,
    });
  },


  // 记录消费类型选择
  onTypeChange(e) {
    const index = e.detail.value;
    this.setData({
      money_type: this.data.typeOptions[index]
    });
  },
  onCancelWrite(e) {
    this.setData({
      showTan: false,
    })
  },

  onDateChange(e) {
    this.setData({
      date: e.detail.value // 更新选择的日期
    });
  },

  onLoad: function () {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
  
    const storedRecords = wx.getStorageSync('records') || [];
  
    this.setData({
      date: `${year}-${month}-${day}`,
      records: storedRecords
    });
  },
  
  
});