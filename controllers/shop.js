const Product = require('../models/product');
const Cart = require('../models/cart')
const Order = require('../models/order');

exports.getProducts= (req, res, next) => {
    Product.findAll()
        .then(products=>{
            //console.log(products)
            res.render('shop/product-list', { 
                prods: products, 
                pageTitle: 'All Products',
                path: '/products', 
                
            });
        })
        .catch(err=>console.log(err));
    

};

exports.getProduct= (req, res, next) => {
    const prodId = req.params.productId;

    // Product.findAll({where:{id:prodId}})
    //     .then(products=>{
    //         res.render('shop/product-detail',{
    //             product:products[0],
    //             pageTitle: products[0].title,
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => console.log(err));

    Product.findByPk(prodId)  //findById is replaced in version to findByPk
        .then(product => {
            //console.log(product)
            res.render('shop/product-detail',{
                product:product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
    
    
};

exports.getIndex = (req,res,next)=>{
    Product.findAll()
        .then(products=>{
            //console.log(products)
            res.render('shop/index', { 
                prods: products, 
                pageTitle: 'Shop', 
                path: '/', 
                //hasProducts: Products.length>0
            });
        })
        .catch(err=>console.log(err));
      
};


exports.getCart = (req,res,next)=>{
    req.user.getCart()
    .then(cart => {
        //console.log(cart)
        return cart.getProducts()
        .then(products => {
            res.render('shop/cart',{
                            path: '/cart',
                            pageTitle: 'Your Cart',
                            products: products
                        });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err))



    // Cart.getCart(cart=>{
    //     Product.fetchAll(products=>{
    //         const cartProducts = [];
    //         for(product of products){
    //             const cartProductData =cart.products.find(prod=> prod.id === product.id);
    //             if(cartProductData){
    //                 cartProducts.push({productData : product , qty:cartProductData.qty});
    //             }
    //         }
    //         res.render('shop/cart',{
    //             path: '/cart',
    //             pageTitle: 'Your Cart',
    //             products: cartProducts
    //         });
    //     });
        
        
    // });
    
};
//============================================================================
exports.postCart = (req,res,next)=>{
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart =>{
           // console.log(cart)
            fetchedCart=cart;
            return cart.getProducts({where: {id:prodId}})
        }).then(products=>{
            let product;
            
          //  console.log(products)
            if (products.length > 0){
                product = products[0];
            }
            if(product){
                //if the existing product
                oldQuantity = product.cartItem.quantity;
                newQuantity=oldQuantity+1;
                return product;
            }

            //new product to the cart
            return Product.findByPk(prodId)
         })
        .then(product=>{
            return fetchedCart.addProduct(product ,{
                through: {quantity: newQuantity}
            });
        })
        .then(()=>{
            res.redirect('/cart')
        })
        .catch(err => console.log(err));
    //console.log(prodId)
    //console.log(prodId.split(' ').join(''))
    // Product.findById(prodId.split(' ').join(''),product=>{
    //     //console.log(product)
    //     Cart.addProduct(prodId,product.price);
    // });
    // res.redirect('/cart');
};

exports.postCartDelete = (req,res,next)=>{
    const prodId = req.body.productId;
    req.user.getCart()
        .then(cart=>{
            return cart.getProducts({where:{id:prodId}})
        }).then(products=>{
            product = products[0];
            return product.cartItem.destroy();
        })
        .then(result=>{
            res.redirect('/cart');
        })
        .catch(err => { console.log(err)});

    // Product.findById(prodId,product=>{
    //     Cart.deleteById(prodId,product.price);
    //     res.redirect('/cart');
    // });
    
}


exports.postOrder = (req,res,next)=>{
    let fetchedCart;
    req.user.getCart()
        .then(cart=>{
            fetchedCart=cart;
            return cart.getProducts();
        })
        .then(products=>{
           // console.log(products)
           return req.user.createOrder()
                .then(order=>{
                    order.addProducts(products.map(product=>{
                        product.orderItem = { quantity: product.cartItem.quantity} // orderitem quntitiy setting up
                        return product;
                    }))
                })
                .catch(err=> console.log(err)); 

        })
        .then(result=>{
            return fetchedCart.setProducts(null); //clean the cart
            
        })
        .then(result=>{
            res.redirect('/orders')
        })
        .catch(err=> console.log(err));
}

exports.getOrders = (req,res,next)=>{
    req.user.getOrders({include: ['products']}) // specifiedly get products with orders/load related products with orders
        .then(orders=>{
            res.render('shop/orders',{
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err=>console.log(err))
    
};