import { PublicHeader } from "@/components/layout/PublicHeader"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PublicHeader />
      <main className="flex flex-col flex-1">
        {children}
      </main>
    </>
  )
}
