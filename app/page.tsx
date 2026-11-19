import { Suspense } from 'react';
import type { Metadata } from 'next';
import UndanganClient from '../components/UndanganClient';

export const metadata: Metadata = {
  title: 'Halal bi Halal Idul Fitri — Keluarga Besar Raslan – Supeni',
  description:
    'Undangan Halal bi Halal Hari Raya Idul Fitri Keluarga Besar Raslan – Supeni.',
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#143628]" />}>
      <UndanganClient />
    </Suspense>
  );
}