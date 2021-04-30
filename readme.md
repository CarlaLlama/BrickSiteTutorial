# Build Your Online Store's Checkout Process with Stripe on Replit

Are you looking for an integrated solution for your site’s checkout process, without having to resort to plugins? This tutorial provides a step-by-step approach to integrating Stripe with Replit!

We'll need a frontend and a backend, both hosted on Replit. You can view the completed parts here:
Server side: https://replit.com/@ThisisCarla/MySitesCheckoutWithStripe#index.js
Frontend: https://replit.com/@ThisisCarla/BrickSite#index.html

We'll cover both of these parts below.

## Part 1: Start Your Replit Stripe Server

Let's get started!

1. Log into your [Replit](https://replit.com) account, or [create one now](https://replit.com/signup) if you haven't already.
2. Click on the "+" button in the top right, and create a new repl. 
3. Select Node.js as your language, and name the repl whatever you like. 

![Picking a repl](images/1.png)

Next, pick the Express server template. It’ll provide the framework to integrate with Stripe from a server. 

Giving it a run generates the following:

![Running the repl](images/2.png)

Terrific! We’re already “hosting” our server with Replit.

Next, we need to install the Stripe SDK. We can do this by running the following in your repl shell:
 
`npm install --save stripe ` 

Now we need a Stripe account, so let's [create one](https://stripe.com/).

Then head on over to the integration walkthrough here: https://stripe.com/docs/checkout/integration-builder 

Now copy-paste the walkthrough code into `index.js`:
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

Let's break down what we have just done. 

This is the shell of the endpoint we'll be sending a POST request to, from the frontend:
```
app.post('/create-checkout-session', async (req, res) => {
	// Stuff goes here
});
```
Inside this request, we'll create the Checkout Session with Stripe, and return the Session id, which the frontend will use to redirect to Stripe's checkout page:

```
const session = await stripe.checkout.sessions.create({
   //
 });
 res.json({ id: session.id });

```

We'll go over the contents of this request in Part 3.

You may have noticed that the integration builder has hardcoded our API key. This isn’t great.

Luckily, Replit supports environment variables using a .env file. [Check out the .env tutorial here](https://docs.repl.it/tutorials/08-storing-secrets-and-history). 

To implement this, add a `.env` file to the root of your project and set your stripe key there. This will block our API key.
Referring to an env variable in node is done by referencing `process.env.VARIABLENAME`.

The contents of your .env will look like this:
```
STRIPE_KEY=sk_test_51IKlwdAhJUZ4ZUqHFBRpOTbbNVakSMbHbouhVH89YPszHcOftinFd6Vi5oOOaY1HZ1PDNmOfiKEEdR03vOqeaHWU00TnpDSj8N
```

![Our .env](images/5.png)


Before we continue, there are a couple of extra config elements we must enable to make sure our frontend and server-side can communicate. These are:

1. Adding body parsing

This will allow us to pass request body from the frontend to the server-side. Just add the following lines after `const app = express();`:

```
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
```

2. Enabling cors

This will allow us to accept body content on the server-side. We need to add the cors dependency. Import the package by typing the following in the console:

```
npm install --save cors
```

Now import cors at the top of `index.js`:

```
const cors = require('cors');
```

Then add the following line after the two lines we added in step 1:

```
app.use(cors());
```

The full code now looks like this:
```
const stripe = require('stripe')('sk_test_51IKlwdAhJUZ4ZUqHFBRpOTbbNVakSMbHbouhVH89YPszHcOftinFd6Vi5oOOaY1HZ1PDNmOfiKEEdR03vOqeaHWU00TnpDSj8N');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

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

You’ll notice the Stripe code requires a `YOUR_DOMAIN` variable, that’s currently set to https://localhost:4242. In order to link this with our site, we need to actually create one. Enter Part 2 – Buying the bricks with a repl frontend!


## Part 2: Buying the Bricks With a Repl Frontend

In this next section, we want to make a site that’ll act as the site we can buy stuff from, and connect it to our Stripe integration we created in Part 1.

To do this, we’ll start off with a new repl, using the “basic HTML,CSS, JS” language option. Call it something like "BrickSite". 

We’ll create a one page application with minimal functionality – a static list of bricks that a user can buy. Each brick has a price, a name, a description and an image. A "buy" button will allow the user to purchase a brick.

You can find the complete code here: https://repl.it/@ThisisCarla/MySite#index.html .

### 1. Making BrickSite
Our first step is to add the Bulma styling library. It’s a great way to style BrickSite with little effort. We’ll include the CDN by replacing the default `rel=”stylesheet”` with the Bulma CDN.

*Nifty-tip!* Searching “bulma” in the packages tab in our Replit IDE means we can insert it automatically. See here:
![Auto adding Bulma](images/6.png)

This inserts the following into our head tag of `index.html`:
```
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css" />
```

First, we want to create a list of bricks a user can buy. Each brick has its own name, description, predefined styles, price and image. We paste this in our `script.js`:

```
const BRICKS = [
  {
    "name": "Brickson Brick",
    "desc": "this is a plain brick",
    "style": "is-info",
    "cost": 1,
    "images": ["https://www.kulucrete.co.za/website/wp-content/uploads/2016/11/smooth-brick.jpg"]
  },
  {
    "name": "Bricketty Brick",
    "desc": "this is a cooler brick",
    "style": "is-warning",
    "cost": 5,
    "images": ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJc_W56qiCUiHHECVkar1jKQSrTniYAaqL_g&usqp=CAU"]
  },
    {
    "name": "MyBrickerty McBrickson",
    "desc": "this is the best brick",
    "style": "is-success",
    "cost": 100,
    "images": ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6LWKwpEFAfNXgPT6Ot5xdjHbqoKYa6ktG0g&usqp=CAU"]
  }
];
```

In order to display these bricks, we want to add some basic html that we can dynamically add content to on render. We define the following `body` after the closing `</head>` tag and within the `<html>` tags of our `index.html`:

```
  <body>
    <div class="section">
      <div class ="container">
        <div class="title"> My Site to Buy Bricks </div>
        <div id="bricks" class="tile is-ancestor">
        </div>
      </div>
    </div>
    <script src="script.js"></script>
  </body>
```

We'll be dynamically adding our array of bricks to the `id=bricks` div tag.

The full code for `index.js` is:
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>BrickSite</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css" />
    <script src="https://js.stripe.com/v3/"></script>
  </head>
  <body>
    <div class="section">
      <div class ="container">
        <div class="title"> My Site to Buy Bricks </div>
        <div id="bricks" class="tile is-ancestor">
        </div>
      </div>
    </div>
    <script src="script.js"></script>
  </body>
</html>
```

Now, going back to our `script.js`, we want to add some good ol’ dynamic vanilla JS elements to the content on the page. For every brick in the BRICKS array, we've created a div element, added it's own name, styling, content and button, and then added it to the DOM.

We add the following content in order:

For each brick in our predefined list:

```
for (var i = 0; i < BRICKS.length; i++) {

```

Add a new `div` to the DOM and give it some styling (predefined by bulma so we don't need to do the css ourselves):

```
 let newBrick = document.createElement('div');
 newBrick.className = "tile is-parent";
```

Add an `article` element on the document and give it some styling. Each brick has its own style defined in the `BRICKS` array, so use this in the class definitions:

```
 let newBrickArticle = document.createElement('article');
 newBrickArticle.className = "tile is-child notification " + BRICKS[i].style;
```

Create a new `p` element on the document, give it title styling and make the text (`innerHTML`) the name of the brick:

```
 let newBrickTitle = document.createElement('p');
 newBrickTitle.className = "title";
 newBrickTitle.innerHTML = BRICKS[i].name;
```

Do the same with the brick's description:

```
 let newBrickDesc = document.createElement('p');
 newBrickDesc.className = "subtitle";
 newBrickDesc.innerHTML = BRICKS[i].desc;
```

And show the brick's price by adding a new `div` with the price in a little description:

```
 let newBrickCost = document.createElement('div');
 newBrickCost.className = "box";
 newBrickCost.innerHTML = "This brick costs: $" + BRICKS[i].cost;
```

Lastly, add the `a` element for purchasing the brick with some styling and text. Also give it an id that's the number of the brick, so we know what content to pass to the method when the button is clicked. We'll create the `onclick` method and functionality for this later on:

```
  let newBrickButton = document.createElement('a');
  newBrickButton.id = i;
  newBrickButton.className = "button is-dark";
  newBrickButton.innerHTML = "Buy this brick"
```

Now, add the new title, description, cost and button elements to the `article` element:

```
 newBrickArticle.appendChild(newBrickTitle);
 newBrickArticle.appendChild(newBrickDesc);
 newBrickArticle.appendChild(newBrickCost);
 newBrickArticle.appendChild(newBrickButton);
```

And, finally, add the `article` to the parent brick `div` and append it as a child to the `div` we defined as `id="bricks"` in our `index.html`; and close the for loop:

```
 newBrick.appendChild(newBrickArticle);
 document.getElementById("bricks").appendChild(newBrick);   
}
 ```

Altogether, our script.js now looks like this:
```
const BRICKS = [
  {
    "name": "Brickson Brick",
    "desc": "this is a plain brick",
    "style": "is-info",
    "cost": 1,
    "images": ["https://www.kulucrete.co.za/website/wp-content/uploads/2016/11/smooth-brick.jpg"]
  },
  {
    "name": "Bricketty Brick",
    "desc": "this is a cooler brick",
    "style": "is-warning",
    "cost": 5,
    "images": ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJc_W56qiCUiHHECVkar1jKQSrTniYAaqL_g&usqp=CAU"]
  },
    {
    "name": "MyBrickerty McBrickson",
    "desc": "this is the best brick",
    "style": "is-success",
    "cost": 100,
    "images": ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6LWKwpEFAfNXgPT6Ot5xdjHbqoKYa6ktG0g&usqp=CAU"]
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

  let newBrickButton = document.createElement('a');
  newBrickButton.id = i;
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

Referring back to the server's endpoint code that we got from the Stripe walkthrough, you'll notice it requires both a `success.html` and a `cancel.html`. Let’s make new files for these in the root of our repl.

Here’s the code for the success page - `success.html`:
![Success page](images/9.png)


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
![Failure page](images/10.png)

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
We can test these by adding the file name as the button's href inside the script.js:
 
 ```
 newBrickButton.href = "cancel.html"
 ```
 
Alright, now that we have the groundwork on the frontend. This brings us to Part 3 – connecting the parts!
 

## Part 3: Connecting the Parts
Going back to our server Replit, we’ll notice the `YOUR_DOMAIN` constant. Set that as your Replit “frontend” url.

E.g., My frontend url is: `https://MySitesCheckoutWithStripe.thisiscarla.repl.co` as you can see below:
![URL](images/11.png)

Replace `YOUR_DOMAIN` with the frontend url:

```
const YOUR_DOMAIN = 'https://MySite.thisiscarla.repl.co';
```

Now, within the `create-checkout-session` post request, we need to do a couple of things. The first is to define the payment methods available:
```
   payment_method_types: ['card'],

```

Next is to define the `line items`. We want to add our own content here that would get passed from the frontend Replit, so we define the product inventory information based on what is sent through to the frontend:

```
  line_items: [
    {
      name: req.body.name,
      images: req.body.images,
      description: req.body.desc,
      amount: req.body.price,
      currency: 'usd',
      quantity: 1,
    },
  ],
```

Next, we need to define the mode. There are three options supported by Stripe: `payment`, `subscription` or `setup`. One-time purchases use the `payment` mode.    

```
mode: 'payment'
```

Lastly, we need to define the success and cancel pages; the same pages we created earlier on the frontend.

```
  success_url: `${YOUR_DOMAIN}/success.html`,
  cancel_url: `${YOUR_DOMAIN}/cancel.html`,
```

Altogether, the index.js of the server-side repl now looks as follows (with a `console.log` line added inside our request so that we can confirm the incoming request body):
```

const Database = require("@replit/database");
const db = new Database()
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_KEY);
var cors = require('cors')

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const YOUR_DOMAIN = 'https://MySite.thisiscarla.repl.co';


app.post('/create-checkout-session', async (req, res) => {
  console.log("REQUEST", req.body);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        name: req.body.name,
        images: req.body.images,
        description: req.body.desc,
        amount: req.body.price,
        currency: 'usd',
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

First, we need to add Stripe as a CDN dependency to our site. To do this, paste the following between the `<head> ... </head>` tags of your `index.js`:
```
   <script src="https://js.stripe.com/v3/"></script>
```

Now, going back to `script.js`, we want to define a new instance of Stripe with your publishable API key (you will find this in the Load Stripe.js section of the [Integration Builder walkthrough](https://stripe.com/docs/checkout/integration-builder)):
```
 var stripe = Stripe(YOUR_API_KEY);
```

Next we want to create `onclick` event listeners to our button definitions so that we can initiate the purchase when the button is clicked.

Underneath the button definitions in `script.js`, add the following:
```
  newBrickButton.onclick = buttonClick;
```
Now, at the bottom of the page, we want to define the function `buttonClick` as the function that will execute when the button is clicked.

```
async function buttonClick(event) {

}
```

Inside `buttonClick`, we paste the prebuilt checkout page’s html script content from the "Fetch a Checkout Session" section of the [Integration builder walkthrough](https://stripe.com/docs/checkout/integration-builder):

```
async function buttonClick(event) {
  fetch("/create-checkout-session", {
    method: "POST",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (session) {
      return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(function (result) {
      // If redirectToCheckout fails due to a browser or network
      // error, you should display the localized error message to your
      // customer using error.message.
      if (result.error) {
        alert(result.error.message);
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
}
```

This way, each button will trigger a call to our server endpoint `/create-checkout-session` when clicked.

We need to add a couple more things to allow fetch to function.

At the very top of the `buttonClick` method, add the following to enable registering the window event of 'clicking':
```
event = event || window.event;
var target = event.target || event.srcElement;
```

Next, we want to reference the brick that we clicked on. Each brick has an id that we can refence it by, that corresponds with its index in the `BRICKS` array. We get and parse the id as follows:

```
var id = target.id;
let i = parseInt(id);
```

At the moment, the code is dispatching a POST request to `/create-checkout-session`, which isn't exactly right. We want it to be to `SERVER_URL/create-checkout-session`. Let's create a constant that's the URL and change the request destination as follows:

```
const API_URL = "https://MySitesCheckoutWithStripe.thisiscarla.repl.co";
  
return fetch(API_URL + "/create-checkout-session", {
  ...
```

Inside the `fetch` request declaration and underneath `method: "POST"`, we want to add the following to enable cors and allow json content to be sent:

```
mode: 'cors',
headers: {
  'Content-Type': 'application/json'
},
```

Underneath this, we now want to send our body content. This will allow us to send the brick details to Stripe on the server-side, so that it can display it on the checkout page:

```
body: JSON.stringify({
  name: BRICKS[i].name,
  images: BRICKS[i].images,
  desc: BRICKS[i].desc,
  price: BRICKS[i].cost * 100
})
```

(We need to multiply the price by 100 because Stripe uses cents definition for pricing so `price: 100` equals $1).

Altogether, the content of `script.js` now looks like:

```
const BRICKS = [
  {
    "name": "Brickson Brick",
    "desc": "this is a plain brick",
    "style": "is-info",
    "cost": 1,
    "images": ["https://www.kulucrete.co.za/website/wp-content/uploads/2016/11/smooth-brick.jpg"]
  },
  {
    "name": "Bricketty Brick",
    "desc": "this is a cooler brick",
    "style": "is-warning",
    "cost": 5,
    "images": ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJc_W56qiCUiHHECVkar1jKQSrTniYAaqL_g&usqp=CAU"]
  },
    {
    "name": "MyBrickerty McBrickson",
    "desc": "this is the best brick",
    "style": "is-success",
    "cost": 100,
    "images": ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6LWKwpEFAfNXgPT6Ot5xdjHbqoKYa6ktG0g&usqp=CAU"]
  }
];

 var stripe = Stripe("pk_test_51IKlwdAhJUZ4ZUqHO9ukmofCvmpp4ttlqsSpupeTYwiDJTYOVnh2n0xNYhYzP9Tkw3ddNXGe5LZliOGu3f8sxX6N001zb0122M");


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

  let newBrickButton = document.createElement('a');
  newBrickButton.id = i;
  newBrickButton.className = "button is-dark";
  newBrickButton.innerHTML = "Buy this brick"
  newBrickButton.onclick = buttonClick;

  newBrickArticle.appendChild(newBrickTitle);
  newBrickArticle.appendChild(newBrickDesc);
  newBrickArticle.appendChild(newBrickCost);
  newBrickArticle.appendChild(newBrickButton);

  newBrick.appendChild(newBrickArticle);
  document.getElementById("bricks").appendChild(newBrick);    
}

async function buttonClick(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;

    var id = target.id;
    let i = parseInt(id);

    const API_URL = "https://MySitesCheckoutWithStripe.thisiscarla.repl.co";
      
    return fetch(API_URL + "/create-checkout-session", {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: BRICKS[i].name,
        images: BRICKS[i].images,
        desc: BRICKS[i].desc,
        price: BRICKS[i].cost * 100
      })
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (session) {
        return stripe.redirectToCheckout({ sessionId: session.id });
      })
      .then(function (result) {
        // If redirectToCheckout fails due to a browser or network
        // error, you should display the localized error message to your
        // customer using error.message.
        if (result.error) {
          alert(result.error.message);
        }
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
}
```


## Let's Get Testing

To test, make sure the server-side is running. You can confirm this by making sure you see the "Stop" button at the top:
![New tab icon](images/18.png)

Now go back to the frontend, and press "Run" there too. Unlike the server-side, it won't continue to say "Stop", but it is running. Now we are ready to attempt to buy a brick by clicking on a brick's "buy" button.

### Debugging
Once running the request, you may get the error:
```
UnhandledPromiseRejectionWarning: Error: In order to use Checkout, you must set an account or business name at https://dashboard.stripe.com/account.
```

To fix this, follow the link and add a company name on your Stripe dashboard.

You may also get the error "Does not have permission to redirect" after clicking on "Buy this brick" using the Replit browser preview mode. In order to avoid this, open the frontend in a new tab by clicking on the new tab icon:

![New tab icon](images/14.png)



### We are ready to buy a brick

![In a new tab](images/15.png)

I've chosen to buy a Bricketty Brick. Clicking on "Buy this brick" redirects to the Stripe session checkout page thanks to our server-side creating the session and sending the session id back to the frontend:

![Checkout page](images/16.png)

Now, test the purchase process by entering the Stripe test payment card details:

```
Card number: 4242 4242 4242 4242 
```

Email address, expiry date, CVV and name on card can be anything. Pressing "Pay $5.00" should redirect to our `success.html` page:

![Success](images/17.png)

We've successfully made a purchase with Stripe!
