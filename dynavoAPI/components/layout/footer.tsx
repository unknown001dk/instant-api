import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">DynavoAPI</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Create custom APIs without writing a single line of backend code. Define schemas, connect your database, and get instant APIs.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-sm mb-4">RESOURCES</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  API Reference
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-sm mb-4">COMPANY</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DynavoAPI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}