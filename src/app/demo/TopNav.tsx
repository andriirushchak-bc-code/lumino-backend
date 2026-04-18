'use client';

const NAV_LINKS = ['Expenses', 'Policies', 'Import', 'Settings'] as const;

export default function TopNav() {
  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        {/* Left: logo + nav links */}
        <div style={s.left}>
          {/* Logo mark: concentric circles */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="10" cy="10" r="9" stroke="#378ADD" strokeWidth="2" fill="none" />
            <circle cx="10" cy="10" r="3" fill="#378ADD" />
          </svg>
          <span style={s.wordmark}>Lumino</span>
          <div style={s.divider} />
          {NAV_LINKS.map((label) => {
            const active = label === 'Expenses';
            return (
              <span key={label} style={active ? s.navLinkActive : s.navLink}>
                {label}
              </span>
            );
          })}
        </div>

        {/* Right: user info */}
        <div style={s.right}>
          <span style={s.userName}>Andrii Bondar</span>
          <div style={s.avatar}>AB</div>
        </div>
      </div>
    </nav>
  );
}

const s: Record<string, React.CSSProperties> = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
    background: '#FFFFFF',
    borderBottom: '0.5px solid rgba(0,0,0,0.1)',
    height: 56,
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    boxSizing: 'border-box',
  },
  inner: {
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  wordmark: {
    fontSize: 15,
    fontWeight: 500,
    letterSpacing: '-0.2px',
    color: '#0D0D0D',
  },
  divider: {
    width: '0.5px',
    height: 16,
    background: 'rgba(0,0,0,0.15)',
    margin: '0 4px',
  },
  navLink: {
    fontSize: 13,
    color: '#8C8C8C',
    cursor: 'default',
    paddingBottom: 2,
  },
  navLinkActive: {
    fontSize: 13,
    color: '#378ADD',
    fontWeight: 500,
    paddingBottom: 2,
    borderBottom: '2px solid #378ADD',
    cursor: 'default',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  userName: {
    fontSize: 13,
    color: '#8C8C8C',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: '#E6F1FB',
    color: '#0C447C',
    fontSize: 11,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    letterSpacing: '0.3px',
  },
};
