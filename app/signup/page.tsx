import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import apple from '@/components/icons/icons8-apple 1.png'
import google from '@/components/icons/icons8-google 1.png'
import github from '@/components/icons/Github.png'

export default function SignUp() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-4xl flex">
          <div className="w-1/2 bg-gray-200 rounded-l-lg hidden md:block">
            <div className="h-full flex items-center justify-center">
              <span className="text-gray-500">Image placeholder</span>
            </div>
          </div>
          <div className="w-full md:w-1/2 bg-white p-8 rounded-lg md:rounded-l-none md:rounded-r-lg">
            <h2 className="text-2xl font-bold mb-6">SIGNUP AND START LEARNING</h2>
            <form className="space-y-4">
              <Input type="text" placeholder="UserName" />
              <Input type="email" placeholder="Email" />
              <Input type="password" placeholder="Password" />
              <div className="flex items-center">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <Button className="w-full bg-black text-white hover:bg-gray-800">
                Sign Up
              </Button>
            </form>
            <div className="mt-6 flex justify-center space-x-4">
              <Link href="/auth/github">
                <Image src={github} alt="GitHub" width={24} height={24} />
              </Link>
              <Link href="/auth/google">
                <Image src={google} alt="Google" width={24} height={24} />
              </Link>
              <Link href="/auth/apple">
                <Image src={apple} alt="Apple" width={24} height={24} />
              </Link>
            </div>
            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-gray-600 hover:underline">
                Already have an account?
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}