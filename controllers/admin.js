const Product = require('../models/product');

exports.getAddProduct=(req,res,next)=>{
    res.render('admin/edit-product',
    {layout:false,
    pageTitle:'Add Product',
     path:"/admin/add-product",
     editing:false
    })
};

exports.postAddProduct = (req,res,next)=>{

    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    
/* another way to doing below senario
    Product.create({  //no need to save. it auto save into db
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        userId: req.user.id
    })
 */   
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description 
    }).then(result=>{
        //console.log(result)
        console.log('Created product');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));

/*
    ======without sequelization=====
    const product = new Product(null,title,imageUrl,description,price);
   // console.log(req.body.title);
    product.save()
    .then(()=>{
        res.redirect('/')
    })
    .catch(err => console.log(err));
*/    
};

exports.getEditProduct=(req,res,next)=>{
   // console.log('came here');
    // get quary para meters
    const editMode = req.query.edit;
    if(!editMode){
        console.log('edit mode off')
        return res.redirect('/');
    }

    const prodId = req.params.productId;
   // Product.findByPk(prodId)
   //.then()
   //.catch()
    req.user.getProducts({where : {id:prodId}})
        .then(products=>{
        //   console.log(prodId)
         //  console.log(product)
           //if there is no such product
           const product= products[0];
           if(!product){
               console.log('sry')
               return res.redirect('/');
           }
           // product is exsist
           res.render('admin/edit-product',
               {
               pageTitle:'Edit Product',
               path:"/admin/edit-product",
               editing:editMode,
               product:product
               }
           );
       }).catch(err => console.log(err));
    
};

exports.postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;

    Product.findByPk(prodId)
        .then(product=>{
            product.title=updatedTitle;
            product.price=updatedPrice;
            product.description=updatedDescription;
            product.imageUrl=updatedImageUrl;
            return product.save();
        })
        .then(result=>{
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));


    // const updatedProduct = new Product(prodId,updatedTitle,updatedImageUrl,updatedDescription,updatedPrice);
    // updatedProduct.save();
     
};

exports.postDeleteProduct = (req,res,next)=>{
    prodId= req.body.productId;
    //console.log('came to controller postDelete')

    Product.findByPk(prodId)
        .then(product =>{
            return product.destroy();
        })
        .then(result=>{
            console.log('DESTROYED PRODUCT');
            res.redirect('/admin/products');
        })
        .catch(err=> console.log(err));


    //Product.deleteById(prodId);
    

}

exports.getProducts = (req,res,next) => {
    req.user.getProducts()
    .then(products=>{
        res.render('admin/products', { 
            prods: products, 
            pageTitle: 'Admin Products', 
            path: '/admin/products', 
            
        });

    }).catch(err => console.log(err))
}