import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
export default function NotFoundPage(){return <><h1 className="sr-only">Page not found</h1><EmptyState title="A small detour." description="This page or concept doesn’t exist. Let’s get you back to familiar ground." action={<Button asChild className="rounded-full"><Link to="/home">Back to Home</Link></Button>}/></>;}
