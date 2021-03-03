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
  newBrickButton.innerHTML = "Buy this brick";

  newBrickArticle.appendChild(newBrickTitle);
  newBrickArticle.appendChild(newBrickDesc);
  newBrickArticle.appendChild(newBrickCost);

  newBrick.appendChild(newBrickArticle);
  document.getElementById("bricks").appendChild(newBrick);    
}

