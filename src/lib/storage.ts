import type { StateStorage } from 'zustand/middleware';
let warning: string|null=null;
const listeners=new Set<()=>void>();
function report(message:string){warning=message;listeners.forEach(listener=>listener());}
export const storageStatus={subscribe:(listener:()=>void)=>{listeners.add(listener);return ()=>{listeners.delete(listener);};},getSnapshot:()=>warning};
/** If storage is denied or corrupt, keep the session usable and show an honest persistence notice. */
export const browserStorage: StateStorage = {
 getItem(name){try{const raw=window.localStorage.getItem(name);if(raw!==null)JSON.parse(raw);return raw;}catch{report('Saved preferences could not be read. You can continue with defaults in this session.');return null;}},
 setItem(name,value){try{window.localStorage.setItem(name,value);}catch{report('Device storage is unavailable. Your changes will last only for this session.');}},
 removeItem(name){try{window.localStorage.removeItem(name);}catch{report('Device storage is unavailable. Saved preferences could not be removed.');}},
};
