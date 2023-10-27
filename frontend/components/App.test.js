// Write your tests here
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppClass from './AppClass'; 

describe('AppClass Component', () => {
  it('renders the component', () => {
    render(<AppClass className="test-class" />);
    const component = screen.getByTestId('app-class-component');
    expect(component).toBeInTheDocument();
  });

  it('renders the "Coordinates" heading', () => {
    render(<AppClass className="test-class" />);
    expect(screen.getByText('Coordinates (2, 2)')).toBeInTheDocument();
  });

  it('renders the "Steps" heading', () => {
    render(<AppClass className="test-class" />);
    expect(screen.getByText('You moved 0 times')).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    render(<AppClass className="test-class" />);
    const emailInput = screen.getByPlaceholderText('Type email');
    fireEvent.change(emailInput, { target: { value: 'example@example.com' } });
    expect(emailInput).toHaveValue('example@example.com');
  });

  it('submits the form', () => {
    render(<AppClass className="test-class" />);
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
  });
});

test('sanity', () => {
  expect(true).toBe(false)
})
