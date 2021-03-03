Build your online store's checkout process with Stripe on Repl.it
---------------------


Looking for an integrated solution for your site’s checkout process, without having to resort to plugins? Here’s a step by step approach to integrating Stripe with Repl.it!

This tutorial requires a frontend and a backend, both hosted on Repl.it. Please check out the completed parts here:
Server side: https://repl.it/@ThisisCarla/MySitesCheckoutWithStripe#index.js
Frontend: https://repl.it/@ThisisCarla/MySite#index.html 

For the sake of continuity, both parts are covered in the tutorial that follows.


## Part 1: Start your Repl.it Stripe Server

Start a new Node.js repl:
![Picking a repl](https://repl.it/@ThisisCarla/BrickSite#images/1.png)

Next, pick the Express server template, it’ll provide the framework to integrate with Stripe from a server. 

Giving it a run generates the following:
![Running the repl](https://repl.it/@ThisisCarla/BrickSite#images/2.png)

Terrific! We’re already “hosting” our server with Repl.it.

Next, we need to install the Stripe SDK. We can do this by running:
 
`npm install --save stripe ` in your Repl shell.

Next, we want to start our Stripe account. Head over to https://stripe.com/ and create an account.

Once created, head on over to the integration walkthrough here: https://stripe.com/docs/checkout/integration-builder 

Now copy-pasta the walkthrough code into your serverside Repl.it server:
```
const stripe = require('stripe')('sk_test_51IKlwdAhJUZ4ZUqHFBRpOTbbNVakSMbHbouhVH89YPszHcOftinFd6Vi5oOOaY1HZ1PDNmOfiKEEdR03vOqeaHWU00TnpDSj8N');
const express = require('express');
const app = express();
app.use(express.static('.'));
const YOUR_DOMAIN = 'http://localhost:4242';
app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Stubborn Attachments',
            images: ['https://i.imgur.com/EHyR2nP.png'],
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });
  res.json({ id: session.id });
});
app.listen(4242, () => console.log('Running on port 4242'));
```

You’ll notice that the integration builder has hardcoded our API key. This isn’t great.

Luckily Repl.it supports environment variables using a .env file. Check out the tutorial here https://docs.repl.it/tutorials/08-storing-secrets-and-history . 


To implement this, add a `.env` file to the root of your project and set your stripe key there. (will block our API key).
Referring to an env variable in node is done by referencing `process.env.VARIABLENAME`

Contents of .env:
```
STRIPE_KEY=sk_test_51IKlwdAhJUZ4ZUqHFBRpOTbbNVakSMbHbouhVH89YPszHcOftinFd6Vi5oOOaY1HZ1PDNmOfiKEEdR03vOqeaHWU00TnpDSj8N
```
It should look something like:
![Our .env](https://repl.it/@ThisisCarla/BrickSite#images/5.png)


Now we need an endpoint to create a Checkout Session with Stripe - this means that it’ll redirect us to the Stripe payment page with all the appropriate information about the purchase.

The shell of the endpoint looks like this:
```
app.post('/create-checkout-session', async (req, res) => {
	// Stuff goes here
});
```

And the contents create the Checkout Session with Stripe:
```
const session = await stripe.checkout.sessions.create({
   //
 });
 res.json({ id: session.id });

```


 

Going back to our `index.js`, you’ll notice the Stripe code requires a `YOUR_DOMAIN` variable, that’s currently set to https://localhost:4242. In order to link this up with our site, we need to actually create one. Enter Part 2 - making the site with Repl.it!



## Part 2: Buying the Bricks with a Repl frontend

In this next section, we want to make a site that’ll act as the site we can buy stuff from, and connect it to our Stripe integration in Part 1.

To do this, we’ll start off with a new Repl, using the “basic HTML,CSS, JS” option, and call it BrickSite. 

We’ll create a one page application with minimal functionality -  a static list of bricks that a visitor can buy. Each brick has a price, a name, a description and an image. The buy button will become enabled when a brick is chosen.

You can find the complete code here: https://repl.it/@ThisisCarla/MySite#index.html .


### 1. Making BrickSite:
Our first step is to add the Bulma styling library. It’s a great way to style BrickSite with little effort. We’ll include the CDN by replacing the default `rel=”stylesheet”` with the Bulma CDN.

Nifty-tip! Searching “bulma” in the packages tab in our Repl.it IDE means we can insert it automatically. See here:
![Auto adding Bulma](https://repl.it/@ThisisCarla/BrickSite#images/6.png)

This inserts the following into our head tag of `index.html`:
```
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css" />
```

Now to add some static content and using Bulma’s out of the box classes. Paste it in your index.html and give it a run to try it out.
```
<!DOCTYPE html>
<html>
 <head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width">
   <title>MySite</title>
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css" />
 </head>
 <body>
   <div class="section">
     <div class ="container">
       <div class="title"> My Site to Buy Bricks </div>
       <div id="bricks" class="tile is-ancestor">
         <div class="tile is-parent">
           <article id="brick0" class="tile is-child notification is-info">
             <p id class="title">Brickson Brick</p>
             <p class="subtitle">This is a plain brick</p>
             <div class="box">
               This brick costs: $1
             </div>
             <button class="button is-dark">Buy this brick</button>
           </article>
          
         </div>
         <div class="tile is-parent">
           <article id="brick1" class="tile is-child notification is-warning">
             <p class="title">Bricketty Brick</p>
             <p class="subtitle">This is a cooler brick</p>
             <div class="box">
               This brick costs: $5
             </div>
             <button class="button is-dark">Buy this brick</button>
           </article>
         </div>
         <div class="tile is-parent">
           <article id="brick2" class="tile is-child notification is-success">
             <p class="title">McBrickerty McBrickerson</p>
             <p class="subtitle">This is the best brick</p>
             <div class="box">
               This brick costs: $100
             </div>
             <button class="button is-dark">Buy this brick</button>
           </article>
         </div>
       </div>
     </div>
   </div>
 </body>
</html>
 
```
Giving it a run generates the following:
![First draft](https://repl.it/@ThisisCarla/BrickSite#images/7.png)


Now at this point we want to add some good ol’ vanilla JS variables to control the content on the page, including variables for the prices.


The js script for this point is in `scriptstep2.js`
```
const BRICKS = [
 {
   "name": "Brickson Brick",
   "desc": "this is a plain brick",
   "style": "is-info",
   "cost": 1
 },
 {
   "name": "Bricketty Brick",
   "desc": "this is a cooler brick",
   "style": "is-warning",
   "cost": 5
 },
   {
   "name": "MyBrickerty McBrickson",
   "desc": "this is the best brick",
   "style": "is-success",
   "cost": 100
 }
];
 
for (var i = 0; i < BRICKS.length; i++) {
 let newBrick = document.createElement('div');
 newBrick.className = "tile is-parent";
 
 let newBrickArticle = document.createElement('article');
 newBrickArticle.className = "tile is-child notification " + BRICKS[i].style;
 
 let newBrickTitle = document.createElement('p');
 newBrickTitle.className = "title";
 newBrickTitle.innerHTML = BRICKS[i].name;
 
 let newBrickDesc = document.createElement('p');
 newBrickDesc.className = "subtitle";
 newBrickDesc.innerHTML = BRICKS[i].desc;
 
 let newBrickCost = document.createElement('div');
 newBrickCost.className = "box";
 newBrickCost.innerHTML = "This brick costs: $" + BRICKS[i].cost;
 
 let newBrickButton = document.createElement('button');
 newBrickButton.className = "button is-dark";
 newBrickButton.innerHTML = "Buy this brick"
 
 newBrickArticle.appendChild(newBrickTitle);
 newBrickArticle.appendChild(newBrickDesc);
 newBrickArticle.appendChild(newBrickCost);
 newBrickArticle.appendChild(newBrickButton);
 
 newBrick.appendChild(newBrickArticle);
 document.getElementById("bricks").appendChild(newBrick);   
}
 ```
Here for every brick in the BRICKS array, we've created a div element, added it's own name, styling, content and button, and then added it to the DOM.
 
 
Referring back to the server code, you will notice it requires both a success.html and a cancel.html. Let’s make these.
Here’s the `success.html`:
![Success page](https://repl.it/@ThisisCarla/BrickSite#images/9.png)


Code below:
```
<!DOCTYPE html>
<html>
 <head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width">
   <title>MySite - Success</title>
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css" />
 </head>
 <body>
   <div class="section">
     <div class ="container">
       <article class="message is-large is-success">
         <div class="message-header">
           <p>Congratulations!</p>
         </div>
         <div class="message-body">
           You have purchased a brick. We hope you build great big things with your brick and come back to buy more bricks from us. May the bricks be ever in your favour and the bricklaying be bountiful and swift.
         </div>
       </article>
   <script src="script.js"></script>
 </body>
</html>
```
 
And here’s the `cancel.html`:
![Failure page](https://repl.it/@ThisisCarla/BrickSite#images/10.png)

Code below:
```
<!DOCTYPE html>
<html>
 <head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width">
   <title>MySite- Cancel</title>
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css" />
 </head>
 <body>
   <div class="section">
     <div class ="container">
       <article class="message is-large is-danger">
         <div class="message-header">
           <p>Failed!</p>
         </div>
         <div class="message-body">
           You have failed to purchase a brick. Please come back and try again when you are ready to purchase a brick.
         </div>
       </article>
   <script src="script.js"></script>
 </body>
</html>
```
We can test these by turning the button into an <a> tag and adding the file name as the href inside the script.js:
 
 ```
 let newBrickButton = document.createElement('a');
 newBrickButton.className = "button is-dark";
 newBrickButton.innerHTML = "Buy this brick"
 newBrickButton.href = "cancel.html"
 ```
 
Alrighty, this brings us to Part 3 - connecting the parts!
 

## Part 3: Connecting the Parts
Going back to our Server, we’ll notice the `YOUR_DOMAIN` constant. Set that as your Repl.it “frontend” url.
Eg my frontend url is: `https://MySitesCheckoutWithStripe.thisiscarla.repl.co` as you can see below:
![URL](https://repl.it/@ThisisCarla/BrickSite#images/11.png)

Now within the `create-checkout-session` post request, we need to do a couple of things, the first is to define the payment methods available:
```
   payment_method_types: ['card'],

```

Next is to define the line items, we want to add our own content here that would get passed from the frontend Repl.it, so we define the product inventory information based on what is sent through to the frontend:

```
   line_items: [
     {
       price_data: {
         currency: 'usd',
         product_data: {
           name: req.body.name,
           images: req.body.images,
           description: req.body.description,
           price: req.body.price
         },
         unit_amount: 2000,
       },
       quantity: 1,
     },
   ],

```

Next, we need to define the mode - there are three options supported by Stripe: ‘payment’, ‘subscription’ or ‘setup’. One time purchases use the ‘payment’ mode.    

```
mode: 'payment'
```

Lastly, we need to define the success and cancel pages - the same pages we created earlier on the frontend.

```
   success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
```

All together, the index.js of the serverside Repl now looks as follows:
```
const YOUR_DOMAIN = 'https://YOURSITE.repl.co';
 
app.post('/create-checkout-session', async (req, res) => {
 
 const session = await stripe.checkout.sessions.create({
   payment_method_types: ['card'],
   line_items: [
     {
       price_data: {
         currency: 'usd',
         product_data: {
           name: req.body.name,
           images: req.body.images,
           description: req.body.description,
           price: req.body.price
         },
         unit_amount: req.body.price,
       },
       quantity: 1,
     },
   ],
   mode: 'payment',
   success_url: `${YOUR_DOMAIN}/success.html`,
   cancel_url: `${YOUR_DOMAIN}/cancel.html`,
 });
 res.json({ id: session.id });
});
 
app.listen(4242, () => console.log('Running on port 4242'));
```

### Back to BrickSite

First, we need to add Stripe as a CDN dependency to our site, to do this, paste the following:
```
   <script src="https://js.stripe.com/v3/"></script>
```
Between the `<head> ... </head>` tags of your index.js.

Next, we copy across the prebuilt checkout page’s html script content into our script.js.


Now replace the onclick for the brick buttons in the for loop. This way each of them will trigger a call to `/create-checkout-session` when clicked.


```
newBrickButton.addEventListener("click", function () {
   fetch("/create-checkout-session", {
     method: "POST",
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       name: BRICKS[i].name,
       images: BRICKS[i].images,
       description: BRICKS[i].desc,
       price: BRICKS[i].cost
     })
   })
     .then(function (response) {
       return response.json();
     })
...
```
