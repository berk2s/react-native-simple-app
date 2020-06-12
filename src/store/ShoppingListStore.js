import {observable, configure, action, runInAction, computed} from 'mobx';
import API from '../api';
import BasketStore from './BasketStore';

configure({
    enforceActions:'observed'
});


class ShoppingListStore {

    @observable list = [];

    @action setList = async (list) => {
        runInAction(() => {
            this.list = list;
        });
    }

    @action applyList = async (list_id) => {
        try{
            if(this.list.length != 0) {
                await BasketStore.setFreshNavigate(true);
                await BasketStore.clearBasket();
                const findPromise = this.list.filter(e => e._id == list_id)[0].products.map(async e => {
                    return new Promise(async (resolve, reject) => {
                       resolve({id: e.id, count:e.count})
                    });
                });

                const productIDs = await Promise.all(findPromise);

                await BasketStore.listToBasket(productIDs);

               // await BasketStore.addToBasket(e.id, e.count);
                await BasketStore.setSelectedListID(list_id);
                await BasketStore.setIsBasketSaved(true);
            }
        }catch(e) {
            console.log(e);
        }
    }

    @action increaseProduct = async (list_id, product_id) => {
        if(this.list.length != 0){
            this.list.filter(e => e._id == list_id)[0].products.filter(e => e.id == product_id)[0].count += 1;
            if(BasketStore.getIsBasketSaved == true && BasketStore.getSelectedListID == list_id){
                BasketStore.setSelectedListID(null);
                BasketStore.setIsBasketSaved(false)
            }
        }
    }
    @action decreaseProduct = async (list_id, product_id) => {
        if(this.list.length != 0){
            this.list.filter(e => e._id == list_id)[0].products.filter(e => e.id == product_id)[0].count -= 1;
            if(BasketStore.getIsBasketSaved == true && BasketStore.getSelectedListID == list_id){
                BasketStore.setSelectedListID(null);
                BasketStore.setIsBasketSaved(false)
            }
        }
    }

    @action removeProduct = async (list_id, product_id) => {
        if(this.list.length != 0){
            const index = this.list.map(e => e._id).indexOf(list_id);
            const index2 = this.list[index].products.map(e => e.id).indexOf(product_id);
            if(index !== -1 && index2 !== -1){
                this.list[index].products.splice(index2, 1);
                runInAction(() => {
                    this.list = [...this.list];
                })

            }
            if(BasketStore.getIsBasketSaved == true && BasketStore.getSelectedListID == list_id){
                BasketStore.setSelectedListID(null);
                BasketStore.setIsBasketSaved(false)
            }
        }
    }

    @action removeSavedList = async (list_id) => {
        if(this.list.length != 0){
            const index = this.list.map(e => e._id).indexOf(list_id);
            if(index !== -1){
                this.list.splice(index, 1);

                runInAction(() => {
                    this.list = [...this.list];
                })
                if(BasketStore.getIsBasketSaved == true && BasketStore.getSelectedListID == list_id){
                    BasketStore.setSelectedListID(null);
                    BasketStore.setIsBasketSaved(false)
                }
            }
        }
    }

    @action changeListName = async (list_id, name) => {
        try{
            if(this.list.length != 0){
                const index = this.list.map(e => e._id).indexOf(list_id);
                if(index !== -1){
                    this.list[index].list_name = name;

                    runInAction(() => {
                        this.list = [...this.list];
                    })
                }
            }
        }catch(e){
            console.log(e);
        }
    }

    @action productCount = async (list_id) => {
        return this.list.filter(e => e._id == list_id)[0].products.length
    }

    @computed get getShoppingList(){
        return this.list;
    }

}

export default new ShoppingListStore();
