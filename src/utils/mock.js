const mockResponse = obj => {
    const failedResponses = [
        { statusCode: 400, message: "Bad Request" },
        { statusCode: 401, message: "Unauthorized" },
        { statusCode: 500, message: "Something went wrong" }
    ];
    const resolveOrReject = Math.random() * 2 > 1;
    const responceAfter = Math.floor((Math.random() * 5000) + 1000);

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (resolveOrReject) {
                resolve({
                    statusCode: 200,
                    message: 'Payment created successfully',
                    record: { ...obj, id: responceAfter }
                })
            } else reject(failedResponses[Math.floor(Math.random() * failedResponses.length)])
        }, responceAfter)
    })
}

export { mockResponse }
