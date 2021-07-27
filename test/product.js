'use strict';

const { Contract } = require('fabric-contract-api');

class Product extends Contract {

    async Init(stub) {
        console.info("Intialized");
        return shim.success();
      }



      async createProduct(ctx, Productid, Productname, Producttype) {
        console.info('============= START : Create product ===========');

        const product = {
            Productname,
            docType: 'product',
            Producttype
          
        };

        await ctx.stub.putState(Productid, Buffer.from(JSON.stringify(product)));
        console.info('============= END : Create product ===========');
}

async viewParticularProduct(ctx, productId) {
	
    const productKey = ctx.stub.createCompositeKey([productId]);
    let isProductBufferExisting =  await ctx.stub.getState(productKey).catch(err => console.log(err));
    
    let productObject= JSON.parse(isProductBufferExisting.toString());
    if (productObject) {
        return productObject;
    } else {
        throw new Error('Product Asset doesnt exist on the ledger');
    }
}
async viewAllProduct(ctx, startProductKey, endProductKey) {
    const productStartKey = ctx.stub.createCompositeKey([startProductKey]);
    const productEndKey = ctx.stub.createCompositeKey([endProductKey]);

    const iterator = await ctx.stub.getStateByRange(productStartKey, productEndKey);

    const allResults = [];
    while (true) {
        const res = await iterator.next();

        if (res.value && res.value.value.toString()) {
            console.log(res.value.value.toString('utf8'));

            const Key = res.value.key;
            let Record;
            try {
                Record = JSON.parse(res.value.value.toString('utf8'));
                await stub.deleteState(Key)
            } catch (err) {
                console.log(err);
                Record = res.value.value.toString('utf8');
            }
            allResults.push({ Key, Record });
        }
        if (res.done) {
            console.log('end of data');
            await iterator.close();
            console.info(allResults);
            return JSON.stringify(allResults);
        }
    }
}

// Remove Particular Product
async removeProduct(ctx, productId) {

    const productKey = ctx.stub.createCompositeKey([productId]);
    let isProductBufferExisting =  await ctx.stub.getState(productKey).catch(err => console.log(err));
    if (isProductBufferExisting.length == 0) {
        throw new Error('Product Asset doesnt exist on the ledger');
    } else {
        await stub.deleteState(productKey)
    }
    
return `The ${productId} is successfully deleted`;

}

// Remove All  Products

async removeAllProduct(ctx, startProductKey, endProductKey) {
const productStartKey = ctx.stub.createCompositeKey([startProductKey]);
const productEndKey = ctx.stub.createCompositeKey([endProductKey]);

const iterator = await ctx.stub.getStateByRange(productStartKey, productEndKey);

const allResults = [];
while (true) {
    const res = await iterator.next();

    if (res.value && res.value.value.toString()) {
        console.log(res.value.value.toString('utf8'));

        const Key = res.value.key;
        let Record;
        try {
            Record = JSON.parse(res.value.value.toString('utf8'));
            await stub.deleteState(Key)
        } catch (err) {
            console.log(err);
            Record = res.value.value.toString('utf8');
        }
        allResults.push({ Key, Record });
    }
    if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return JSON.stringify(allResults);
    }
}
}
   



}
module.exports = Product;
