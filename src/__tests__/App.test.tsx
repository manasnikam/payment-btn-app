import { render, screen } from '@testing-library/react';

import App from '../App';
import { AppProvider } from '../context/AppContext';

it('check for payment button', () => {
    render(
        <AppProvider>
            <App />
        </AppProvider>
    );
    expect(screen.getByText('Create a payment')).toBeInTheDocument();
});

// it('raises null exception for useContext', () => {
//     expect(render(<App />)).toThrow(Error)
// });