export function PricingSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">选择适合您的方案</h2>
          <p className="text-lg text-muted-foreground">灵活的定价，满足不同需求</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {['基础版', '标准版', '专业版'].map((plan, i) => (
            <div key={plan} className="bg-background p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold mb-2">{plan}</h3>
              <div className="text-3xl font-bold mb-4">
                ${[9, 19, 34][i]}.99<span className="text-lg text-muted-foreground">/月</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li>• 功能描述 1</li>
                <li>• 功能描述 2</li>
                <li>• 功能描述 3</li>
              </ul>
              <button className="w-full bg-primary text-primary-foreground py-2 rounded">
                选择方案
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}