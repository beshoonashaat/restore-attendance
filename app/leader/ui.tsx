'use client';

import { useMemo, useState, useTransition } from 'react';
import { QRScanner } from '@/components/qr-scanner';
import { Button, CardBox, Input } from '@/components/ui';
import { setAttendance } from '@/actions/cards';

export default function LeaderClient({ cards }: { cards: any[] }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<any>(cards[0] || null);
  const [notice, setNotice] = useState('');
  const [, start] = useTransition();

  const filtered = useMemo(
    () => cards.filter((c) => `${c.uuid} ${c.owner?.fullName || ''}`.toLowerCase().includes(q.toLowerCase())),
    [q, cards]
  );

  function scan(text: string) {
    const uuid = text.split('/card/')[1]?.split(/[?#]/)[0] || text;
    setQ(uuid);
    const card = cards.find((x) => x.uuid === uuid);
    if (card) {
      setNotice('');
      setSel(card);
    } else {
      setSel(null);
      setNotice('This card is unclaimed or unavailable for leaders. Ask the participant to claim it first.');
    }
  }

  function toggle(n: number, v: boolean) {
    if (!sel?.owner) return;
    const fd = new FormData();
    fd.set('cardId', sel.id);
    fd.set('attendanceNumber', String(n));
    fd.set('checked', String(v));
    start(() => { void setAttendance(null, fd); });
    setSel({ ...sel, [`attendance${n}`]: v });
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[380px_1fr]">
      <CardBox>
        <h1 className="text-2xl font-black">Leader Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Leaders can access claimed cards only.</p>
        <QRScanner onScan={scan} />
        {notice && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{notice}</p>}
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search claimed name, QR, UUID" className="mt-4" />
        <div className="mt-3 max-h-80 overflow-auto">
          {filtered.map((c) => (
            <button key={c.id} onClick={() => { setNotice(''); setSel(c); }} className="block w-full rounded-xl p-3 text-left hover:bg-slate-100">
              <b>{c.owner?.fullName}</b><br />
              <span className="text-xs">{c.uuid}</span>
            </button>
          ))}
          {filtered.length === 0 && <p className="p-3 text-sm text-slate-500">No claimed cards found.</p>}
        </div>
      </CardBox>

      {sel ? (
        <CardBox>
          <h2 className="text-2xl font-bold">{sel.owner?.fullName}</h2>
          <p className="text-sm text-slate-500">{sel.uuid}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <Button key={n} onClick={() => toggle(n, !sel[`attendance${n}`])} className={sel[`attendance${n}`] ? 'bg-green-700' : 'bg-slate-800'}>
                {sel[`attendance${n}`] ? 'Uncheck' : 'Check'} #{n}
              </Button>
            ))}
          </div>
          <h3 className="mt-8 font-bold">Recent history</h3>
          {sel.logs?.map((l: any) => (
            <p key={l.id} className="border-b py-2 text-sm">{l.action} #{l.attendanceNumber || ''} {new Date(l.timestamp).toLocaleString()}</p>
          ))}
        </CardBox>
      ) : (
        <CardBox>
          <h2 className="text-2xl font-bold">No claimed card selected</h2>
          <p className="mt-2 text-slate-600">Scan or search for a claimed participant card.</p>
        </CardBox>
      )}
    </div>
  );
}
