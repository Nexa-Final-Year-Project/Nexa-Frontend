// lib/gsap-context.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsapContext(scope: any) {
  const ctx = gsap.context(() => {}, scope);
  return { ctx };
}