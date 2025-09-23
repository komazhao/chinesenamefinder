'use client'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>出了点问题</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>服务暂时不可用，请稍后重试。</p>
      {process.env.NODE_ENV !== 'production' && error?.message && (
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 12, borderRadius: 6 }}>
          {error.message}
        </pre>
      )}
      <button
        onClick={() => reset()}
        style={{
          background: '#dc2626',
          color: '#fff',
          border: 'none',
          padding: '8px 14px',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        重试
      </button>
    </div>
  )
}

