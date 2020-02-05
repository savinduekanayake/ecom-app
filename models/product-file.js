const products = [];
const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductFromFile=(callBack)=>{

    fs.readFile(p,(err,fileContent)=>{
        if(err){
            //if empty file
            callBack([]);
        }else{
            callBack(JSON.parse(fileContent));
        }
//return not as a string using JSON.parse
        
    });
}

module.exports = class Product {
    constructor(id,title,imageUrl,description,price) {
        this.id=id;
        this.title = title;
        this.imageUrl=imageUrl;
        this.description=description;
        this.price=price;
        
    }

    save() {
        
       // console.log('hi2')
        getProductFromFile(products =>{
            if(this.id){
                // if id is already existing/when update a product
                const existingProductIndex = products.findIndex(prod=> this.id === prod.id);
                let updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts),(err)=>{
                    console.log(err);
                });
            }else{
                //newly added product
                this.id = Math.random().toString();
                products.push(this);

                fs.writeFile(p, JSON.stringify(products),(err)=>{
                    console.log(err);
                });
            }
        });
    }

    static deleteById(id){
        getProductFromFile(products=>{
            // const deleteProductIndex = products.findIndex(prod=>prod.id===id);
            
            // if (deleteProductIndex > -1) {
            //     console.log(products)
            //     products.splice(deleteProductIndex, 1);
            //     console.log(products);
            //   }
            // fs.writeFile(p, JSON.stringify(products),(err)=>{
            //     console.log(err);
            // });
            //console.log(id)
            // console.log('came to model product deleteById')
            const product = products.find(prod=>prod.id===id);
            const updateProducts = products.filter(prod=>prod.id !== id);
              fs.writeFile(p, JSON.stringify(updateProducts),(err)=>{
                if(!err){
                    console.log('successfully deleted from product')
                    Cart.deleteById(id,product.price);
                }
                
            });
        });
    };

    static fetchAll(callBack) {
     //   console.log('hi')
     getProductFromFile(callBack);
        
    }

    static findById(id,cb){
        getProductFromFile(products =>{
            const product = products.find(p=> p.id==id);
            cb(product);
        })
    }
}
