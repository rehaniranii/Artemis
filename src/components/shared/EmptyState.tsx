import type { ReactNode } from 'react';
import { Sprout } from '@/components/illustrations';
export function EmptyState({title,description,action}:{title:string;description:string;action?:ReactNode}){return <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-ink bg-white p-8 text-center md:p-12"><Sprout className="mb-5 w-20 float-slow"/><h2 className="display text-4xl">{title}</h2><p className="mt-3 max-w-md text-sm text-muted-foreground">{description}</p>{action&&<div className="mt-6">{action}</div>}</div>;}
