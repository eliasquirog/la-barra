// Definimos nuestra clase modelo de producto
class combo {
    constructor(comida, imgSrc, precio) {
        this.comida = comida
        this.imgSrc = imgSrc
        this.precio = precio
    }
}

// Generamos nuestros productos
const combo1 = new combo('Hamburguesa', '/imagenes/hamburguesa-img.jpg', 650)
const combo2 = new combo('Pizza', '/imagenes/Pizza-img.jpg' , 850)
const combo3 = new combo('Papas fritas', '/imagenes/papas-fritas-img.jpg', 500)
const combo4 = new combo('Sandwich', '/imagenes/Sandwich-img.jpg', 450)
const combo5 = new combo('Empanadas', '/imagenes/Empanadas-img.jpg', 700)
const combo6 = new combo('Panchos', '/imagenes/hot-dog-img.jpg', 200)


// Creamos un array con todos nuestros productos dentro
const productos = [combo1, combo2, combo3, combo4, combo5, combo6]

// Creamos un array el cual los productos queden guardados en el local storage
let carrito = JSON.parse(localStorage.getItem('carrito')) || []


// Guardamos la referencia de nuestro div donde se renderizaran nuestros productos
const cardContainer = document.querySelector('#cardContainer')

// Por cada producto generamos una nueva card y activamos el fetch para hacer peticiones
const cargarProducto = () => {
fetch("../prductos.json")
.then((resp) => resp.json())
.then((productos) => {
productos.forEach((producto) => {
    const card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `
            <h3 class="cardTitle"> ${producto.comida} </h3>
            <img src="${producto.imgSrc}" class="cardImg">
            <span class="cardPrice"> $${producto.precio} </span>
            <button data-id="${producto.comida}" class="buttonCTA"> Agregar al Carrito </button>
        `
    cardContainer.append(card)
  })
    const botonesCompra = document.querySelectorAll('.buttonCTA');
    botonesCompra.forEach((botonCompra) => {
    botonCompra.addEventListener('click', agregarProducto);
    
  })
})
}
 cargarProducto()

// Creamos una variable para que cada producto seleccionado, quede en el carrito
const carritoConteiner = document.querySelector('#carritoConteiner')

const imprimirCarrito = () => {
    carritoConteiner.innerHTML = ""
    carrito.forEach((producto) => {
        const cartRow = document.createElement('div')
        cartRow.className = 'cartRow'
        cartRow.innerHTML = `
        <div class="cartImg">
        <img src="${producto.imgSrc}">
        </div>
        <button data-id="${producto.comida}" id="botonX">X</button>
        <div class="cartTitle"><span> combo ${producto.comida}</span></div>
        <div class="cartPrice"><span> $${producto.precio}</span></div>
        `
        carritoConteiner.append(cartRow)
        eliminarArticulo()
    })
}
//le damos una funcion al boton X al lado del articulo
const eliminarArticulo = () => {
    const botonX = document.querySelectorAll("#botonX");
    botonX.forEach((button) => {
      button.addEventListener("click", (e) => {
        const item = e.target.getAttribute(`data-id`);
        carrito = carrito.filter((e) => e.comida != item);
        e.target.parentElement.remove();
        localStorage.setItem("carrito", JSON.stringify(carrito));
      });
    });
  };

// Cuando el usuario haga click en un boton, a traves del parametro e nos va a llegar cual es el boton en cuestion. 
const agregarProducto = (e) => {
    // Al acceder a target accedemos al nodo y con getAttribute accedemos al atributo donde nosotros guardamos el valor de referencia 
    const productoElegido = e.target.getAttribute('data-id')
    // Una vez que tenemos el valor de referencia que guardamos en el boton hacemos una busqueda (find) en el array original de productos (el mismo que usamos para mostrarlos) y este nos va a devolver todo el objeto que coincida con la busqueda (buscar por el mismo dato que enviamos a data-id)
    const producto = productos.find((producto) => producto.comida ==  productoElegido)
    // Una vez tenemos todo el objeto, lo enviamos al carrito y ya tenemos nuestro primer producto seleccionado!
    carrito.push(producto)
    imprimirCarrito()
    localStorage.setItem("carrito", JSON.stringify(carrito))
    //agregamos la libreria toastify a la hora de seleccionar el producto
    Toastify({
       text: `El combo de ${productoElegido} fue agregado al carrito!`,
        duration: 2000,
      }).showToast();
     }

// Una vez que nuestras cards se renderizaron, accedemos a todos nuestros botones a traves de la clase en comun y le agregamos la escucha del evento click
const botonesCompra = document.querySelectorAll('.buttonCTA')
botonesCompra.forEach ((botonCompra) => {
    botonCompra.addEventListener('click', agregarProducto)
})


//le damos una funcion al boton borrar carrito
const VaciarCarrito = () => {
    if (localStorage.getItem('carrito')) {
        localStorage.removeItem('carrito')
    }
    carrito = []
    imprimirCarrito()
}

const vaciarCarritoBtn = document.querySelector('#VaciarCarrito')
vaciarCarritoBtn.addEventListener('click', VaciarCarrito)

//darle funcion al boton de comprar carrito mediante libreria
document.querySelector("#enviarC").addEventListener('click', () => {
    Swal.fire(
        'exelente!',
        'su carrito de compras fue enviado!',
        'success'
      )  
      carrito = []
      VaciarCarrito()
})

