const rawStage = (process.env.APP_STAGE || process.env.CF_PAGES_BRANCH || process.env.NODE_ENV || 'development').toLowerCase()

const knownStages = new Set(['production', 'preview', 'development', 'local', 'test'])
const appStage = knownStages.has(rawStage) ? rawStage : 'development'

export const isProduction = appStage === 'production'
export const isPreview = appStage === 'preview'
export const isDevelopment = appStage === 'development' || appStage === 'local'
export const isLocal = appStage === 'local'

export const currentStage = appStage
