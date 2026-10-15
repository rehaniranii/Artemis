import { it,expect,vi } from 'vitest';
import { render,screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InvestmentSlider } from './InvestmentSlider';
it('labels the slider thumb and supports keyboard adjustments',async()=>{const user=userEvent.setup(),change=vi.fn();render(<InvestmentSlider label="Monthly contribution" value={2000} onChange={change} max={8000}/>);const slider=screen.getByRole('slider',{name:'Monthly contribution'});slider.focus();await user.keyboard('{ArrowRight}');expect(change).toHaveBeenCalledWith(2100);});
