import {observable, configure, action, runInAction, computed} from 'mobx';

configure({
    enforceActions:'observed'
});

import BasketStore from './BasketStore';

class AddressStore{

    @observable address = [];

    @action setAddress = async (address) => {
        runInAction(() => {
            this.address = address;
        });
        await BasketStore.setSelectedAddress(address[0]);
    }

    @action clearAddress = async () => {
        runInAction(() => {
            this.address = []
        });
        await BasketStore.clearSelectedAddress();
    }

    @computed get getAddress(){
        return this.address;
    }

}

export default new AddressStore();
