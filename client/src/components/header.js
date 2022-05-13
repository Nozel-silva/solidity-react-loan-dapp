import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Header = () => {
    const [loans, setloans] = useState([]);

    const [currentAccount, setCurrentAccount] = useState('');
    const [connected, setconnected] = useState(true);

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window

            if (!ethereum){
                setconnected(false)
                alert("Please install MetaMask.");
                return
            } 

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                setconnected(true)
            } else {
                console.log("No accounts found");
                setconnected(false)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const connectWallet = async () => {
        try {
            const { ethereum } = window

            if (!ethereum) {
                setconnected(false)
                console.log('Metamask not detected')
                return
            }

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

            console.log('Found account', accounts[0])
            setCurrentAccount(accounts[0])
            setconnected(true)
            console.log(currentAccount)
        } catch (error) {
            console.log('Error connecting to metamask', error)
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    console.log(connected)
    return (
        <div>

            <Navbar bg="dark" variant="dark">
                <Container>
                    <Nav className="me-auto">
                        <NavLink className="sp" to="/">Users</NavLink>
                        <NavLink className="sp" to="/admin">Admin</NavLink>
                    </Nav>
                </Container>
            </Navbar>
            <header className="site-header">
                <div className="container">
                    <a id="branding">
                        <img src={logo} alt="Company Name" className="logo" />
                        <div className="branding-copy">
                            <h1 className="site-title">Covie mfn</h1>
                            <small className="site-description"></small>
                        </div>
                    </a>

                    {!connected &&
                        <button className="pull-right button muted" onClick={connectWallet}>Connect wallet</button>
                    }

                    {connected &&
                        <button className="pull-right button muted">Wallet connected</button>
                    }
                </div>
            </header>
        </div>
    );
};

export default Header;