export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Lumino Expense — Demo Backend</title>
        <style>{`
          body { font-family: system-ui, sans-serif; max-width: 700px; margin: 60px auto; padding: 0 24px; color: #111; }
          h1 { font-size: 1.8rem; margin-bottom: 4px; }
          .subtitle { color: #555; margin-bottom: 32px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
          th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
          th { background: #f9fafb; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
          code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.85em; }
          .note { background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 12px 16px; font-size: 0.9rem; }
          a { color: #2563eb; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
