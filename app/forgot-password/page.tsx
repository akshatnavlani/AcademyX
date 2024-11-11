import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function ForgotPassword() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg px-8 py-10">
            <h1 className="text-2xl font-bold text-center mb-6">ACADEMYX</h1>
            <form className="space-y-6">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your mail"
                  className="w-full"
                />
              </div>
              <Button className="w-full bg-black text-white hover:bg-gray-800">
                Get OTP
              </Button>
            </form>
          </div>
          <div className="mt-8 text-center">
            <Link href="/login" className="text-sm text-gray-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}