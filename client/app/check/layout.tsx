import { Sidebar } from '@/components/dashboard/Sidebar'

export default function CheckLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-60 overflow-auto">
        {children}
      </main>
    </div>
  )
}