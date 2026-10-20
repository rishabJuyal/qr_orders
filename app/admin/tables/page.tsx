'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { supabaseBrowser } from '../../../lib/supabase/client';
import { DEMO_MODE, DEMO_TABLES_KEY } from '../../../lib/demo';
import { ensureDemoTables } from '../../../lib/demo-store';
import AdminShell from '../../../components/AdminShell';

export default function Tables() {
  const [code, setCode] = useState('table-01');
  const [rows, setRows] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState('');

  function siteBase() {
    return process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  }

  async function load() {
    if (DEMO_MODE) {
      setRows(ensureDemoTables());
      return;
    }
    const { data, error } = await supabaseBrowser().from('restaurant_tables').select('*').order('table_code');
    if (error) {
      setMsg(error.message);
      setMsgType('error');
    } else setRows(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const base = siteBase();
      const entries = await Promise.all(
        rows.map(async (r) => {
          try {
            const url = `${base}/menu/${encodeURIComponent(r.table_code)}`;
            const dataUrl = await QRCode.toDataURL(url, { width: 320, margin: 2 });
            return [r.table_code, dataUrl] as const;
          } catch {
            return [r.table_code, ''] as const;
          }
        }),
      );
      if (!cancelled) setQrMap(Object.fromEntries(entries));
    })();
    return () => {
      cancelled = true;
    };
  }, [rows]);

  async function add() {
    const clean = code.trim();
    if (!/^[A-Za-z0-9-]{1,20}$/.test(clean)) {
      setMsg('Use letters, numbers and hyphens only.');
      setMsgType('error');
      return;
    }
    if (DEMO_MODE) {
      const next = [
        ...rows.filter((x) => x.table_code !== clean),
        { id: clean, table_code: clean },
      ].sort((a, b) => a.table_code.localeCompare(b.table_code));
      setRows(next);
      localStorage.setItem(DEMO_TABLES_KEY, JSON.stringify(next));
      setMsg(`Table ${clean} added.`);
      setMsgType('success');
      return;
    }
    const { error } = await supabaseBrowser()
      .from('restaurant_tables')
      .upsert({ table_code: clean, is_active: true }, { onConflict: 'table_code' })
      .select()
      .single();
    if (error) {
      setMsg(error.message);
      setMsgType('error');
      return;
    }
    setMsg(`Table ${clean} saved.`);
    setMsgType('success');
    await load();
  }

  async function download(row: any) {
    const data = qrMap[row.table_code] || (await QRCode.toDataURL(`${siteBase()}/menu/${encodeURIComponent(row.table_code)}`, { width: 600, margin: 2 }));
    const a = document.createElement('a');
    a.href = data;
    a.download = `nidhivan-${row.table_code}-qr.png`;
    a.click();
  }

  async function copy(row: any) {
    const url = `${siteBase()}/menu/${encodeURIComponent(row.table_code)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(row.table_code);
      window.setTimeout(() => setCopied(''), 1600);
    } catch {
      setMsg('Could not copy to clipboard.');
      setMsgType('error');
    }
  }

  return (
    <AdminShell
      title="Table QR codes"
      subtitle="Print a QR code for every table and stick it on the table"
    >
      <div className="card mb-6 p-4">
        <label htmlFor="table-code" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#a07d46]">
          Add a new table
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="table-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="table-01"
            className="input flex-1"
          />
          <button onClick={add} className="btn-primary px-6">
            Add table
          </button>
          <button onClick={load} className="btn-outline px-5">
            ↻ Refresh
          </button>
        </div>
        <p className="mt-2 text-xs text-[#9b8175]">
          Table codes use letters, numbers and hyphens only — for example <span className="font-semibold">table-01</span>.
        </p>
      </div>

      {msg && (
        <p
          role="status"
          className={`mb-4 animate-pop-in rounded-xl border p-3 text-sm ${
            msgType === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {msg}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <article key={r.id} className="card animate-fade-up overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#f4ecdd] bg-gradient-to-r from-[#fdf8ef] to-white px-4 py-3">
              <div>
                <h2 className="font-bold text-wine">{r.table_code}</h2>
                <p className="text-[11px] text-[#9b8175]">Tap to open the menu</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                Active
              </span>
            </div>

            <div className="flex flex-col items-center gap-3 p-4">
              <div className="rounded-2xl border border-[#f0e4d0] bg-white p-2 shadow-sm">
                {qrMap[r.table_code] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrMap[r.table_code]}
                    alt={`QR code for ${r.table_code}`}
                    className="h-40 w-40"
                  />
                ) : (
                  <div className="h-40 w-40 animate-pulse rounded-xl bg-[#f7efe1]" />
                )}
              </div>
              <p className="w-full break-all text-center text-[11px] text-[#9b8175]">
                {siteBase()}/menu/{r.table_code}
              </p>
              <div className="flex w-full gap-2">
                <button onClick={() => download(r)} className="btn-primary flex-1 py-2 text-xs">
                  ⬇ Download PNG
                </button>
                <button onClick={() => copy(r)} className="btn-outline px-3 py-2 text-xs">
                  {copied === r.table_code ? '✓' : '🔗'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {rows.length === 0 && (
        <div className="card px-6 py-14 text-center text-sm text-[#8b7269]">
          No tables yet. Add one above to generate its QR code.
        </div>
      )}
    </AdminShell>
  );
}
