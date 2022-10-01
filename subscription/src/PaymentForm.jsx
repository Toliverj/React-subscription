import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React from 'react'
import { useState } from 'react'

const PaymentForm = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [showCreateSubscription, setShowCreateSubscription] = useState(true)
    const [showCancelSubscription, setShowCancelSubscription] = useState(false)

    const stripe = useStripe()
    const elements = useElements()

    const createSubscription = async() => {

        try {

            const paymentMethod = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement('card')
            })

            const response = await fetch('http://localhost:4000/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    paymentMethod: paymentMethod.paymentMethod.id
                })
            })
         
            if(!response.ok) return alert('Payment Unsuccessful')
            const data = await response.json()
            const confirm = await stripe.confirmCardPayment(data.clientSecret)
            if(confirm.error) return alert('Payment Unsucessful')
            alert('Payment Successful')
            setShowCreateSubscription(false)
            setShowCancelSubscription(true)
            localStorage.setItem('cus_ID', data.customerID)
            

            
        } catch (error) {
            console.log(error)
            alert('Payment failed', error.message)
        }

    }


    //cancel subscription

    const removeAccount = async() => {
      

        try {

            const response = await fetch('http://localhost:4000/delete', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
               id: localStorage.getItem('cus_ID')
              }),
            })

            if (!response) return alert('Cancellation failed')
           

           
          } catch (err) {
            console.error(err);
            alert("Payment failed! " + err.message);
          }

    //setShowCancelSubscription(false)
    //setShowCreateSubscription(true)
       
      }


  return (
    <div style = {{width: '20%'}}>
        Name: {' '}
        <input
        type={'text'}
        value = {name}
        onChange = {(e) => setName(e.target.value)}
        placeholder = 'Enter Name'

        />

        <br/>

        Email: {' '}
        <input
        type={'email'}
        value = {email}
        onChange = {(e) => setEmail(e.target.value)}
        placeholder = 'Enter Email'

        />
         <br/>

         <CardElement/>

         <br/>

         <button  onClick={createSubscription}>Create Subscription</button>
         <button  onClick={removeAccount}>Cancel Subscription</button>


    </div>
  )
}

export default PaymentForm