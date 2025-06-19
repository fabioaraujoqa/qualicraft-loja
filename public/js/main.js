document.addEventListener("DOMContentLoaded", function () {
  const userId = 1;
  let currentPage = 1;
  const limit = 9;

  function fetchProducts(page) {
    fetch(`/api/produtos?page=${page}&limit=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        const productList = document.getElementById("product-list");
        productList.innerHTML = "";

        data.products.forEach((product) => {
          const productCard = document.createElement("div");
          productCard.className = "col-md-4 mb-4";
          productCard.innerHTML = `
                        <div class="card">
                            <a href="/product.html?id=${product.id}">
                                <img src="${
                                  product.image
                                }" class="card-img-top" alt="${product.name}">
                            </a>
                            <div class="card-body">
                                <legend>
                                    <a href="/product.html?id=${
                                      product.id
                                    }" class="text-dark text-decoration-none">${
            product.name
          }</a>
                                </legend>
                                <p class="card-text">${product.description}</p>
                                <p>Preço: R$${product.price.toFixed(2)}</p>
                                <div class="form-group">
                                    <label for="quantity-${
                                      product.id
                                    }">Quantidade:</label>
                                    <input type="number" id="quantity-${
                                      product.id
                                    }" value="1" min="1" class="form-control w-50 mb-2">
                                </div>
                                <button class="btn btn-primary add-to-cart" data-id="${
                                  product.id
                                }">Adicionar ao Carrinho</button>
                            </div>
                        </div>
                    `;
          productList.appendChild(productCard);
        });

        updatePagination(data.currentPage, data.totalPages);
        setupAddToCart();
      })
      .catch((error) => console.error("Erro ao buscar produtos:", error));
  }

  function updatePagination(current, total) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const prevPageItem = document.createElement("li");
    prevPageItem.className = `page-item ${current === 1 ? "disabled" : ""}`;
    prevPageItem.innerHTML = `<a class="page-link" href="#" data-page="${
      current - 1
    }">Anterior</a>`;
    pagination.appendChild(prevPageItem);

    for (let i = 1; i <= total; i++) {
      const pageItem = document.createElement("li");
      pageItem.className = `page-item ${i === current ? "active" : ""}`;
      pageItem.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
      pagination.appendChild(pageItem);
    }

    const nextPageItem = document.createElement("li");
    nextPageItem.className = `page-item ${current === total ? "disabled" : ""}`;
    nextPageItem.innerHTML = `<a class="page-link" href="#" data-page="${
      current + 1
    }">Próximo</a>`;
    pagination.appendChild(nextPageItem);

    pagination.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const page = parseInt(event.target.getAttribute("data-page"));
        if (page > 0 && page !== currentPage) {
          currentPage = page;
          fetchProducts(currentPage);
        }
      });
    });
  }

  function setupAddToCart() {
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.dataset.id;
        const quantity = document.getElementById(`quantity-${productId}`).value;
        fetch("/api/carrinho", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: 1,
            productId,
            quantity: parseInt(quantity, 10),
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            const alertContainer = document.getElementById("alert-container");
            alertContainer.classList.remove("d-none");
            alertContainer.classList.add("alert-success");
            alertContainer.innerHTML = "Produto adicionado ao carrinho!";
            alertContainer.style.display = "block";
            setTimeout(() => {
              alertContainer.style.display = "none";
            }, 3000);
            updateCartCount(userId);
          })
          .catch((error) =>
            console.error("Erro ao adicionar produto ao carrinho:", error)
          );
      });
    });
  }

  function updateCartCount(userId) {
    fetch(`/api/carrinho/${userId}`)
      .then((response) => response.json())
      .then((cartItems) => {
        const cartCount = cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
        document.getElementById("cart-count").textContent = cartCount;
      })
      .catch((error) =>
        console.error("Erro ao atualizar o contador do carrinho:", error)
      );
  }

  fetchProducts(currentPage);

  // Efeito parallax com o mouse no background
  document.addEventListener("mousemove", function (e) {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    const offsetX = (x - 0.5) * 10; // intensidade horizontal
    const offsetY = (y - 0.5) * 40; // intensidade vertical

    document.body.style.backgroundPosition = `${50 + offsetX}% ${
      50 + offsetY
    }%`;
  });
});
