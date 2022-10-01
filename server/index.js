const express = require('express')
const app = express()

//const stripe = require('stripe')('sk_test_51L2flsALU69ZaX0XJftWNS65FVQa3IggQZuwhqgeBgxZRXbIt2kFq632tTOyeBHX27iYQnVomE4UA2rcG3ZR357100gcCGNoqD')
const bodyParser = require('body-parser')
const cors = require('cors')

const Stripe = require('stripe')


const stripe = new Stripe('{{ENTER_SECRET_KEY}}')


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(cors())




app.post('/payment', cors(), async (req, res) => {
    
    try {

        if(req.method != 'POST') return res.status(400)
        const {name, email, paymentMethod} = req.body

        // Create a customer
    const customer = await stripe.customers.create({
        email,
        name,
        payment_method: paymentMethod,
        invoice_settings: { default_payment_method: paymentMethod },
      });
      

      // Create a product
      const product = await stripe.products.create({
        name: "Monthly subscription",
      });


      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price_data: {
              currency: "USD",
              product: product.id,
              unit_amount: 699,
              recurring: {
                interval: "month",
              },
            },
          },
        ],
  
        payment_settings: {
          payment_method_types: ["card"],
          save_default_payment_method: "on_subscription",
        },
        expand: ["latest_invoice.payment_intent"],
      });

        res.json({
            message: 'Payment Successful',
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
            customerID: customer.id
        })

       
    } catch (error) {
        console.log('Error', error)
       res.status(500).json({message: 'Internal server error'})
    }
})


//delete

app.post('/delete', cors(), async (req, res) => {
    
    try {

        if(req.method != 'POST') return res.status(400)
        const {id} = req.body

        const deleted = await stripe.customers.del(
            id
          );

          res.json({
            message: 'Removed Account',
            
        })

      
       
    } catch (error) {
        console.log('Error', error)
       res.status(500).json({message: 'Internal servver error'})
    }
})






app.listen(process.env.PORT || 4000, () => {
    console.log('Server is listening on port 4000 lol')
    
})