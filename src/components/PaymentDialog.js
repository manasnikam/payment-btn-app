import { useEffect, useMemo, useState } from "react"

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

// Test Function
import { mockResponse } from "../utils/mock";
import { useApp } from "../context/AppContext";


const PaymentDialog = () => {

    const { showPaymentDialog, setShowPaymentDialog, setShowLoginDialog } = useApp()

    const currencyOptions = useMemo(() => [
        { id: "USD", name: "USA Dollars", symbol: '$', format: new Intl.NumberFormat('en-US') },
        { id: "INR", name: "Indian Rupee", symbol: `\u20B9`, format: new Intl.NumberFormat('en-IN') }
    ], [])

    const [email, setEmail] = useState()
    const [amount, setAmount] = useState()
    const [currency, setCurrency] = useState()
    const [description, setDescription] = useState()

    const [isProcessing, setIsProcessing] = useState(false)

    const [response, setResponse] = useState(null)
    const [errorResponse, setErrorResponse] = useState(null)

    useEffect(() => {
        if (response) {
            setAmount()
            setEmail()
            setCurrency()
            setDescription()
            setTimeout(() => {
                setShowPaymentDialog(false)
                setResponse(null)
            }, 2000)
        }
    }, [response, setShowPaymentDialog])

    const processedError = useMemo(() => {
        if (errorResponse) {
            const { statusCode } = errorResponse
            return {
                variant: (statusCode === 400) ? 'warning' : (statusCode === 401) ? 'danger' : 'dark',
                content: (statusCode === 400) ? 'Bad Request' : (statusCode === 401) ? 'Unauthorized' : 'Something went wrong. Try Again',
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
            setAmount()
            setEmail()
            setCurrency()
            setDescription()
        }
    }, [showPaymentDialog])

    const selectedCurrency = useMemo(() => {
        return currency ? currencyOptions.find(cur => cur.id === currency) : null
    }, [currency, currencyOptions])

    const showCreationButton = useMemo(() => validateEmail(email) && validateAmount(amount) && selectedCurrency !== null, [amount, email, selectedCurrency])

    const currencyData = useMemo(() => {
        if (selectedCurrency)
            return {
                symbol: selectedCurrency.symbol,
                price: selectedCurrency.format.format(amount)
            }
        return { symbol: '', price: '' }
    }, [amount, selectedCurrency])

    const createPayment = () => {
        setIsProcessing(true)
        mockResponse({ email, amount, currency, description }).then(resp => {
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
                            <Form.Select onChange={e => setCurrency(e.target.value)}>
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
                {errorResponse && <Row>
                    <Col>
                        <Alert variant={processedError.variant}>
                            {processedError.content}
                        </Alert>
                    </Col>
                </Row>}
                {response && <Row>
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
                            role="status"
                            aria-hidden="true"
                        /> Processing...
                    </Button>}
                    {!isProcessing && <Button onClick={createPayment} variant="primary">Pay {currencyData.symbol}{currencyData.price}</Button>}
                </Modal.Footer>
            }
        </Modal >
    )

}

export default PaymentDialog;
