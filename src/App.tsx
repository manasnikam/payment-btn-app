import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Button } from 'react-bootstrap';

import { useApp } from './context/AppContext';

import LoginDialog from './components/LoginDialog';
import PaymentDialog from './components/PaymentDialog';


const App = () => {

  const { setShowPaymentDialog } = useApp();

  return (
    <Container>
      <br />
      <Row>
        <Col>
          <Button variant="primary" onClick={() => setShowPaymentDialog(true)}>Create a payment</Button>
        </Col>
        <Col></Col>
        <Col></Col>
      </Row>
      <LoginDialog />
      <PaymentDialog />
    </Container>
  );
}

export default App;
