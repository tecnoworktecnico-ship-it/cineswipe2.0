import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders the title CineSwipe', () => {
    render(<App />);
    const titleElement = screen.getByText(/CineSwipe/i);
    expect(titleElement).toBeInTheDocument();
  });
});
