export default function Header() {
  return (
    <header className="relative overflow-hidden select-none" style={{
      background: 'linear-gradient(135deg, #0D0F2A 0%, #1C1042 45%, #0F1635 100%)',
    }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #CEB4F8 0%, transparent 65%)' }} />
        <div className="absolute -top-16 right-1/3 w-72 h-72 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #F4C161 0%, transparent 65%)' }} />
        <div className="absolute top-0 -right-16 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #7ECBE8 0%, transparent 65%)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-14 text-center">
        {/* Crystal ornament */}
        <div className="text-5xl mb-4 opacity-90" style={{ color: '#CEB4F8' }}>✦</div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-3" style={{
          background: 'linear-gradient(135deg, #CEB4F8 0%, #F4C161 50%, #7ECBE8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          艾欧泽亚导航
        </h1>

        <p className="text-sm md:text-base font-medium tracking-[0.25em] uppercase"
          style={{ color: '#9B95B0' }}>
          Final Fantasy XIV · 工具导航站
        </p>
      </div>
    </header>
  )
}
