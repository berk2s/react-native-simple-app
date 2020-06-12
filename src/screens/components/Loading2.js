import React, { Component } from 'react';
import {StyleSheet, Text, View, Image, Animated, Easing, Dimensions} from 'react-native';

import ALogo from '../../img/alogo.png';
import MLogo from '../../img/mlogo.png';

export default class Loading2 extends Component {

    state = {
        rotate: new Animated.Value(0),
        infos:[
            'Beyaz çikolata aslında kakao içermediği için bir çikolata değildir',
            'Elmanın 25% hava olduğunu biliyor muydunuz?',
            'Mavi renk, yiyecekler arasında görebileceğimiz en nadir olanıdır',
            'Bir yılda tüketilen Nutella ile dünyayı yaklaşık 1.4 kere dolanabilirsiniz',
            'Çikolatayı ilk içecek olarak kullanan millet Aztekler, içine acı biber katarak servis etmiştir',
            'Ay yüzeyinde yenilen ilk yiyecek şeftalidir',
            'Beyaz şarap yıllandıkça koyulaştırken kırmızı şarap ise daha açık kırmızı haline döner',
            'Ketçapın ishale karşı ilaç olarak kullanıldığını biliyor muydunuz?',
            'Dışında çekirdekleri olan tek yiyecek çilektir',
            'Domates eski zamanlarda \'aşk elması\' olarak adlandırılıyordu',
            'Yüksek oranda kahve halüsinasyonlara ve garip sesler duymanıza neden olabilir',
            'Kakao taneleri Aztekler döneminde para birimi olarak kullanılırdı',
            'Limondaki şeker oranı çilekten daha yüksektir',
            'Bilim insanlarının yaptığı bir araştırmaya göre avokado dünyanın en besleyici meyvesidir',
            'Dünyada 7500\'ü aşkın elma çeşidi bulunmaktadır',
            'Muzlar vücuda etki eden doğal bir antiasit barındırırlar. Mide yanması yaşadığınızda muz yemek sizi rahatlatacaktır',
            'Bir yılda satılan Nutella kavanozlarının içindeki çikolatalı fındık kreması, Çin Seddi’ni 8 kez kaplayabilir',
            'Aklımıza gelenleri sayarsak 15 sayısına zor geliriz.Ama Dünyada 350 farklı makarna şekli vardır',
            '18.yüzyıla kadar greyfurt denen bir meyve yoktu',
            'Fruktoz seviyesi yüksek olması nedeniyle elma,sabahları kahveden daha iyi uyandırma özelliğine sahiptir',
            'Bir domateste bir insanda bulunandan daha fazla gen vardır',
            'Bal dünya üzerinde bozulmayan tek yiyecektir',
            'Yuttuğunuz sakızı sindirmek 7 yıl sürer',
            'Patlıcan içerisinde çekirdek barındırdığı için teknik olarak bir meyvedir',
            'Elma suyundaki şeker miktarı koladakinden daha fazladır',
            'Patlamış mısır sağlığınız açısından zengin lif oranına sahiptir',
            'Peynirde yağ birikimini önleyen ve kilo vermenize yardımcı olan linoleik asit vardır',
            'Protein ihtiyacınızı karşılamak için baklagilleri tahıllarla birlikte yemelisiniz',
            'Çiğ havuç pişmişinden daha besleyicidir',
            'Düzenli olarak kuruyemiş tüketimi kalp hastalığına karşı sizi korur',
            'Kurşun kalemle bir hata yaptığınız da,salatalığın dış kısmını silgi olarak kullanabilirsiniz',
            'Soğan doğrarken ağzınızda ekmek tutarsanız bu ağlamanızı önleyecektir',
            'Bünyesinde en çok su barındıran yiyecek %92 suyla karpuzdur',
            'Muz radyoaktif bir maddedir',
            'Muzun daha uzun süre dayanması için şu iki şeyi yapmak gerekir:Buzdolabında saklamayın ve muzları bir arada tutmayın',
            'Mantarlar genetik olarak bitkiden çok insana daha yakındır',
        ]
    }


     randomIntFromInterval = (min, max) => { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    render() {

        return (
            <View>

            <View style={{display:'flex', justifyContent:'space-between', height:'100%', flexDirection:'column',  paddingVertical:20, alignItems:'center'}}>
            <Animated.View style={[ {display:'flex', marginTop:Dimensions.get('window').height/2-100, justifyContent:'center', alignItems:'center'}]}>

                <Image
                    source={ALogo}
                    style={[styles.alogo]}
                />
                <Image
                    source={MLogo}
                    style={styles.mlogo}
                />

            </Animated.View>
                <View style={{paddingHorizontal:5}}>

                    <Text style={{fontFamily:'Muli-Regular', color:'#304555',  fontSize:18, textAlign:'center'}}>{this.state.infos[Math.floor(Math.random() * this.state.infos.length)]}</Text>

                </View>


            </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({

    alogo:{
        width:96,
        height:89
    },
    mlogo:{
        width:42,
        height:34,
        position:'absolute',
        top:28,
        left:26
    }
});
