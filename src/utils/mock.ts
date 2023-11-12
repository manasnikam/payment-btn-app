import { Response, MockConfig, Payment } from "../types";

const mockResponse = (obj: Payment): Promise<Response> => {
    const failedResponses: Response[] = [
        { statusCode: 400, message: "Bad Request" },
        { statusCode: 401, message: "Unauthorized" },
        { statusCode: 500, message: "Something went wrong" }
    ];

    const mockConfig: string | null = localStorage.getItem('mockConfig');

    let resolveOrReject: boolean;
    let responseAfter: number;
    let rejectResponse: Response;

    if (mockConfig !== null) {
        let mockConfigObject: MockConfig = JSON.parse(mockConfig)
        responseAfter = mockConfigObject.responseAfter
        resolveOrReject = mockConfigObject.resolveOrReject
        rejectResponse = failedResponses[mockConfigObject.rejectResponseIndex]
    } else {
        resolveOrReject = Math.random() * 2 > 1;
        responseAfter = Math.floor((Math.random() * 2000) + 1000);
        rejectResponse = failedResponses[Math.floor(Math.random() * failedResponses.length)]
    }

    return new Promise<Response>((resolve, reject) => {
        setTimeout(() => {
            if (resolveOrReject) {
                resolve({
                    statusCode: 200,
                    message: 'Payment created successfully',
                    record: { ...obj, id: responseAfter }
                })
            } else reject(rejectResponse)
        }, responseAfter)
    })
}

export { mockResponse }
