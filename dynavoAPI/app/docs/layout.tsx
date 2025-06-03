import ProtectedRoute from '@/components/protected-route';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}