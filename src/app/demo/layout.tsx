export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* Reset root layout constraints for the demo product shell */
        body {
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #F6F5F1 !important;
          color: #0D0D0D !important;
          font-family: Inter, system-ui, -apple-system, sans-serif !important;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
      {children}
    </>
  );
}
