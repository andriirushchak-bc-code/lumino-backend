export default function Home() {
  return (
    <main>
      <h1>Lumino Expense</h1>
      <p className="subtitle">Demo Backend — Next.js + Supabase + Gemini</p>

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
    </main>
  );
}
