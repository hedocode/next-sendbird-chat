import Link from 'next/link'
import Button from '../components/Button'
 
export default function NotFound() {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
        <h2 className='mb-2'>404 : Not Found</h2>
        <p className='mb-2'>Could not find requested resource</p>
        <Button>
            <Link href="/">Return Home</Link>
        </Button>
    </div>
  )
}