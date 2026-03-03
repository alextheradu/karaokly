export default function PlayerWindowLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black m-0 p-0">{children}</body>
    </html>
  )
}
