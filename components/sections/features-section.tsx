export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            专业功能特色
          </h2>
          <p className="text-lg text-muted-foreground">
            融合传统文化与现代AI技术的强大功能
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* 功能卡片占位符 */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">功能 {i}</h3>
              <p className="text-muted-foreground">功能描述...</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}