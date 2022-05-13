import React, { useState, useEffect } from "react";
import { Row, Col, Table, Alert } from 'react-bootstrap';

import { LoansAddress } from '../config.js';
import { ethers } from 'ethers';
import LoanAbi from '../utils/Loans.json';

const Home = () => {
    const [loans, setLoans] = useState([]);
    const [fullname, setFullname] = useState('');
    const [location, setLocation] = useState('');
    const [amount, setAmount] = useState(1000);
    const [year, setYear] = useState(1);

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

                let allLoans = await LoanContract.getMyLoans();
                setLoans(allLoans);
            } else {
                console.log("Ethereum object doesn't exist");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllLoans()
    }, []);

    const applyForLoan = async (e) => {
        e.preventDefault();

        if (amount < 1000) {
            alert("cant borrow lesser than 1000")
            return
        }

        if (year < 1) {
            alert("Least amount of return years is 1")
            return
        }

        let loan = {
            'fullname': fullname,
            'location': location,
            'amount': amount,
            'year': year
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

                LoanContract.applyForLoan(loan.fullname, loan.location, loan.amount, loan.year)
                    .then(response => {
                        // setLoans([...loans, loan]);
                        console.log("Completed Task");
                        setYear('')
                        setFullname('')
                        setAmount(1000)
                        setYear(1)
                    })
                    .catch(err => {
                        console.log("Error occured while adding a new task");
                    });

                console.log('signer = ' + signer)
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log("Error submitting new Tweet", error);
        }


    };

    return (
        <div>
            <main className="main-content">
                <div className="hero" data-bg-image="./assets/dummy/bg.jpg">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <h2 className="hero-title">Why Covie MFN</h2>
                                <p>Get access to quick loans and return for as long as you want, pick a plan that you can follow.</p>
                                <div className="rate-box">
                                    <div className="num">4%</div>
                                    <div className="label">Average Rate <br />of Interest</div>
                                </div>
                                <ul className="check-list">
                                    <li><i className="fa fa-check"></i> Low inetrest rate, only 4%</li>
                                    <li><i className="fa fa-check"></i> As many years as possible for returns without any hassles</li>
                                    <li><i className="fa fa-check"></i> High approval rate</li>
                                </ul>
                            </div>
                            <div className="col-md-5 col-md-offset-1">
                                <div className="request-form">
                                    <h2>Request Form</h2>
                                    <form action="#">
                                        <input type="text" className="form-name" placeholder="Full Name..." value={fullname} onChange={e => setFullname(e.target.value)} />
                                        <input type="text" className="form-company" placeholder="Location..." value={location} onChange={e => setLocation(e.target.value)} />
                                        <input type="text" className="form-email" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
                                        <input type="text" className="form-phone" placeholder="Return years..." value={year} onChange={e => setYear(e.target.value)} />

                                        <div className="action">
                                            <input type="button" value="Apply for loan" onClick={applyForLoan} />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fullwidth-block cta">
                    <div className="container">
                        <Row>
                            <Col xs={12}>
                                <h2>LOAN HISTORY</h2>
                                {loans.length <= 0 &&
                                    <Alert variant="danger" dismissible>
                                        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                        <p>
                                            No loans to show
                                        </p>
                                    </Alert>
                                }
                                {loans.length > 0 &&
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>Amount</th>
                                                <th>Return Years</th>
                                                <th>Interest Per Year</th>
                                                <th>Total Payment</th>
                                                <th>Monthly Payment</th>
                                                <th>Status</th>
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
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                }
                            </Col>
                        </Row>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Home;