import {observable, configure, action, runInAction, computed} from 'mobx';

import API from '../api'

configure({
    enforceActions:'observed'
});

class CampaignStore {
    @observable campaigns = []

    @action fetchCampaigns = async (id) => {
        try{
            const campaigns = await API.get(`/api/campaign/${id}`);
            runInAction(() => {
                this.campaigns = [...campaigns.data.data]
            })
        }catch(e){
            console.log(e)
        }
    }

    @computed get getCampaigns(){
        return this.campaigns;
    }

}

export default new CampaignStore();
