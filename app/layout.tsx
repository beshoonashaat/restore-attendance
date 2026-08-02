import './globals.css';import type { Metadata } from 'next';
export const metadata: Metadata={title:'Restore Attendance Cards',description:'QR attendance tracking for Restore'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
