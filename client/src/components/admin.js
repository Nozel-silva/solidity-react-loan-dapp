import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Container, Alert, Button, ButtonGroup, Spinner } from 'react-bootstrap';

import { LoansAddress } from '../config.js';
import { ethers } from 'ethers';
import LoanAbi from '../utils/Loans.json';

const Admin = () => {
    const [loans, setLoans] = useState([]);
    const [admin, setAdmin] = useState(false);
    const [spin, setspin] = useState(true);

    const getAllLoans = async () => {
        try {
            const { ethereum } = window

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const LoanContract = new ethers.Contract(
                    LoansAddress,
                    LoanAbi.abi,
                    signer
                )

                let allLoans = await LoanContract.getAlLoans();
                setLoans(allLoans);
                setAdmin(true)
                setspin(false)
            } else {
                console.log("Ethereum object doesn't exist");
            }
        } catch (error) {
            console.log(error);
            setAdmin(false)
            setspin(false)
        }
    }

    const updateLoan = async (id, status) => {

        let loanstatus = {
            'id': id,
            'status': status
        };

        try {
            const { ethereum } = window

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const LoanContract = new ethers.Contract(
                    LoansAddress,
                    LoanAbi.abi,
                    signer
                )

                LoanContract.updateLoan(loanstatus.id, loanstatus.status)
                    .then(response => {
                        // setLoans([...loans, loan]);
                        console.log("Completed Task");
                    })
                    .catch(err => {
                        console.log("Error occured while approving loan");
                    });

                console.log('signer = ' + signer)
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log("Error approving loan", error);
        }
    };

    useEffect(() => {
        getAllLoans()
    }, []);

    return (
        <div>
            <h2>Admin</h2>
            <Container>
                <Row>
                    <Col xs={12}>
                    {spin &&
                        <Spinner animation="grow" /> 
                    }
                    </Col>
                    <Col xs={12}>
                        {!admin && !spin &&
                            <Alert variant="danger" dismissible>
                                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                <p>
                                    You do not have access here.
                                </p>
                            </Alert>

                        }
                    </Col>
                    <Col xs={12}>
                        {admin &&
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Amount</th>
                                        <th>Return Years</th>
                                        <th>Interest Per Year</th>
                                        <th>Total Payment</th>
                                        <th>Monthly Payment</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loans.map((loan, index) => (
                                        <tr key={index}>
                                            <td>{loan.amount.toNumber()}</td>
                                            <td>{loan.year.toNumber()}</td>
                                            <td>{loan.interestperyear.toNumber()}</td>
                                            <td>{loan.totalpayment.toNumber()}</td>
                                            <td>{loan.monthlypayment.toNumber()}</td>
                                            <td>{loan.status}</td>
                                            <td>
                                                <ButtonGroup size="sm">
                                                    <Button variant="success" onClick={() => updateLoan(loan.id, 'Approved')}>Approve</Button>
                                                    <Button variant="danger" onClick={() => updateLoan(loan.id, 'Declined')}>Decline</Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Admin;