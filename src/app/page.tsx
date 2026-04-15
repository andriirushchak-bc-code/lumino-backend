export default function Home() {
  return (
    <html>
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
      <body>
        <h1>Lumino Expense</h1>
        <p className="subtitle">Demo Backend — Next.js 14 + Supabase + Gemini</p>

        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Path</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>GET</code></td>
              <td><code>/api/health</code></td>
              <td>Health check — returns status ok</td>
            </tr>
            <tr>
              <td><code>POST</code></td>
              <td><code>/api/import/analyze</code></td>
              <td>Fetch a Google Sheet, infer schema via Gemini, create import session</td>
            </tr>
            <tr>
              <td><code>GET</code></td>
              <td><code>/api/import/[id]</code></td>
              <td>Fetch an import session by ID</td>
            </tr>
            <tr>
              <td><code>PATCH</code></td>
              <td><code>/api/import/[id]/mapping</code></td>
              <td>Update column mapping overrides on a session</td>
            </tr>
            <tr>
              <td><code>POST</code></td>
              <td><code>/api/import/[id]/execute</code></td>
              <td>Execute the import — bulk insert rows into Supabase</td>
            </tr>
          </tbody>
        </table>

        <p className="note">
          View data:{' '}
          <a
            href="https://supabase.com/dashboard/project/toxivgbqxxkanypdyekk/editor"
            target="_blank"
            rel="noopener noreferrer"
          >
            Supabase Studio — Table Editor
          </a>
        </p>
      </body>
    </html>
  );
}
