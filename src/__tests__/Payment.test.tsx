import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import App from '../App';
import { AppProvider } from '../context/AppContext';

const initPayment = async () => {
    render(
        <AppProvider>
            <App />
        </AppProvider>
    );

    fireEvent.click(screen.getByText('Create a payment'));
    await waitFor(() => expect(screen.getByText('Create Payment')).toBeInTheDocument())

    const emailInputElement = screen.getByPlaceholderText('Email')
    fireEvent.change(emailInputElement, { target: { value: 'some@email.com' } })

    const amountInputElement = screen.getByPlaceholderText('Amount')
    fireEvent.change(amountInputElement, { target: { value: '100000' } })

    const currencySelectElement = screen.getByPlaceholderText('Currency')
    fireEvent.change(currencySelectElement, { target: { value: 'USD' } })
}

it('create payment', async () => {
    await initPayment()

    localStorage.setItem('mockConfig', JSON.stringify({ resolveOrReject: true, responseAfter: 100, rejectResponseIndex: 0 }))

    fireEvent.click(screen.getByTestId('pay-btn'))
    await waitFor(() => expect(screen.getByTestId('payment-success')).toBeInTheDocument())
});

it('unauthorized user', async () => {
    await initPayment()

    localStorage.setItem('mockConfig', JSON.stringify({ resolveOrReject: false, responseAfter: 100, rejectResponseIndex: 1 }))

    fireEvent.click(screen.getByTestId('pay-btn'))
    await waitFor(() => expect(screen.getByTestId('payment-error')).toBeInTheDocument())

    await waitFor(() => expect(screen.getByText('Unauthorized')).toBeInTheDocument())

    await waitFor(() => expect(screen.getByText('Google Login')).toBeInTheDocument(), { timeout: 2500 })
});

it('bad request', async () => {
    await initPayment()

    localStorage.setItem('mockConfig', JSON.stringify({ resolveOrReject: false, responseAfter: 100, rejectResponseIndex: 0 }))

    fireEvent.click(screen.getByTestId('pay-btn'))
    await waitFor(() => expect(screen.getByTestId('payment-error')).toBeInTheDocument())

    await waitFor(() => expect(screen.getByText('Bad Request')).toBeInTheDocument())
});

it('something went wrong', async () => {
    await initPayment()

    localStorage.setItem('mockConfig', JSON.stringify({ resolveOrReject: false, responseAfter: 100, rejectResponseIndex: 2 }))

    fireEvent.click(screen.getByTestId('pay-btn'))
    await waitFor(() => expect(screen.getByTestId('payment-error')).toBeInTheDocument())

    await waitFor(() => expect(screen.getByText('Something went wrong. Try Again')).toBeInTheDocument())
});