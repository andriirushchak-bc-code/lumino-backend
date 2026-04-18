export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* Override root layout constraints for the demo page */
        body {
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #0f1117 !important;
          color: #f1f5f9 !important;
          font-family: system-ui, -apple-system, sans-serif !important;
        }
      `}</style>
      {children}
    </>
  );
}
