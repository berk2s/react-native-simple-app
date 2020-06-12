import {observable, action, runInAction, computed, configure} from 'mobx';

import BasketStore from './BasketStore';

import API from '../api'

configure({
    enforceActions: 'observed'
});

class ProductStore {

    @observable products = [];
    @observable products_ = [];
    @observable sub_categories = [];
    @observable selected_tags = [];
    @observable random_products = [];

    @action setProducts = async (category_id) => {
        runInAction(() => {
            this.products_ = this.products.filter(e => e.category_id == category_id)
        });

    }

    @action randomProducts = async () => {

        const productCheckPromise = new Promise((resolve, reject) => {
            runInAction(() => {
                this.random_products = []

                resolve(true);
            });
        });

        await productCheckPromise;

        runInAction(() => {
            for(let i = 0; i < 3; i++){
                this.random_products.push(
                    this.products[Math.floor(0 + Math.random()*(this.products.length + 1 - 0))]
                );
            }
        });
    }

    @action fetchProducts = async (branch_id) => {
        try{
            runInAction(() => {
                this.selected_tags = []
            })
            const products = await API.get(`/api/product/${branch_id}`);

        //    const sub_categories = await API.get(`/api/subcategory/${category_id}`);

            const productCheckPromise = new Promise((resolve, reject) => {
                runInAction(() => {
                    this.products = [...products.data.data];
                    if(this.products.length !=0) {
                        this.products.map(async e => {
                            resolve(true)
                        })
                    }else{
                        resolve(true)
                    }
                });
            })
      /*      const subPromise = new Promise((resolve, reject) => {
                runInAction(() => {
                    this.sub_categories = [...sub_categories.data.data];
                    if(this.sub_categories.length != 0) {
                        this.sub_categories.map(async e => {
                            resolve(true)
                        })
                    }else{
                        resolve(true)
                    }
                });
            })*/
            //await subPromise;

            await productCheckPromise;
            await this.randomProducts();
        }catch(e){
            alert(e);
        }
    }

    @action fetchProductsWithSubCategory = async (sub_category_id) => {
        try {
            runInAction(() => {
                this.products = [];
                this.selected_tags.push(sub_category_id);
            })

           // const products = await API.get(`/api/product/sub/${sub_category_id}`);

            runInAction(() => {
                // this.products = [...products.data.data]
                this.products = this.products.filter(e => e.sub_category_id == sub_category_id)
            });

           // await productsPromise;

        }catch(e){
            console.log(e);
        }
    }

    @action clearSubCategory = async (sub_category_id) => {
        try{
            const findIndex = this.selected_tags.indexOf(sub_category_id);
            runInAction(() => {
                this.selected_tags.splice(findIndex, 1)
            })
        }catch(e){
            console.log(e);
        }
    }

    @computed get getProducts() {
        return this.products_;
    }

    @computed get subCategories(){
        return this.sub_categories
    }

    @computed get selectedTags(){
        return this.selected_tags;
    }

    @computed get randoms(){
        return this.random_products
    }

    @action outOfTheBasket = async (product_id) => {
     //   const index = this.products.map(e => e._id).indexOf(product_id);
     //   this.products[index].isInTheBasket = false;
    }

    @action addTheBasket = async (product_id) => {
        const index = this.products.map(e => e._id).indexOf(product_id);
        this.products[index].isInTheBasket = true;
    }

    @action outOfTheAllProducts = async () => {
        this.products.map(e => {
           e.isInTheBasket = false;
        });
    }
}

export default new ProductStore();
