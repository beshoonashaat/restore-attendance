'use client';

import { useActionState, useMemo, useState } from 'react';
import { createLeader, generateCards, adminResetCard, deleteLeader, toggleLeader } from '@/actions/cards';
import { Button, CardBox, Input } from '@/components/ui';
import Link from 'next/link';

function attendanceCount(card: any) {
  return [card.attendance1, card.attendance2, card.attendance3, card.attendance4].filter(Boolean).length;
}

export default function AdminClient({ data }: { data: any }) {
  const [, gen] = useActionState(generateCards, {} as any);
  const [, lead] = useActionState(createLeader, {} as any);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [attendance, setAttendance] = useState('all');

  const filteredCards = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.cards.filter((card: any) => {
      const count = attendanceCount(card);
      const matchesQuery = !q || [card.uuid, card.owner?.fullName || '', String(count), `${count}/4`]
        .join(' ')
        .toLowerCase()
        .includes(q);
      const matchesStatus =
        status === 'all' ||
        (status === 'claimed' && card.owner) ||
        (status === 'unclaimed' && !card.owner) ||
        (status === 'complete' && count === 4) ||
        (status === 'incomplete' && count < 4);
      const matchesAttendance = attendance === 'all' || count === Number(attendance);
      return matchesQuery && matchesStatus && matchesAttendance;
    });
  }, [data.cards, query, status, attendance]);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <h1 className="text-4xl font-black">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Total Cards', data.total],
          ['Claimed', data.claimed],
          ['Unclaimed', data.unclaimed],
          ['Completed', data.complete],
        ].map((x) => (
          <CardBox key={x[0]}>
            <p className="text-sm text-slate-500">{x[0]}</p>
            <b className="text-3xl">{x[1]}</b>
          </CardBox>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CardBox>
          <h2 className="text-xl font-bold">Generate Cards</h2>
          <form action={gen} className="mt-3 flex gap-2">
            <Input name="count" type="number" min={1} max={1000} placeholder="25 / 50 / 100" />
            <Button>Generate</Button>
          </form>
          <Link href="/admin/export" className="mt-4 inline-block underline">Download print-ready PDF</Link>
        </CardBox>

        <CardBox>
          <h2 className="text-xl font-bold">Create Leader</h2>
          <form action={lead} className="mt-3 grid gap-2 sm:grid-cols-3">
            <Input name="username" placeholder="username" />
            <Input name="password" type="password" placeholder="password" />
            <Button>Create</Button>
          </form>
          {data.leaders.map((l: any) => (
            <div key={l.id} className="mt-2 flex items-center justify-between rounded-xl bg-slate-50 p-2">
              <span>{l.username} {l.enabled ? '' : '(disabled)'}</span>
              <div className="space-x-2">
                <button onClick={() => toggleLeader(l.id, !l.enabled)} className="underline">{l.enabled ? 'Disable' : 'Enable'}</button>
                <button onClick={() => deleteLeader(l.id)} className="text-red-600 underline">Delete</button>
              </div>
            </div>
          ))}
        </CardBox>
      </div>

      <CardBox>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-bold">Cards & Users</h2>
            <p className="text-sm text-slate-500">Showing {filteredCards.length} of {data.cards.length} loaded cards</p>
          </div>
          <div className="grid w-full gap-2 md:w-auto md:grid-cols-[280px_160px_150px]">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, UUID, QR, attendance" />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none ring-restore-ink/20 focus:ring-4">
              <option value="all">All status</option>
              <option value="claimed">Claimed</option>
              <option value="unclaimed">Unclaimed</option>
              <option value="complete">Complete</option>
              <option value="incomplete">Incomplete</option>
            </select>
            <select value={attendance} onChange={(e) => setAttendance(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none ring-restore-ink/20 focus:ring-4">
              <option value="all">Any count</option>
              <option value="0">0 / 4</option>
              <option value="1">1 / 4</option>
              <option value="2">2 / 4</option>
              <option value="3">3 / 4</option>
              <option value="4">4 / 4</option>
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="py-2">Name</th>
                <th>UUID / QR</th>
                <th>Status</th>
                <th>Attendance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((c: any) => {
                const count = attendanceCount(c);
                return (
                  <tr key={c.id} className="border-b align-top">
                    <td className="py-2 font-medium">{c.owner?.fullName || 'Unclaimed'}</td>
                    <td className="max-w-[280px] break-all text-xs text-slate-600">{c.uuid}</td>
                    <td>{c.owner ? 'Claimed' : 'Unclaimed'}</td>
                    <td>{count}/4</td>
                    <td className="space-x-2 whitespace-nowrap">
                      <button onClick={() => adminResetCard(c.id, 'owner')} className="underline">Reset owner</button>
                      <button onClick={() => adminResetCard(c.id, 'attendance')} className="underline">Reset attendance</button>
                      <button onClick={() => adminResetCard(c.id, 'delete')} className="text-red-600 underline">Delete</button>
                    </td>
                  </tr>
                );
              })}
              {filteredCards.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">No cards match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </CardBox>

      <CardBox>
        <h2 className="text-xl font-bold">Recent Activity</h2>
        {data.logs.map((l: any) => (
          <p key={l.id} className="border-b py-2 text-sm">{l.action} {l.userName || ''} by {l.leader?.username || 'system'} — {new Date(l.timestamp).toLocaleString()}</p>
        ))}
      </CardBox>
    </div>
  );
}
