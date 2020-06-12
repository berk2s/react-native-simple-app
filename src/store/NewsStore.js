import {observable, configure, action, runInAction, computed} from 'mobx';

import API from '../api'


configure({
    enforceActions:'observed'
});

class NewsStore {
    @observable news = []

    @action fetchNews = async (id) => {
        try{
            const news = await API.get(`/api/news/${id}`);
            runInAction(() => {
                this.news = [...news.data.data]
            })
        }catch(e){
            console.log(e)
        }
    }

    @computed get getNews(){
        return this.news;
    }

}

export default new NewsStore();
