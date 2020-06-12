import {observable, configure, action, runInAction, computed} from 'mobx';

import LocationAPI from '../locationapi'
import DeviceInfo from 'react-native-device-info';


configure({
    enforceActions:'observed'
});

class VersionStore {

    @observable device_version = 1.51;
    @observable last_version = 1.5;

    @observable hasUpdate = false;
    @observable isUpdateRequired = false;

    @observable onProduction = false;

    @observable playStoreLink = null;
    @observable appStoreLink = null;

    @action checkVersion = async () => {
        try{
            const appsettings = await LocationAPI.get(`/api/appsettings`);

                let getVersion = await DeviceInfo.getVersion();

                runInAction(() => {
                    this.hasUpdate = appsettings.data[0].hasUpdate;
                    this.isUpdateRequired = appsettings.data[0].is_update_required;
                    this.playStoreLink = appsettings.data[0].playstore_link;
                    this.appStoreLink = appsettings.data[0].appstore_link;
                    this.last_version = appsettings.data[0].version;
                    this.onProduction = appsettings.data[0].on_production;
                    this.device_version = getVersion;
                });

        }catch(e){
            console.log(e)
        }
    }

    @computed get getPlayStoreLink(){
        return this.playStoreLink
    }

    @computed get getAppStoreLink(){
        return this.appStoreLink
    }

    @computed get getHasUpdate(){
        return this.hasUpdate
    }

    @computed get getIsRequired(){
        return this.isUpdateRequired;
    }

    @computed get getDeviceVersion(){
        return this.device_version
    }

    @computed get getOnProduction(){
        return this.onProduction
    }

    @action setDeviceVersion = async (ver) => {
        //alert(ver)
        this.device_version = ver;
    }

    @computed get getLastVersion(){
        return this.last_version
    }

    @action setLastVersion = async (ver) => {
        this.last_version = ver;
    }

}

export default new VersionStore();
