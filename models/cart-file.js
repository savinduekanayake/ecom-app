const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {

    static addProduct(id, productPrice){
        //Fetch the previous cart
        fs.readFile(p,(err,fileContent)=>{
            let cart = {products:[] , totalPrice:0}
            if(!err){
                cart= JSON.parse(fileContent);
            }

            //analyze the cart => find exist product
            const existingProductIndex = cart.products.findIndex(prod=> prod.id == id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;

            //add new product/increase quantity
            if(existingProduct){
                updatedProduct = { ...existingProduct};
                updatedProduct.qty = updatedProduct.qty+1;
                //get previous cart and replace the new product to the previous cart
                cart.products= [...cart.products];
                cart.products[existingProductIndex]= updatedProduct;
            }else{
                updatedProduct = {id:id, qty:1};
                cart.products = [ ...cart.products,updatedProduct];
            }
            //increase price and write to the file
            cart.totalPrice = +cart.totalPrice + +productPrice;
            fs.writeFile(p,JSON.stringify(cart),(err)=>{
                console.log(err);
            });
        });
        
        
    };

    static deleteById(id,productPrice){
        fs.readFile(p,(err,fileContent)=>{
            if(err){
                return;
            }
            
            const updateCart = { ...JSON.parse(fileContent) }
            const product = updateCart.products.find(prod=>prod.id === id);
            
            if(!product){
                return;
            }

            updateCart.products = updateCart.products.filter(
                prod=> prod.id !== id
            );
            
            updateCart.totalPrice = updateCart.totalPrice-productPrice*product.qty;
            fs.writeFile(p,JSON.stringify(updateCart),(err)=>{
                // console.log(err);
                if(!err){
                    console.log('succesfully update cart');
                }
                
            });
        });
    }

    static getCart(cb){
        fs.readFile(p,(err,fileContent)=>{
            const cart = JSON.parse(fileContent);
            if(err){
                cb(null)
            }else{
                cb(cart);
            }
            
        });
    }

};