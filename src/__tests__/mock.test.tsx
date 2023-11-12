import { mockResponse } from '../utils/mock';

it('show payment dialog', async () => {

    await mockResponse({
        amount: 1000,
        email: 'test@gmail.com',
        currency: 'USD',
        description: ''
    })

});