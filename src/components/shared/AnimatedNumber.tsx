import { animate, useMotionValue, useMotionValueEvent } from 'motion/react';
import { useEffect, useState } from 'react';
import { useAppMotion } from '@/hooks/useAppMotion';
import { formatINR } from '@/lib/format';
export function AnimatedNumber({value,format=formatINR,className}:{value:number;format?:(n:number)=>string;className?:string}){const {reduceMotion}=useAppMotion();const motionValue=useMotionValue(value);const [display,setDisplay]=useState(value);useMotionValueEvent(motionValue,'change',setDisplay);useEffect(()=>{if(reduceMotion){motionValue.set(value);return;}const controls=animate(motionValue,value,{duration:.45,ease:'easeOut'});return ()=>controls.stop();},[value,reduceMotion,motionValue]);return <span className={className}><span aria-hidden="true">{format(display)}</span><span className="sr-only">{format(value)}</span></span>;}
