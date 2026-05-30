import { useState } from 'react'

const STORAGE_KEY = 'ff14navi-tools-unlocked'

export default function ToolsGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => !!localStorage.getItem(STORAGE_KEY))
  const [showModal, setShowModal] = useState(false)

  if (unlocked) return <>{children}</>

  const handleConfirm = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setUnlocked(true)
    setShowModal(false)
  }

  return (
    <>
      {/* Locked placeholder */}
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="text-5xl mb-5 select-none">🔒</div>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--md-on-surface)' }}>
          外挂相关内容已折叠
        </h3>
        <p className="text-sm mb-6 max-w-sm leading-relaxed" style={{ color: 'var(--md-on-surface-variant)' }}>
          此栏目收录第三方工具与外挂相关链接，点击下方按钮展开前请阅读风险说明。
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="px-7 py-3 rounded-full font-bold text-sm"
          style={{
            background: 'var(--md-primary)',
            color: 'var(--md-on-primary)',
            transition: 'filter 0.18s',
          }}
          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
          onMouseLeave={e => e.currentTarget.style.filter = ''}
        >
          展开查看
        </button>
      </div>

      {/* Disclaimer modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div
            className="w-full max-w-md rounded-3xl p-6 shadow-2xl animate-slide-up"
            style={{ background: 'var(--md-surface-container-highest)' }}
          >
            <div className="text-4xl text-center mb-3 select-none">⚠️</div>
            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: 'var(--md-on-surface)' }}>
              使用须知
            </h2>
            <p
              className="text-sm leading-relaxed rounded-2xl p-4 mb-6"
              style={{
                color: 'var(--md-on-surface-variant)',
                background: 'var(--md-surface-container)',
                borderLeft: '4px solid var(--md-tertiary)',
              }}
            >
              本站仅作为收录与指引功能，因使用外部程序导致违反相关游戏规定而可能产生的风险，由使用者自负，本站及运营人员对此概不负责。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-full text-sm font-medium"
                style={{ background: 'var(--md-surface-container-high)', color: 'var(--md-on-surface-variant)' }}
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2.5 rounded-full text-sm font-bold"
                style={{ background: 'var(--md-primary)', color: 'var(--md-on-primary)' }}
              >
                我已了解，继续查看
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
