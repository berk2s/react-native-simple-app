import {observable, action, runInAction, computed, configure} from 'mobx';

import API from '../api'

import BranchStore from './BranchStore';

configure({
    enforceActions: 'observed'
});

class CategoryStore{

    @observable categories = [];

    @action fetchCategories = async () => {
        try{
            runInAction(() => {
                this.categories = []
            })
            const branch_id = BranchStore.branchID;
            const categories = await API.get(`/api/category/v2/current/${branch_id}`);
            runInAction(() => {
                this.categories = [...categories.data.data]
            })
        }catch(e){
            console.log(e);
        }
    }

    @computed get categoryList(){
        return this.categories;
    }

}

export default  new CategoryStore();
