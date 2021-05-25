import React from 'react';
import { Component } from 'react';
import { Button, Modal, ModalBody } from 'reactstrap'; 
import Spinner from '../../Spinner/Spinner'; 

import axios from 'axios'; 

import { connect } from 'react-redux';
import { resetIngredients } from '../../../redux/actionCreators';

const mapStateToProps = state => {
    return {
        ingredients: state.ingredients,
        totalPrice: state.totalPrice,
        purchasable: state.purchasable,
        userId: state.userId, 
        token: state.token,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        resetIngredients: () => dispatch(resetIngredients()), 
    }
}

class Checkout extends Component {
    state = {
        values: {
            deliveryAddress: "",
            phone: "",
            paymentType: "Cash on Delivery",
        },
        isLoading: false,
        isModalOpen: false, 
        modalMsg: "",
    }

    goBack = () => {
        this.props.history.goBack("/");
    }

    inputChangeHandler = (e) => {
        this.setState({
            values: {
                ...this.state.values,
                [e.target.name]: e.target.value, 
            }
        })
    }

    submitHandler = () => {
        this.setState({isLoading: true}); 
        const order = {
            ingredients: this.props.ingredients,
            customer: this.state.values,
            price: this.props.totalPrice,
            orderTime: new Date(), 
            userId: this.props.userId, 
        }
        axios.post("https://burger-builder-ff8fa-default-rtdb.firebaseio.com/orders.json?auth=" + this.props.token, order)
        .then(response => {
            if(response.status === 200) {
                this.setState({
                    isLoading: false,
                    isModalOpen: true,
                    modalMsg: "Order Placed Successfully!",
                })
                this.props.resetIngredients(); 
            } else {
                this.setState({
                    isLoading: false,
                    isModalOpen: true,
                    modalMsg: "Something Went Wrong! Please Order Again",
                })
            }
        })
        .catch(err => {
            this.setState({
                isLoading: false,
                isModalOpen: true,
                modalMsg: "Something Went Wrong! Please Order Again!",
            })
        })
        console.log(order); 
    }
    render() {
        let form = (<div>
            <h4 style={{
                    border: "1px solid grey",
                    boxShadow: "1px 1px #888888",
                    borderRadius: "5px",
                    padding: "20px"
                }}>Payment: {this.props.totalPrice} BDT </h4>

                <form style={{
                    border: "1px solid grey",
                    boxShadow: "1px 1px #888888",
                    borderRadius: "5px",
                    padding: "20px"
                }}>
                    <textarea name="deliveryAddress" value={this.state.values.deliveryAddress}
                    className="form-control" placeholder="Your Address"
                    onChange={(e) => this.inputChangeHandler(e)}></textarea>
                    <br />
                    <input name="phone" className="form-control" value={this.state.values.phone} 
                    placeholder="Your Phone Number"
                    onChange={(e) => this.inputChangeHandler(e)} />
                    <br />
                    <select name="paymentType" className="form-control" 
                    value={this.state.values.paymentType}
                    onChange={(e) => this.inputChangeHandler(e)}>
                        <option value="Cash on Delivery">Cash on delivery</option>
                        <option value="Bkash">Bkash</option>
                    </select>
                    <br />
                    <Button style={{backgroundColor:"#D70F64"}}
                    className="mr-auto" onClick={this.submitHandler}
                    disabled={!this.props.purchasable}>Place Order</Button>
                    <Button color="secondary" className="m-1" onClick={this.goBack}>Cancel</Button>
                </form>
        </div>
        )
        return (
            <div>
                {this.state.isLoading ? <Spinner /> : form}
                <Modal isOpen={this.state.isModalOpen} onClick={this.goBack}>
                    <ModalBody>
                        <p>{this.state.modalMsg}</p> 
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout); 