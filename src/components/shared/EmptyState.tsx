import type { ReactNode } from 'react';
import { Sprout } from 'lucide-react';
export function EmptyState({title,description,action}:{title:string;description:string;action?:ReactNode}){return <div className="flex flex-col items-center rounded-2xl border border-dashed bg-white/40 p-8 text-center md:p-12"><span className="mb-5 rounded-full bg-secondary p-3"><Sprout size={22} strokeWidth={1.4}/></span><h2 className="font-serif text-3xl">{title}</h2><p className="mt-3 max-w-md text-sm text-muted-foreground">{description}</p>{action&&<div className="mt-6">{action}</div>}</div>;}
