import { describe,it,expect,vi } from 'vitest';
import { browserStorage,storageStatus } from './storage';
describe('storage resilience',()=>{
 it('does not crash or trust malformed JSON',()=>{vi.spyOn(Storage.prototype,'getItem').mockReturnValue('{bad json');expect(browserStorage.getItem('mono:financial-state')).toBeNull();expect(storageStatus.getSnapshot()).toContain('could not be read');});
 it('keeps the session usable when persistence is blocked',()=>{vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new DOMException('blocked','SecurityError');});expect(()=>browserStorage.setItem('mono:financial-state','{}')).not.toThrow();expect(storageStatus.getSnapshot()).toContain('only for this session');});
});
