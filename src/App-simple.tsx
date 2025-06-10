import React from 'react';

function AppSimple() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>测试页面</h1>
      <p>如果您能看到这个页面，说明React应用运行正常。</p>
      <p>当前时间: {new Date().toLocaleString()}</p>
      <button onClick={() => alert('按钮工作正常!')}>
        点击测试
      </button>
    </div>
  );
}

export default AppSimple; 