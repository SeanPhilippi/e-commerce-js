// style cart items
// make a product page for single product, where select element can be
// used to select quantity to be added to cart with add to cart btn

let cart = [];

const moreDetails = id => {
  let detailsDiv = document.getElementById(id);
  if (detailsDiv) {
    detailsDiv.style.visibility === "visible" ? detailsDiv.style.visibility = "hidden": detailsDiv.style.visibility = "visible";
  }
}

const calculateCartTotal = () => {
  let amounts = document.getElementsByClassName("amount");
  let total = 0;
  for (let i = 0; i < amounts.length; i++) {
    const amount = parseFloat(amounts[i].innerText.replace('$', ''));
    total = total + amount;
    total = Math.round(total * 100) / 100;
  }
  let cartTotal = document.getElementById('cart-total');
  cartTotal.innerText = "$" + total;
}

function displayProducts(products, searchWord) {
  let productsDiv = "";
  let detailsButton = document.createElement('button').value = "More Details";
  let toCartButton = document.createElement('button').value = "Add to Cart";
  let noResults = `<h2>Sorry no results were found for "${searchWord}"</h2>`;

  if (products.length > 0) {
    for (let i =0; i < products.length; i++) {
      let product = products[i];
      productsDiv += `
<li class="product">
  <div class="name">
    ${product.name}
  </div>
  <div
    class="image"
    style="background-image: url(${product.imgUrl}";)
  >
  </div>
  <div
    style="visibility: hidden;"
    id="${product.id}"
    class="details"
  >
    <div>
      ${product.description}
    </div>
    <div>
      ${product.price}
    </div>
  </div>
  <div class="button-container">
    <button onclick="moreDetails(${product.id})">
      ${detailsButton}
    </button>
    <button
      onclick="addToCart(${product.id});
      calculateCartTotal();"
    >
      ${toCartButton}
    </button>
  </div>
  <section class="reviews">
    <div>
      Reviews
    </div>
    <div class="review-preview">
      <div class="review-inner">
        <span>${
          product.reviews.map(review => {
            return `
<p>${review.description}</p>
<span>${makeStars(Number(review.rating))}</span>
`
          }).join(' ')
        }</span>
      </div>
    </div>
  </section>
</li>
`;
      document.getElementById("products").innerHTML= productsDiv;
    }
  } else {
    document.getElementById("products").innerHTML= noResults;
  }
}

const makeStars = num => {
  let stars = "";
  let star = '<i class="fa fa-star" aria-hidden="true"></i>';
  let emptyStar = '<i class="fa fa-star-o" aria-hidden="true"></i>';
  for (let i = 0; i < num; i++) {
    stars = stars + star
  };
  for (let j = 0; j < (5-num); j++) {
    stars = stars + emptyStar;
  }
  return stars;
}

const populateCart = () => {
  let cartItems = document.getElementById('cart-items');
  if (fetchedCartItems) {
    fetchedCartItems.forEach(product => {
      let li = document.createElement('li');
      li.appendChild(document.createTextNode(product.name));
      cartItems.appendChild(li);
      let price = document.createElement('span');
      price.className = "amount";
      price.style.paddingLeft = "10px";
      price.appendChild(document.createTextNode(product.price));
      li.appendChild(price);
    });
  }
  // calculateTotal after populating cart
  calculateCartTotal();
}

// on page load
displayProducts(products);
let fetchedCartItems = JSON.parse(sessionStorage.getItem('cart')) || [];
cart = fetchedCartItems;
populateCart();

// immediately invoked function, event listener for search input changes
(function() {
  let oldVal;

  $('#search-box').on('change textInput input', () => {
    const val = this.document.getElementById('search-box').value;
    if (val !== oldVal) {
      oldVal = val;
      checkLength(val);
    }
  });
}());

const checkLength = val => {
  if (val.length > 3) {
    search(val);
  } else if (val.length === 0) {
    displayProducts(products);
  }
}

const addToCart = id => {
  let cartItems = document.getElementById('cart-items');
  let product = products.find(product => product.id == id);
  let li = document.createElement('li');
  li.appendChild(document.createTextNode(product.name));
  cartItems.appendChild(li);
  let price = document.createElement('span');
  price.className = "amount";
  price.style.paddingLeft = "10px";
  price.appendChild(document.createTextNode(product.price));
  li.appendChild(price);
  // add to cart array for storage in sessionStorage
  cart.push(product);
  sessionStorage.setItem('cart', JSON.stringify(cart));
}

const search = value => {
  let searchWord = value.toLowerCase().trim();
  let filteredProducts = products.filter(p => {
    // return product names that include searchWord, else return empty array
    return p.name.toLowerCase().includes(searchWord) && p.name;
  })
  displayProducts(filteredProducts, searchWord);

}