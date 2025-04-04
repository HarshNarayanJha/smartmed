import Header from "@/components/reusable/Header"

export default function PublicLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col px-4 pt-10 xl:px-8">
        {children}
      </main>
    </div>
  )
}
