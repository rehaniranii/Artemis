import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
afterEach(()=>cleanup());
Object.defineProperty(window,'matchMedia',{writable:true,value:vi.fn().mockImplementation(query=>({matches:query.includes('prefers-reduced-motion'),media:query,onchange:null,addListener:vi.fn(),removeListener:vi.fn(),addEventListener:vi.fn(),removeEventListener:vi.fn(),dispatchEvent:vi.fn()}))});
Object.defineProperty(window,'scrollTo',{writable:true,value:vi.fn()});
class ResizeObserverMock {observe(){} unobserve(){} disconnect(){}}
vi.stubGlobal('ResizeObserver',ResizeObserverMock);
class IntersectionObserverMock {
  constructor(private callback?: IntersectionObserverCallback) {}
  observe(element: Element) {
    this.callback?.([{ isIntersecting: true, target: element } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
vi.stubGlobal('IntersectionObserver',IntersectionObserverMock);
Element.prototype.scrollIntoView=vi.fn();
Element.prototype.hasPointerCapture=vi.fn(()=>false);
Element.prototype.setPointerCapture=vi.fn();
Element.prototype.releasePointerCapture=vi.fn();
