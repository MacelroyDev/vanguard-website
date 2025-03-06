'use client'; // This marks the component as a client component.

import { usePathname } from 'next/navigation';
import Navbar from './navbar'; // Adjust the import path as needed.

export default function ClientNavbar() {
  const pathname = usePathname();

  return <Navbar pathname={pathname} />;
}