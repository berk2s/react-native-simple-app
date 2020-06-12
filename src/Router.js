import React from 'react';

import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import CustomIcon from './font/CustomIcon';


//screens

// for the mainstack screens
import LoginScreen from './screens/account/login/Login';
import RegisterScreen from './screens/account/register/Register';
import PhoneVerifactionScreen from './screens/account/phoneverifaction/PhoneVerifaction';
import OnboardingScreen from './screens/account/onboarding/Onboarding';
import ForgotPassStep1Screen from './screens/account/forgotpass/step1/Step1';
import ForgotPassStep2Screen from './screens/account/forgotpass/step2/Step2';

//for the bottomtabnavigator screens

import FeedScreen from './screens/bottomtab/feed/Feed';
import CampaignScreen from './screens/bottomtab/campaign/Campaign';
import SwitcherScreen from './screens/bottomtab/switcher/Switcher';
import ShopingCardScreen from './screens/bottomtab/shopingcart/ShopingCard';
import ProfileScreen from './screens/bottomtab/profile/authenticated/Profile';
import ProfileUnauthticatedScreen from './screens/bottomtab/profile/Unauthenticated';
import BottomTab from './screens/bottomtab/BottomTab';
import Currier from './screens/bottomtab/currier/Currier';

import ProfileSettingsScreen from './screens/bottomtab/profile/authenticated/profilesettings/ProfileSettings';
import AddressManagementScreen from './screens/bottomtab/profile/authenticated/addressmanagement/AddressManagement';
import AddAddress from './screens/bottomtab/profile/authenticated/addressmanagement/add_address/AddAddress';
import EditAddress from './screens/bottomtab/profile/authenticated/addressmanagement/edit_address/EditAddress';
import FindLocation from './screens/bottomtab/profile/authenticated/addressmanagement/find_location/FindLocation';

import OrderList from './screens/bottomtab/profile/authenticated/ordermanagement/OrderList';
import OrderDetail from './screens/bottomtab/profile/authenticated/ordermanagement/order_detail/OrderDetail';

import ShoppingListScreen from './screens/bottomtab/profile/authenticated/shoppinglist/ShoppingList';

import ApplyOrderScreen from './screens/bottomtab/shopingcart/apply_order/ApplyOrder';
import OrderSuccessfullScreen from './screens/bottomtab/shopingcart/order_successfull/OrderSuccessfull';

import ChangePasswordScreen from './screens/bottomtab/profile/authenticated/changepassword/ChangePassword';

import ComplaintScreen from './screens/bottomtab/profile/authenticated/complaint/Complaint';

import AuthSwitcher from './screens/switch/AuthSwitcher';

// for the product listing
import ProductListScreen from './screens/product/Product';

let tintColorIndex = 0;

import SwitcherStore from './store/SwitcherStore';

import AuthStore from './store/AuthStore';

const unAuthticatedProfileStack = createStackNavigator({
    ProfileUnauthticated:{
        screen:ProfileUnauthticatedScreen,
    },
    Register:{
        screen:RegisterScreen,
    },
    Login:{
        screen:LoginScreen,
    },
    PhoneVerifaction:{
        screen:PhoneVerifactionScreen,
        navigationOptions:{
            gestureEnabled: false,
        }
    },
    Onboarding:{
        screen:OnboardingScreen,
    },
    ForgotPassStep1:{
        screen:ForgotPassStep1Screen,
    },
    ForgotPassStep2:{
        screen:ForgotPassStep2Screen,
    }
}, {
    headerMode:null,
});

const authticatedProfileStack = createStackNavigator({
    Profile:{
        screen: ProfileScreen
    },
    ProfileSettings:{
        screen:ProfileSettingsScreen,
    },
    AddressManagement:{
        screen:createStackNavigator({
            AddressList:AddressManagementScreen,
            AddAddress:AddAddress,
            EditAddress:EditAddress,
            FindLocation:FindLocation
        },{
            headerMode: null
        }),
    },
    Orders:{
        screen:createStackNavigator({
            OrderList:OrderList,
            OrderDetail:OrderDetail,
        },{
            headerMode:null
        })
    },
    ShoppingList:{
        screen:ShoppingListScreen,
    },
    ChangePassword:ChangePasswordScreen,
    Complaint:ComplaintScreen
}, {
    headerMode: null
})

const unAuthticatedBottomScreens = createBottomTabNavigator({
   Feed:{
       screen:createStackNavigator({
           Category:{
             screen:FeedScreen,
           },
           Product:{
               screen:ProductListScreen,
           },
           Currier:{
               screen:Currier,
               navigationOptions:{
                   gestureEnabled: false,
               }
           }
       }, {
           headerMode:null,
       }),
       navigationOptions:{
           tabBarOnPress: ((obj) => {SwitcherStore.setTabIndex(0); obj.navigation.navigate('Feed')}),
           tabBarLabel: () => (null),
           tabBarIcon: ({focused}) => <CustomIcon name="home-fill" size={25} style={{color: focused ? '#003DFF' : '#304555'}} />
       }
   },
    Campaign:{
       screen:CampaignScreen,
        navigationOptions:{
            tabBarOnPress: ((obj) => {SwitcherStore.setTabIndex(1); obj.navigation.navigate('Campaign')}),
            tabBarLabel: () => (null),
            tabBarIcon: ({focused}) => <CustomIcon name="star-fill" size={25} style={{color: focused ? '#003DFF' : '#304555'}} />
        }
    },
    Switcher:{
        screen:Currier,
        navigationOptions:{
            tabBarOnPress: ((obj) => {obj.navigation.navigate('Switcher')}),
            tabBarLabel: () => (null),
            tabBarIcon: ({focused}) => <CustomIcon name="us" size={38} style={{color: focused ? '#003DFF' : '#304555'}} />
        }
    },
    ShopingCard:{
       screen:ShopingCardScreen,
        navigationOptions:{
            tabBarOnPress: ((obj) => {SwitcherStore.setTabIndex(3); obj.navigation.navigate('ShopingCard')}),
            tabBarLabel: () => (null),
            tabBarIcon: ({focused}) => <CustomIcon name="shopping-cart-fill" size={25} style={{color: focused ? '#003DFF' : '#304555'}} />
        }
    },
    Profile:{
       screen:unAuthticatedProfileStack,
        navigationOptions:{
            tabBarOnPress: ((obj) => {SwitcherStore.setTabIndex(4); obj.navigation.navigate('Profile')}),
            tabBarLabel: () => (null),
            tabBarIcon: ({focused}) => <CustomIcon name="person-fill" size={25} style={{color: focused ? '#003DFF' : '#304555'}} />
        }
    },
},{
    keyboardHidesTabBar:true,
    lazyLoad: false,
    backBehavior: 'history',
    tabBarComponent:BottomTab,
    tabBarOptions: {
        activeTintColor: '#003DFF',
        inactiveTintColor: '#304555',
        style: {
            shadowColor: '#000',
            shadowOpacity:0.15,
            shadowRadius: 9,
            shadowOffset: {
                height: 0,
            },
            elevation:8,
            backgroundColor: 'white',
            height: 55,
            borderTopColor: 'transparent',
            borderTopLeftRadius:25,
            borderTopRightRadius:25
        }
    },

});

const authticatedBottomScreens = createBottomTabNavigator({
    Feed:{
        screen:createStackNavigator({
            Category:{
                screen:FeedScreen,
            },
            Product:{
                screen:ProductListScreen,
            },
            Currier:{
                screen:Currier,
                navigationOptions:{
                    gestureEnabled: false,
                }
            }
        }, {
            headerMode:null,
        }),
        navigationOptions:{
            tabBarOnPress: ((obj) => {SwitcherStore.setTabIndex(0); obj.navigation.navigate('Feed')}),
            tabBarLabel: () => (null),
            tabBarIcon: ({focused}) => <CustomIcon name="home-fill" size={25} style={{color: focused ? '#003DFF' : '#304555'}} />
        }
    },
    Campaign:{
        screen:CampaignScreen,
        navigationOptions:{
            tabBarOnPress: ((obj) => {SwitcherStore.setTabIndex(1); obj.navigation.navigate('Campaign')}),
            tabBarLabel: () => (null),
            tabBarIcon: ({focused}) => <CustomIcon name="star-fill" size={25} style={{color: focused ? '#003DFF' : '#304555'}} />
        }
    },
    Switcher:{
        screen:Currier,
        navigationOptions:{
            tabBarOnPress: ((obj) => {obj.navigation.navigate('Switcher')}),
            tabBarLabel: () => (null),
            tabBarIcon: ({focused}) => <CustomIcon name="us" size={38} style={{color: focused ? '#003DFF' : '#304555'}} />
        }
    },
    ShopingCard:{
        screen:createStackNavigator({
                    ShopingCard_:ShopingCardScreen,
                    ApplyOrder:ApplyOrderScreen,
                    OrderSuccessfull:OrderSuccessfullScreen
                },{
                    headerMode:null
                }),
        navigationOptions:{
            tabBarOnPress: ((obj) => {SwitcherStore.setTabIndex(3); obj.navigation.navigate('ShopingCard')}),
            tabBarLabel: () => (null),
            tabBarIcon: ({focused}) => <CustomIcon name="shopping-cart-fill" size={25} style={{color: focused ? '#003DFF' : '#304555'}} />
        }
    },
    Profile:{
        screen:authticatedProfileStack,
        navigationOptions:{
            tabBarOnPress: ((obj) => {SwitcherStore.setTabIndex(4); obj.navigation.navigate('Profile')}),
            tabBarLabel: () => (null),
            tabBarIcon: ({focused}) => <CustomIcon name="person-fill" size={25} style={{color: focused ? '#003DFF' : '#304555'}} />
        }
    },
},{
    lazyLoad: false,
    backBehavior: 'history',
    tabBarComponent:BottomTab,
    tabBarOptions: {
        activeTintColor: '#003DFF',
        inactiveTintColor: '#304555',
        style: {
            shadowColor: '#000',
            shadowOpacity:0.15,
            shadowRadius: 9,
            shadowOffset: {
                height: 0,
            },
            elevation:8,
            backgroundColor: 'white',
            height: 55,
            borderTopColor: 'transparent',
            borderTopLeftRadius:25,
            borderTopRightRadius:25
        }
    },

});

const pages = createSwitchNavigator({
    AuthSwitcher:AuthSwitcher,
    unAuthticatedBottomScreens:unAuthticatedBottomScreens,
    authticatedBottomScreens:authticatedBottomScreens
}, {
    headerMode:null,
});

export default createAppContainer(pages);
