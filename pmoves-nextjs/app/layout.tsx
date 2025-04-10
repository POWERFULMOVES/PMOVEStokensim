import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { SimulationProvider } from '@/lib/context/SimulationContext'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PMOVES Economic Simulator',
  description: 'Compare traditional economic systems with cooperative community-based models',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SimulationProvider>
            <div className="flex flex-col min-h-screen">
              <header className="border-b">
                <div className="container flex h-16 items-center">
                  <div className="mr-4 font-bold">PMOVES Simulator</div>
                  <div className="flex-1">
                    <div className="hidden md:flex">
                      <div className="flex items-center space-x-6">
                        <a href="/" className="text-sm font-medium transition-colors hover:text-primary">Home</a>
                        <a href="/test" className="text-sm font-medium transition-colors hover:text-primary">Test</a>
                        <a href="/sensitivity" className="text-sm font-medium transition-colors hover:text-primary">Sensitivity</a>
                      </div>
                    </div>
                  </div>
                </div>
              </header>
              <main className="flex-1">
                {children}
              </main>
            </div>
          </SimulationProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
