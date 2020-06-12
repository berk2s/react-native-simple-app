import {observable, configure, action, runInAction, computed} from 'mobx';

import AsyncStorage from '@react-native-community/async-storage';

configure({
    enforceActions:'observed'
});

import LocationAPI from '../locationapi';
import API from '../api';

class BranchStore{

    @observable branch_id = null;
    @observable branch_name = null;
    @observable branch_province = null;
    @observable branch_county = null;
    @observable branch_committee = null;
    @observable branch_list = [];
    @observable branch_status = null;
    @observable branch_message = '';

    @action fetchBranchList = async () => {
        try{
            const branchies = await LocationAPI.get(`/api/branch`);
            runInAction(() => {
                this.branch_list = [...branchies.data]
            });
        }catch(e){
            console.log(e);
        }
    }

    @action checkBranchExists = async () => {
        try{
            const branchID = await AsyncStorage.getItem('branch');
            const branchID_ = parseInt(await AsyncStorage.getItem('branch'));

            if(branchID != null){
                const branchDetails = await LocationAPI.get(`/api/branch/${branchID}`);

                const getBranchStatus = await API.get(`/api/branchstatus/${branchID}`);

                if(branchDetails.data.status == 'OK'){
                    await this.changeBranch(
                        branchID,
                        branchDetails.data.branch.branch_name,
                        branchDetails.data.branch.branch_province,
                        branchDetails.data.branch.branch_county,
                        branchDetails.data.branch.branch_committee,
                        getBranchStatus.data.data.status,
                        getBranchStatus.data.data.message
                    );

                }else {
                    const branchDetailsAgain = await LocationAPI.get(`/api/branch/54`);

                    const getBranchStatus = await API.get(`/api/branchstatus/${parseInt(54)}`);

                    await this.changeBranch(
                        54,
                        branchDetailsAgain.data.branch.branch_name,
                        branchDetailsAgain.data.branch.branch_province,
                        branchDetailsAgain.data.branch.branch_county,
                        branchDetailsAgain.data.branch.branch_committee,
                        getBranchStatus.data.data.status,
                        getBranchStatus.data.data.message
                    );
                }

            }else{
                const branchDetailsAgain = await LocationAPI.get(`/api/branch/54`);

                const getBranchStatus = await API.get(`/api/branchstatus/${parseInt(54)}`);

                await this.changeBranch(
                    54,
                    branchDetailsAgain.data.branch.branch_name,
                    branchDetailsAgain.data.branch.branch_province,
                    branchDetailsAgain.data.branch.branch_county,
                    branchDetailsAgain.data.branch.branch_committee,
                    getBranchStatus.data.data.status,
                    getBranchStatus.data.data.message
                );
            }
        }catch(e){
            console.log(e);
        }
    }

    @action changeBranch = async (branch_id, branch_name, branch_province, branch_county, branch_committee, branch_status, branch_message) => {
        try{
            await AsyncStorage.setItem('branch', JSON.stringify(branch_id));
            runInAction(() => {
                this.branch_id = parseInt(branch_id);
                this.branch_name = branch_name;
                this.branch_province = branch_province;
                this.branch_county = branch_county;
                this.branch_committee = branch_committee;
                this.branch_status = branch_status;
                this.branch_message = branch_message;
            });
        }catch(e){
            console.log(e);
        }
    }

    @computed get branchID(){
        return this.branch_id;
    }

    @computed get branchName(){
        return this.branch_name;
    }

    @computed get branchCommittee(){
        return parseFloat(this.branch_committee);
    }

    @computed get branchList(){
        return this.branch_list;
    }

    @computed get branchStatus(){
        return this.branch_status;
    }

    @computed get branchStatusMessage(){
        return this.branch_message;
    }

}

export default new BranchStore();
