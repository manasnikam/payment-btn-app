import { type } from "os";

interface Payment {
    /** The email Id of the receiver */
    email: string;
    /** The amount to pay */
    amount: number;
    /** The currency of Transaction */
    currency: string;
    /** The description of Transaction */
    description?: string;
}

interface PaymentResponse extends Payment {
    /** Unique Id of transaction */
    id: number;
}

interface Response {
    /** The response code */
    statusCode: number;
    /** The response message */
    message: string;
    /** The response code */
    record?: PaymentResponse;
}

interface MockConfig {
    /** The response would returned after specified time */
    responseAfter: number;
    /** The response to return either as successful or as failed */
    resolveOrReject: boolean
    /** Select the index of failed responses to be returned */
    rejectResponseIndex: number
}

interface CurrencyOptions {
    /** Unique ID of currency */
    id: string;
    /** Name of currency */
    name: string;
    /** Symbol of currency */
    symbol: string;
    /** Formating function for currency */
    format: Intl.NumberFormat
}

interface ErrorDisplay {
    /** Variant to select the type of background color for Alert */
    variant: string;
    /** The error message to be displayed */
    content: string;
}

interface CurrencyInformation {
    /** Symbol of currency */
    symbol: string;
    /** Price formatted in specified currency */
    price: string;
}

export type { Response, MockConfig, PaymentResponse, Payment, CurrencyOptions, ErrorDisplay, CurrencyInformation }