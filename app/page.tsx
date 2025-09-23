// 采用静态首页 + 客户端重定向，避免 Edge 运行时报错导致 500。
// 根据浏览器语言在客户端跳转到 /zh 或 /en，服务端保持静态可部署。

export default function RootRedirectPage() {
  const script = `(() => {
    try {
      const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      const dest = lang.includes('zh') ? '/zh/' : '/en/';
      if (location.pathname === '/' || location.pathname === '') {
        location.replace(dest);
      }
    } catch (_) {
      location.replace('/en/');
    }
  })();`;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Cultural Companion</h1>
        <p>Loading...</p>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #dc2626',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '20px auto'
        }}></div>
      </div>

      <noscript>
        <meta httpEquiv="refresh" content="0; url=/en/" />
      </noscript>

      <script dangerouslySetInnerHTML={{ __html: script }} />

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  )
}
