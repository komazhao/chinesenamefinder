import OpenAI from 'openai'

// 起名请求接口
export interface NameRequest {
  englishName: string
  gender: 'male' | 'female' | 'neutral'
  style: 'traditional' | 'modern' | 'elegant' | 'nature' | 'literary'
  preferences?: {
    avoidWords?: string[]
    preferredElements?: string[]
    meaningFocus?: string
  }
}

// 起名结果接口
export interface NameResult {
  chinese: string
  pinyin: string
  meaning: string
  culturalBackground?: string
  pronunciationTips?: string
  qualityScore?: number
}

// 生成结果接口
export interface GenerationResult {
  names: NameResult[]
  totalCost: number
  generationTime: number
  requestId: string
}

// 成本追踪接口
interface CostTracker {
  dailySpent: number
  monthlySpent: number
  requestCount: number
  lastReset: string
}

export class NameGenerator {
  private openai: OpenAI
  private readonly DAILY_BUDGET = 80 // $80/天
  private readonly MONTHLY_BUDGET = 2400 // $2400/月
  private readonly COST_PER_REQUEST = 0.05 // 预估每次请求成本
  private costTracker: Map<string, CostTracker> = new Map()

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required')
    }

    this.openai = new OpenAI({
      apiKey,
      timeout: 30000, // 30秒超时
    })
  }

  /**
   * 生成中文名字
   */
  async generateNames(request: NameRequest, userId?: string): Promise<GenerationResult> {
    const startTime = Date.now()
    const requestId = this.generateRequestId()

    try {
      // 1. 预算检查
      await this.checkBudget(userId)

      // 2. 验证请求参数
      this.validateRequest(request)

      // 3. 构建AI提示词
      const prompt = this.buildNamingPrompt(request)
      const systemPrompt = this.getSystemPrompt()

      // 4. 调用OpenAI API
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9,
      })

      // 5. 解析结果
      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('Empty response from OpenAI')
      }

      const parsedResult = this.parseAIResponse(content)
      const enhancedNames = await this.enhanceResults(parsedResult.names, request)

      // 6. 记录成本
      const totalCost = this.calculateCost(response.usage)
      await this.trackCost(totalCost, userId)

      const generationTime = Date.now() - startTime

      return {
        names: enhancedNames,
        totalCost,
        generationTime,
        requestId
      }

    } catch (error) {
      console.error('Name generation failed:', error)

      // 降级到备用方案
      if (error instanceof Error && error.message.includes('budget')) {
        throw error
      }

      return this.fallbackGeneration(request, requestId, Date.now() - startTime)
    }
  }

  /**
   * 批量生成名字（企业版功能）
   */
  async batchGenerateNames(
    requests: NameRequest[],
    userId?: string
  ): Promise<GenerationResult[]> {
    const results: GenerationResult[] = []

    for (let i = 0; i < requests.length; i++) {
      try {
        const result = await this.generateNames(requests[i], userId)
        results.push(result)

        // 批量处理时添加延迟，避免API限流
        if (i < requests.length - 1) {
          await this.delay(1000) // 1秒延迟
        }
      } catch (error) {
        console.error(`Batch generation failed for request ${i}:`, error)
        // 继续处理下一个请求
      }
    }

    return results
  }

  /**
   * 获取成本统计
   */
  async getCostStats(userId?: string): Promise<{
    dailySpent: number
    monthlySpent: number
    dailyRemaining: number
    monthlyRemaining: number
    requestCount: number
  }> {
    const today = new Date().toISOString().split('T')[0]
    const month = today.substring(0, 7)
    const key = userId ? `${userId}-${today}` : today

    const dailyStats = this.costTracker.get(key) || {
      dailySpent: 0,
      monthlySpent: 0,
      requestCount: 0,
      lastReset: today
    }

    return {
      dailySpent: dailyStats.dailySpent,
      monthlySpent: dailyStats.monthlySpent,
      dailyRemaining: Math.max(0, this.DAILY_BUDGET - dailyStats.dailySpent),
      monthlyRemaining: Math.max(0, this.MONTHLY_BUDGET - dailyStats.monthlySpent),
      requestCount: dailyStats.requestCount
    }
  }

  /**
   * 预算检查
   */
  private async checkBudget(userId?: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0]
    const key = userId ? `${userId}-${today}` : today

    const stats = this.costTracker.get(key) || {
      dailySpent: 0,
      monthlySpent: 0,
      requestCount: 0,
      lastReset: today
    }

    if (stats.dailySpent >= this.DAILY_BUDGET) {
      throw new Error('今日AI预算已用完，请明天再试')
    }

    if (stats.monthlySpent >= this.MONTHLY_BUDGET) {
      throw new Error('本月AI预算已用完，请下月再试')
    }
  }

  /**
   * 记录成本
   */
  private async trackCost(cost: number, userId?: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0]
    const key = userId ? `${userId}-${today}` : today

    const current = this.costTracker.get(key) || {
      dailySpent: 0,
      monthlySpent: 0,
      requestCount: 0,
      lastReset: today
    }

    current.dailySpent += cost
    current.monthlySpent += cost
    current.requestCount += 1

    this.costTracker.set(key, current)

    // 持久化到数据库（可选实现）
    // await this.saveCostToDB(userId, cost)
  }

  /**
   * 构建命名提示词
   */
  private buildNamingPrompt(request: NameRequest): string {
    const genderText = request.gender === 'male' ? '男性' :
                      request.gender === 'female' ? '女性' : '中性'

    const styleDescriptions = {
      traditional: '传统古典，体现中华文化底蕴，可参考古籍经典',
      modern: '现代时尚，简洁易记，适合当代生活',
      elegant: '优雅高贵，寓意美好，音韵和谐',
      nature: '贴近自然，如山水花鸟，体现自然之美',
      literary: '富有诗意，可引用诗词典故，文学色彩浓厚'
    }

    let prompt = `为英文名"${request.englishName}"生成3个适合${genderText}的中文名字。

要求：
1. 风格：${styleDescriptions[request.style]}
2. 考虑音译和意译结合，确保音韵和谐
3. 每个名字都要有深刻的文化内涵和美好寓意
4. 避免生僻字，确保易读易写`

    if (request.preferences) {
      if (request.preferences.avoidWords?.length) {
        prompt += `\n5. 避免使用这些字词：${request.preferences.avoidWords.join(', ')}`
      }

      if (request.preferences.preferredElements?.length) {
        prompt += `\n6. 尽量包含这些元素：${request.preferences.preferredElements.join(', ')}`
      }

      if (request.preferences.meaningFocus) {
        prompt += `\n7. 重点体现：${request.preferences.meaningFocus}`
      }
    }

    prompt += `\n\n请返回JSON格式：
{
  "names": [
    {
      "chinese": "中文名字",
      "pinyin": "zhong wen ming zi",
      "meaning": "详细解释名字的含义和文化背景",
      "pronunciationTips": "发音要点和注意事项"
    }
  ]
}`

    return prompt
  }

  /**
   * 获取系统提示词
   */
  private getSystemPrompt(): string {
    return `你是一位专业的中文命名专家，精通中国传统文化、诗词典故、五行理论和现代命名趋势。

专业能力：
1. 深度理解中华文化内涵，能将英文名的音韵特点与中文字符巧妙结合
2. 精通古典诗词，能引用经典文学作品为名字增添文化底蕴
3. 了解现代社会的命名趋势和审美偏好
4. 能为不同性别、不同风格偏好提供个性化建议

命名原则：
- 音韵和谐：注重声调搭配和读音流畅
- 寓意美好：每个字都有积极正面的含义
- 文化适宜：符合中国传统文化价值观
- 易读易记：避免生僻字，确保实用性
- 个性化：根据用户需求提供独特建议

请始终以专业、准确、富有创意的态度完成命名任务。`
  }

  /**
   * 解析AI响应
   */
  private parseAIResponse(content: string): { names: NameResult[] } {
    try {
      const parsed = JSON.parse(content)

      if (!parsed.names || !Array.isArray(parsed.names)) {
        throw new Error('Invalid response format')
      }

      return {
        names: parsed.names.map((name: any) => ({
          chinese: name.chinese || '',
          pinyin: name.pinyin || '',
          meaning: name.meaning || '',
          pronunciationTips: name.pronunciationTips || '',
          qualityScore: this.calculateQualityScore(name)
        }))
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error)
      throw new Error('AI返回的数据格式错误')
    }
  }

  /**
   * 增强结果（添加额外信息）
   */
  private async enhanceResults(
    names: NameResult[],
    request: NameRequest
  ): Promise<NameResult[]> {
    return names.map(name => ({
      ...name,
      culturalBackground: this.generateCulturalBackground(name, request),
      qualityScore: this.calculateQualityScore(name)
    }))
  }

  /**
   * 生成文化背景介绍
   */
  private generateCulturalBackground(name: NameResult, request: NameRequest): string {
    // 这里可以扩展更复杂的文化背景生成逻辑
    const styleContext = {
      traditional: '体现了中华传统文化的深厚底蕴',
      modern: '融合了现代审美与传统智慧',
      elegant: '展现了优雅高贵的文化气质',
      nature: '体现了中国人对自然的深度理解和崇敬',
      literary: '承载着深厚的文学传统和诗意美感'
    }

    return `这个名字${styleContext[request.style]}，适合${request.gender === 'male' ? '男性' : request.gender === 'female' ? '女性' : ''}使用。`
  }

  /**
   * 计算名字质量分数
   */
  private calculateQualityScore(name: NameResult): number {
    let score = 60 // 基础分

    // 音韵评分
    if (name.pinyin && name.pinyin.length > 0) {
      score += 15
    }

    // 含义评分
    if (name.meaning && name.meaning.length > 10) {
      score += 15
    }

    // 文化内涵评分
    if (name.meaning && (
      name.meaning.includes('典故') ||
      name.meaning.includes('诗词') ||
      name.meaning.includes('经典')
    )) {
      score += 10
    }

    return Math.min(100, score)
  }

  /**
   * 降级生成方案
   */
  private async fallbackGeneration(
    request: NameRequest,
    requestId: string,
    generationTime: number
  ): Promise<GenerationResult> {
    // 简单的备用名字生成逻辑
    const fallbackNames: NameResult[] = [
      {
        chinese: '文华',
        pinyin: 'wén huá',
        meaning: '文采华丽，寓意才华横溢，文化修养深厚',
        culturalBackground: '体现了中华文化对文学才华的重视',
        qualityScore: 75
      },
      {
        chinese: '嘉慧',
        pinyin: 'jiā huì',
        meaning: '嘉美智慧，寓意品德高尚，聪明睿智',
        culturalBackground: '体现了中华文化对品德智慧的推崇',
        qualityScore: 78
      },
      {
        chinese: '志远',
        pinyin: 'zhì yuǎn',
        meaning: '志向远大，寓意胸怀宽广，目标远大',
        culturalBackground: '体现了中华文化对远大抱负的赞美',
        qualityScore: 80
      }
    ]

    return {
      names: fallbackNames.slice(0, 3),
      totalCost: 0,
      generationTime,
      requestId
    }
  }

  /**
   * 验证请求参数
   */
  private validateRequest(request: NameRequest): void {
    if (!request.englishName || request.englishName.trim().length === 0) {
      throw new Error('英文名不能为空')
    }

    if (request.englishName.length > 50) {
      throw new Error('英文名长度不能超过50个字符')
    }

    const validGenders = ['male', 'female', 'neutral']
    if (!validGenders.includes(request.gender)) {
      throw new Error('无效的性别选择')
    }

    const validStyles = ['traditional', 'modern', 'elegant', 'nature', 'literary']
    if (!validStyles.includes(request.style)) {
      throw new Error('无效的风格选择')
    }
  }

  /**
   * 计算API调用成本
   */
  private calculateCost(usage: any): number {
    if (!usage) return this.COST_PER_REQUEST

    // 基于实际token消耗计算成本
    const inputTokens = usage.prompt_tokens || 0
    const outputTokens = usage.completion_tokens || 0

    // GPT-4-turbo定价：输入$0.01/1K tokens，输出$0.03/1K tokens
    const cost = (inputTokens * 0.01 + outputTokens * 0.03) / 1000

    return Math.max(cost, 0.01) // 最低成本$0.01
  }

  /**
   * 生成请求ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}