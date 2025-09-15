export function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">用户心声</h2>
          <p className="text-lg text-muted-foreground">来自全球用户的真实反馈</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted/30 p-6 rounded-lg">
              <p className="mb-4">"非常棒的起名体验！"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/20 rounded-full mr-3" />
                <div>
                  <div className="font-medium">用户 {i}</div>
                  <div className="text-sm text-muted-foreground">来自美国</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}