import { render, screen } from '@testing-library/react';
import AboutApp from '../src/app/components/AboutApp';

describe('AboutApp component', () => {
  test('should have an h2 tag with text "Welcome to SheetScanner!"', () => {
    render(<AboutApp />);
    const h2Element = screen.getByText('Welcome to SheetScanner!');
    expect(h2Element).toBeInTheDocument();
  });
});
