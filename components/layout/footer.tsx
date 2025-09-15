export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">文化伴侣</h3>
            <p className="text-muted-foreground mb-4">
              专业的AI中文起名服务平台
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">产品</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>AI起名</li>
              <li>五行命名</li>
              <li>诗意命名</li>
              <li>企业服务</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">支持</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>帮助中心</li>
              <li>联系我们</li>
              <li>定价方案</li>
              <li>API文档</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">关于</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>关于我们</li>
              <li>隐私政策</li>
              <li>服务条款</li>
              <li>博客</li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 mt-8 text-center text-muted-foreground">
          <p>&copy; 2024 文化伴侣. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  )
}