import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          ACADEMYX
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/product" className="text-muted-foreground hover:text-primary">Product</Link>
          <Link href="/features" className="text-muted-foreground hover:text-primary">Features</Link>
          <Link href="/resources" className="text-muted-foreground hover:text-primary">Resources</Link>
          <Link href="/about" className="text-muted-foreground hover:text-primary">About</Link>
          <Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link>
          <Link href="/support" className="text-muted-foreground hover:text-primary">Support</Link>
        </nav>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/explore">Explore</Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Account <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/login">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/signup">Sign Up</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}