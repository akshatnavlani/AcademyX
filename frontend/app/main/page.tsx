'use client'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import { BrowserFrame } from '@/components/browser-frame'
import Link from 'next/link'

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <BrowserFrame className="bg-white text-primary">
              <div className="text-center py-12">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">LEARN. TEACH. UPSKILL.</h1>
                <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-muted-foreground">
                Join our community of learners and educators. Start your journey today!
                </p>
                <Button size="lg" asChild>
                  <Link href="/explore">Explore Courses</Link>
                </Button>
              </div>
            </BrowserFrame>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Feature that is amazing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['Benefit of Feature', 'Benefit of Feature', 'Benefit of Feature'].map((benefit, index) => (
                <Card key={index}>
                  <CardContent className="flex items-center p-6">
                    <CheckCircle className="text-primary mr-4" />
                    <p className="text-lg font-semibold">{benefit}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Share your knowledge and watch it grow</h2>
              <p className="text-xl mb-8">
                {"As a teacher on AcademyX, you don't just educate—you build a reputation, earn rewards, and make a real impact."}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {['Elevate your impact', 'Earn Income', 'Build Recognition', 'Grow while teaching'].map((item, index) => (
                  <div key={index} className="bg-background p-4 rounded-lg">
                    <p className="font-semibold">{item}</p>
                  </div>
                ))}
              </div>
              <Button size="lg" asChild>
                <Link href="/signup">Become a Teacher</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <blockquote className="text-2xl font-semibold italic text-center mb-8">
                {"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
              </blockquote>
              <div className="text-center">
                <p className="font-bold">Dhaka Oke</p>
                <p className="text-muted-foreground">Product Designer</p>
              </div>
            </div>
          </div>
        </section>

        <section className=" bg-black text-white py-20">
          <div className="container  mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Learn & Lead</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Be both a student and a teacher. Learn from others and simultaneously share your unique skills.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/explore">Start Exploring</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard;