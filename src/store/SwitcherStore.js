import {action, configure, runInAction, computed, observable} from 'mobx';

configure({
    enforceActions: 'observed'
})
class SwitcherStore {
    @observable tabIndex = 0;
    @observable isSwitcherClicked = false;

    @observable whichSwitcher = 0;

    @action setTabIndex = (i) => {
        this.tabIndex = i;
    }

    @action setSwitcherClicked = (i) => {
        this.isSwitcherClicked = i;
    }

    @action setWhichSwitcher = (i) => {
        this.whichSwitcher = i;
    }

    @computed get getTabIndex(){
        return this.tabIndex;
    }

    @computed get getSwitcherClicked(){
        return this.isSwitcherClicked;
    }
}

export default new SwitcherStore();
