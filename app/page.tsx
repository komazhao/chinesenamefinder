// 采用静态首页 + 客户端重定向，避免 Edge 运行时报错导致 500。
// 根据浏览器语言在客户端跳转到 /zh 或 /en，服务端保持静态可部署。

export default function RootRedirectPage() {
  const script = `(() => {
    try {
      const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      const dest = lang.includes('zh') ? '/zh' : '/en';
      if (location.pathname !== dest) location.replace(dest);
    } catch (_) {
      location.replace('/en');
    }
  })();`;

  return (
    <div>
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/en" />
      </noscript>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </div>
  )
}
