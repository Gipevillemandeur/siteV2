import AdminProtection from '@/components/AdminProtection';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProtection>{children}</AdminProtection>;
}
