import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useApp } from "../context/AppContext";


const LoginDialog: React.FC = () => {

    const { showLoginDialog } = useApp()

    return (
        <Modal show={showLoginDialog} centered backdrop='static'>
            <Modal.Header>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="primary">Google Login</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default LoginDialog;
