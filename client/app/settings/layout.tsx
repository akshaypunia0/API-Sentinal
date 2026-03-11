import { Sidebar } from '@/components/dashboard/Sidebar'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 md:ml-64 overflow-auto">
        {children}
      </main>
    </div>
  )
}