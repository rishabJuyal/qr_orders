# Run the project locally

1. Extract the ZIP and open this folder in VS Code.
2. Copy `.env.example` to `.env.local` (local mode is already the default).
3. Open a terminal in the project folder and run:
   ```bash
   npm install
   npm run dev
   ```
4. Open `http://localhost:3000/menu/table-01` and place a test order.
5. Open `http://localhost:3000/admin/login`.
   - Email: `admin@nidhivan.demo`
   - Password: `nidhivan123`
6. View the test order in the admin dashboard.

**Local mode limitations:** Orders and menu edits are saved only in that browser's localStorage. They do not sync across devices, and this is not suitable for live restaurant operation. Set `NEXT_PUBLIC_DEMO_MODE=false` only after configuring Supabase and testing the production flow.
