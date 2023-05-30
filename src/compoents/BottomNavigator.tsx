import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {Image, View,DeviceEventEmitter,StyleSheet,Text,Dimensions,Modal,TouchableOpacity,ScrollView} from 'react-native'

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator,DrawerContentScrollView,DrawerItemList,DrawerItem} from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import { getHeaderTitle } from '@react-navigation/elements';
import Icon from 'react-native-vector-icons/iconfont'
// import Player from './Player';
// import Login from './Login';
// import Page1 from './Page1';
// import Page from './Page';
// import Replay from './replay/Replay';
// import Yaogan from './Yaogan';
// import Event from './Event'
import Liveview from './Liveview'
import testRouter2 from './testRouter2'
import testRouter3 from './testRouter3'
import testRouter4 from './testRouter4'
import Ceshi from "./Ceshi";
import store from '../store/store';
import AsyncStorage from '@react-native-community/async-storage';
const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

// import { useDarkMode } from 'react-native-dark-mode'
//创建Tab

// const Tab = createMaterialBottomTabNavigator();

// const Test= ()=>{
//   return(
 
//       <Tab.Navigator   inactiveColor="#green"   activeColor="red"  

//       >
//         <Tab.Screen name='Player' component={Player} options={{tabBarIcon:require('../assets/setting.png')}} ></Tab.Screen>
//         <Tab.Screen name='Push' component={Push} options={{tabBarIcon:require('../assets/setting.png')}}></Tab.Screen>
//       </Tab.Navigator>
    
//   )
// }
// export default Test;




const Drawer = createDrawerNavigator();
function drawContentView(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{height:0.08*WIDTH,width:'100%',flexDirection: 'row', alignItems: 'center',backgroundColor: store.data.backgroundColor}}>
        <Icon style={{marginLeft:25,}} name={'用户名'} color={store.data.TextColor}  size={20}/>
        <Text style={{marginLeft:20,fontSize:WIDTH * 0.02,color: store.data.TextColor}}>{store.data.username}</Text>
      </View>
      <DrawerItemList {...props}/>
      {/* <DrawerItem label="Help" onPress={...} /> */}
    </DrawerContentScrollView>
  );
}
function BottomNavigator() {
  const [confirm,setConfirm] = useState(store.data.backgroundColor);
  const [ replaymodalVisible, setreplayModalVisible ] = useState(false);
  const [DevicesOrTime,setDevicesOrTime]= useState('tree');
  const [changTokencolor1,setchangTokencolor1] = useState('#3EADFF');
  const [changTimecolor1,setchangTimecolor1] = useState('white');
  const [changTimecolor2,setchangTimecolor2] = useState('white');

  //数据读取
  // const getData = async (key:string) => {
	// 	try {
	// 	  const value = await AsyncStorage.getItem(key)
	// 	  if(value !== null) {
	// 		  console.log('Btn值是',value)
	// 		  if(key == 'FollowSystemTopic'){
	// 			  if (value=='true') {
	// 					if (isDarkMode) {
	// 						setConfirm('#1B1B1B')
	// 					}else{
	// 						setConfirm('#FFFFFF')
	// 					}
	// 				}else{
  //           if (store.data.backgroundColor=='#FFFFFF') {
  //             setConfirm('#FFFFFF')
  //           }else{
  //             setConfirm('#1B1B1B')
  //           }
  //         }
	// 		  }
	// 	  }
	// 	} catch(e) {
	// 	  // error reading value
	// 	}
  // }
  DeviceEventEmitter.addListener('background',(value)=>{
    console.log('value',store.data.backgroundColor);
    if (store.data.backgroundColor=='#FFFFFF') {
      setConfirm('#FFFFFF')
    }else{
      setConfirm('#1B1B1B')
    }
  })
  useEffect(() => {
		// getData('FollowSystemTopic')
	},[])
  const ModelView=()=>{
    return (
      <Modal
        style={{backgroundColor:'pink'}}
        transparent={true}
        visible={replaymodalVisible}
        // onRequestClose={() => {
        //   setreplayModalVisible(!replaymodalVisible);
        // }}
      >
        <TouchableOpacity
          style={{flex:1}}
          onPress={() => {
            setreplayModalVisible(!replaymodalVisible)
        }}>
        <View style={{width:WIDTH*0.5,
        height:HEIGHT,
        backgroundColor: 'pink',
        justifyContent: 'center',
        alignItems: 'center',
        flex:1,
        position:'absolute',left:WIDTH*0.5,top:WIDTH*0.4}}> 
        <Text>远端存储</Text>
        <Text>服务存储</Text>
      </View>
   </TouchableOpacity>
      
    </Modal>
    )
  }
  function changeToken(){
    setDevicesOrTime('tree');
    // setTokenColor('#3EADFF');
    // setTimeColor('black');
    setchangTokencolor1('#3EADFF');
    setchangTimecolor1('white');
    setchangTimecolor2('white');
  }
  function changeTime(){
    setDevicesOrTime('pic');
    // setTokenColor('black');
    // setTimeColor('#3EADFF');
    setchangTokencolor1('white');
    setchangTimecolor1('#3EADFF');
    setchangTimecolor2('white');
  }
  function changeFav(){
    setDevicesOrTime('fav');
    // setTokenColor('black');
    // setTimeColor('#3EADFF');
    setchangTokencolor1('white');
    setchangTimecolor2('#3EADFF');
    setchangTimecolor1('white');
  }
  return (
    // screenOptions={{DrawerHeaderProps:null,tabBarVisible:false}}
    <Drawer.Navigator useLegacyImplementation drawerContent={props => drawContentView(props)} 
      screenOptions={({ navigation }) => ({
        presentation: 'modal',
        headerRight: () =><TouchableOpacity activeOpacity={0.5} onPress={() =>{setreplayModalVisible(!replaymodalVisible)}}>
          <Icon name={'资源列表'} size={25} color={store.data.TextColor}/>
          <Modal
            style={{backgroundColor:'gery'}}
            transparent={true}
            visible={replaymodalVisible}
            // onRequestClose={() => {
            //   setreplayModalVisible(!replaymodalVisible);
            // }}
          >
            <TouchableOpacity
              style={{flex:1,}}
              onPress={() => {
                setreplayModalVisible(!replaymodalVisible)
            }}>
            <View style={{width:WIDTH*0.4,
            height:HEIGHT,
            backgroundColor: store.data.backgroundColor,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flex:1,
            position:'absolute',left:WIDTH*0.6,top:HEIGHT*0.05}}>
          <View style={{justifyContent: 'flex-start',width:WIDTH,paddingLeft:20,marginTop:0.048*WIDTH,}}>
            <View style={{flexDirection: 'row',justifyContent: 'flex-start'}}>
              <TouchableOpacity style={{height:30,borderBottomColor:changTokencolor1,borderBottomWidth:2}} activeOpacity={0.8} onPress={() =>changeToken()} >
                  <Text style={{color: store.data.TextColor,letterSpacing: 0,paddingRight:10,fontSize:20,marginLeft:10,}}>资源列表</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{height:30,borderBottomColor:changTimecolor1,borderBottomWidth:2,marginLeft:20}} activeOpacity={0.8} onPress={() => changeTime()}>
                  <Text style={{color: store.data.TextColor,marginLeft:10, letterSpacing: 0,paddingRight:10,fontSize:20}}>最近浏览</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{height:30,borderBottomColor:changTimecolor2,borderBottomWidth:2,marginLeft:20}} activeOpacity={0.8} onPress={() => changeFav()}>
                  <Text style={{color: store.data.TextColor,marginLeft:10, letterSpacing: 0,paddingRight:10,fontSize:20}}>收藏</Text>
              </TouchableOpacity>
            </View>
            <View>
                <View>
                    {DevicesOrTime=='tree'?<ScrollView>
                    <Ceshi />
                    </ScrollView>:<View>{DevicesOrTime=='pic'?<></>:null}</View>}
                </View>
            </View>
            </View>
          </View>
      </TouchableOpacity>
        </Modal>
        </TouchableOpacity>,
    })}>
      <Drawer.Screen name="实时视频" component={Liveview} options={{drawerIcon:() =><Icon name={'视频'} size={18} color={store.data.TextColor}/>}}/>
      <Drawer.Screen name="回放" component={testRouter2} options={{drawerIcon:() =><Icon name={'iconfont图标_视频回放'} size={18} color={store.data.TextColor}/>}}/>
      <Drawer.Screen name="事件" component={testRouter3} options={{drawerIcon:() =><Icon name={'事件监控'} size={18} color={store.data.TextColor}/>}}/>
      <Drawer.Screen name="设置" component={testRouter4} options={{drawerIcon:() =><Icon name={'设置-01'} size={20} color={store.data.TextColor}/>}}/>
    </Drawer.Navigator>
  );
}

export default BottomNavigator;

const styles = StyleSheet.create({
  
})

