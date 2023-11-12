import React, { useEffect, useMemo, useState } from "react"

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Spinner from 'react-bootstrap/Spinner';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Alert from 'react-bootstrap/Alert';

import { validateAmount, validateEmail } from "../utils/validations";

import { CurrencyOptions, Response, ErrorDisplay, CurrencyInformation } from "../types";

// Test Function
import { mockResponse } from "../utils/mock";
import { useApp } from "../context/AppContext";


const PaymentDialog: React.FC = () => {

    const { showPaymentDialog, setShowPaymentDialog, setShowLoginDialog } = useApp()

    const currencyOptions: CurrencyOptions[] = useMemo(() => [
        { id: "USD", name: "USA Dollars", symbol: '$', format: new Intl.NumberFormat('en-US') },
        { id: "INR", name: "Indian Rupee", symbol: `\u20B9`, format: new Intl.NumberFormat('en-IN') }
    ], [])

    const [email, setEmail] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [currency, setCurrency] = useState<string>('')
    const [description, setDescription] = useState<string>('')

    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    const [response, setResponse] = useState<Response | null>(null)
    const [errorResponse, setErrorResponse] = useState<Response | null>(null)

    useEffect(() => {
        if (response) {
            setAmount('')
            setEmail('')
            setCurrency('')
            setDescription('')
            setTimeout(() => {
                setShowPaymentDialog(false)
                setResponse(null)
            }, 2000)
        }
    }, [response, setShowPaymentDialog])

    const processedError: ErrorDisplay | null = useMemo(() => {
        if (errorResponse) {
            const { statusCode } = errorResponse
            switch (statusCode) {
                case 400: {
                    return {
                        variant: 'warning',
                        content: 'Bad Request'
                    }
                }
                case 401: {
                    return {
                        variant: 'danger',
                        content: 'Unauthorized'
                    }
                }
                default: {
                    return {
                        variant: 'dark',
                        content: 'Something went wrong. Try Again'
                    }
                }
            }
        }
        return null
    }, [errorResponse])

    useEffect(() => {
        if (errorResponse) {
            const { statusCode } = errorResponse
            setTimeout(() => {
                if (statusCode === 500 || statusCode === 401) setShowPaymentDialog(false)
                setErrorResponse(null)
                if (statusCode === 401) setShowLoginDialog(true)
            }, 2000)
        }
    }, [errorResponse, setShowPaymentDialog, setShowLoginDialog])

    useEffect(() => {
        if (!showPaymentDialog) {
            setAmount('')
            setEmail('')
            setCurrency('')
            setDescription('')
        }
    }, [showPaymentDialog])

    const selectedCurrency: CurrencyOptions | undefined = useMemo(() => currencyOptions.find(cur => cur.id === currency), [currency, currencyOptions])

    const showCreationButton: boolean = useMemo(() => validateEmail(email) !== null && validateAmount(amount) !== null && selectedCurrency !== undefined, [amount, email, selectedCurrency])

    const currencyData: CurrencyInformation = useMemo(() => {
        if (selectedCurrency)
            return {
                symbol: selectedCurrency.symbol,
                price: selectedCurrency.format.format(parseFloat(amount))
            }
        return { symbol: '', price: '' }
    }, [amount, selectedCurrency])

    const createPayment = () => {
        setIsProcessing(true)
        mockResponse({ email, amount: parseFloat(amount), currency, description }).then(resp => {
            setResponse(resp)
        }).catch(err => {
            setErrorResponse(err)
        }).finally(() => {
            setIsProcessing(false)
        })
    }

    return (
        <Modal centered show={showPaymentDialog} onHide={() => setShowPaymentDialog(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Create Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <FloatingLabel label="Email">
                            <Form.Control type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <Col>
                        <FloatingLabel label="Currency">
                            <Form.Select onChange={e => setCurrency(e.target.value)} placeholder="Currency">
                                <option></option>
                                {currencyOptions.map(cur => <option key={cur.id} value={cur.id}>{cur.name}</option>)}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <Col>
                        <FloatingLabel label="Amount">
                            <Form.Control type="number" placeholder="Amount" onChange={e => setAmount(e.target.value)} />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row style={{ height: '250px' }}>
                    <Col>
                        <ReactQuill theme="snow" value={description} onChange={setDescription} style={{ height: '200px' }} />
                    </Col>
                </Row>
                {errorResponse && processedError && <Row data-testid='payment-error'>
                    <Col>
                        <Alert variant={processedError.variant}>
                            {processedError.content}
                        </Alert>
                    </Col>
                </Row>}
                {response?.record && <Row data-testid='payment-success'>
                    <Col>
                        <Alert variant="primary">
                            Payment Processed Successfully<br />
                            <small>Transaction Id: <b>{response.record.id}</b></small>
                        </Alert>
                    </Col>
                </Row>}
            </Modal.Body >
            {
                showCreationButton && <Modal.Footer>
                    {isProcessing && <Button variant="primary" disabled>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="output"
                            aria-hidden="true"
                        /> Processing...
                    </Button>}
                    {!isProcessing && <Button onClick={createPayment} variant="primary" data-testid='pay-btn'>Pay {currencyData?.symbol}{currencyData?.price}</Button>}
                </Modal.Footer>
            }
        </Modal >
    )

}

export default PaymentDialog;
