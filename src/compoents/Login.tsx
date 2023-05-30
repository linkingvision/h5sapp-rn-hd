import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, ScrollView, Dimensions,TextInput,Alert,TouchableWithoutFeedback,Switch,DeviceEventEmitter } from 'react-native';
import Icon from 'react-native-vector-icons/iconfont';
import {  Button, Divider ,} from 'react-native-paper';
import { observer } from 'mobx-react';
import store from '../store/store'
import axios from 'axios';
import MD5 from 'crypto-js/md5'
import AsyncStorage from '@react-native-community/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
// import { useDarkMode } from 'react-native-dark-mode'

const Login=({ navigation })=> {
	const [username, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [IP, setIP] = useState('');
	const [port, setPort] = useState('');
	const [TEMP,setTEMP] = useState('');
	// 是否显示密码
	const [imageState,setImageState] = useState(true);
	// https
	const [https, setHttps] = useState('http');
	const [isEnabled, setIsEnabled] = useState(false);
  // 深色主题
  // const isDarkMode = useDarkMode()
	const toggleSwitch = () => {
		setIsEnabled(previousState => !previousState);
		if (isEnabled) {
			setHttps('http');
		}else{
			setHttps('https');
		}
	};
  //数据存储
  const storeData = async (key:string,value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      // saving error
    }
  }
  //数据读取
  const getData = async (key:string) => {
		try {
		  const value = await AsyncStorage.getItem(key)
		  if(value !== null) {
			  console.log('值是',value)
			  if(key == 'userID'){
				  setUserName(value)
			  }	 
			   if(key == 'userPW'){ 
				setPassword(value)
			  }
			  if (key == 'userIP'){ 
				  setIP(value)
			  }
			  if(key == 'userPort'){
				  setPort(value)
			  }
				if(key == 'userHttps'){
				  setHttps(value)
					// setIsEnabled(previousState => !previousState);
					if (value=="http") {
						setIsEnabled(false);
					}else{
						setIsEnabled(true);
					}
			  }
				if(key == 'FollowSystemTopic'){
					store.changeDarkMode(value);
				  if (value) {
						// if (isDarkMode) {
						// 	store.changeBackgroundColor('#111111')
						// 	store.changeTextColor('#FFFFFF')
						// }else{
						// 	store.changeBackgroundColor('#FFFFFF')
						// 	store.changeTextColor('#111111')
						// }
					}
			  }
		  }
		} catch(e) {
		  // error reading value
		}
  }
	//登录的网络请求
	const LOGIN = ()=>{
		let pw = MD5(password).toString();
		// T(password)
		console.log('登录了啊');
		console.log('IP:',IP);
		console.log('Port:',port);
		console.log('User:',username);
		console.log('Password:',password);
		console.log('TEMP',TEMP);
		console.log('pw',pw);
		console.log('https',https);
		console.log(https+'://'+IP+':'+port+'/api/v1/Login?user='+username+'&password='+pw+'');
		
		axios.get(https+'://'+IP+':'+port+'/api/v1/Login?user='+username+'&password='+pw+'')
		.then(response=>{
			console.log('进来了')
			// console.log(response);
			if(response.status == 200){
				if(response.data.bStatus){
					let data = response.data;
					// console.log('登录data：',data);
					store.getLoginSession(data.strSession);
					console.log('strSession是',store.data.session);

					//设置用户名等
					store.getLoginName(username);
					// store.getLoginPassword(password);
					store.getLoginIp(IP);
					store.getPassword(password);
					store.getLoginPort(port);
					store.getLoginHttps(https);

					//存储数据
					storeData('userID',store.data.username)
					storeData('userPW',store.data.password)
					storeData('userIP',store.data.host)
					storeData('userPort',store.data.port)
					storeData('userHttps',store.data.https)

					//跳转
					navigation.navigate('BottomNavigator')
					GetSystemInfo();
				}else{
					Alert.alert('请输入正确的账号密码')
				}
			}else{
				Alert.alert('链接数据库失败')
			}
		}).catch((error) => {console.log(error)})
	}
	const GetSystemInfo =()=>{
		axios.get(store.data.https+'://'+store.data.host+':'+store.data.port+'/api/v1/GetSystemInfo?session='+store.data.session+'').then((response)=>
		{       
			store.data.h5svision=response.data.strVersion
		})
	}

	useEffect(() => {
		getData('userID')
		getData('userPW')
		getData('userIP')
		getData('userPort')
		getData('userHttps')
		getData('FollowSystemTopic')
	},[])

	return (
		< >
			{/* 背景图 */}
			{/* <ImageBackground source={require('../assets/bgc/bjt.png')} style={styles.image}> */}
			<View style={{width: '100%', height: '100%',alignItems: 'center',justifyContent:'center',}}>
				<View style={styles.container}>
					{/* //图片 */}
					<View style={styles.imgview}>
						<Image source={require('../assets/img/logo.png')} style={styles.pic1} resizeMode='contain' />
					</View>
					<View style={styles.slogan}>
						<Image source={require('../assets/img/h5s_black.png')} style={styles.pic2} resizeMode='contain' />
					</View>
					<View style={styles.inputView1}>
						{/* //用户名 */}
						<View style={{flexDirection:'row',borderRadius:25,width:360,marginBottom:10,borderBottomWidth:1,borderBottomColor:'#D1D1D1',}}>
              <Icon style={{marginLeft:25,paddingTop:12.5}} name={'用户名'} color={'#21a3fe'}  size={20}/>
              <TextInput
                style={{marginLeft:10,color:'#000000',width:'80%'}}
                // theme={{ colors: { text: '#ffffff', primary: '#rgba(255,255,255,0.3)' } }}
                placeholderTextColor='#858585'
                // underlineColor='#rgba(0,0,0,0.3)'
                // mode="outlined"
                value={username}
                keyboardType="default"
                placeholder="请输入用户名"
                onChangeText={(text)=> {
                setUserName(text)}}/>
						</View>
						<View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start',borderRadius:25,width:360,marginTop:10,borderBottomWidth:1,borderBottomColor:'#D1D1D1',}}>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start',width:'85%',}}>
                <Icon style={{marginLeft:25}} name={'锁子'} color={'#21a3fe'}  size={20}/>
                {/* //密码 */}
                <TextInput
                  value={password}
                  style={{marginLeft:10,color:'#000000',width:'80%',}}
                  // mode="outlined"
                  // underlineColor='#rgba(0,0,0,0.3)'
                  placeholderTextColor='#858585'
                  keyboardType="default"
                  // right={<TextInput.Icon name="eye" />}
                  secureTextEntry={imageState}
                  placeholder="请输入密码" 
                  onChangeText={(value)=> setPassword(value)}/>
              </View>
							<View style={{ marginLeft: 5}}>
                <TouchableWithoutFeedback  onPress={()=>{setImageState(!imageState)}}>
                  {imageState ? (<Entypo name='eye' size={20} color='black'/>):(<Entypo name='eye-with-line' size={20} color='black'/>)}
                </TouchableWithoutFeedback>
							</View>
						</View>
						<View style={styles.text1}>
							<Text style={{ color: '#21a3fe',fontSize:15}}>              服务器配置</Text>
						</View>
						{/* //IP和端口 */}
						<View style={styles.inputView}>
							<Fontisto style={{paddingLeft:10,paddingTop:12.5}} name='ellipse' color={'#21a3fe'}  size={18}/>
							<TextInput
								value={IP}
								style={styles.textInput1}
								// theme={{ colors: { text: '#ffffff', primary: '#rgba(0,0,0,0.3)' } }}
								// mode="outlined"
								inlineImageLeft='dian'
								inlineImagePadding={100}
								keyboardType="number-pad"
								placeholder="请输入服务器IP地址"
								placeholderTextColor='#858585'
								onChangeText={(value)=> setIP(value)}
								// underlineColor='#rgba(0,0,0,0.3)'
							/>
							<View style={{width:5,height:'40%',borderLeftWidth:1,borderLeftColor:'#111111',paddingBottom:20,paddingTop:20,}}></View>
							<TextInput
								value={port}
								style={styles.textInput2}
								// theme={{ colors: { text: '#ffffff', primary: '#rgba(0,0,0,0.3)' } }}
								// mode="outlined"
								inlineImageLeft='dian'
								inlineImagePadding={20}
								keyboardType="number-pad"
								// underlineColor='#rgba(0,0,0,0.3)'
								placeholderTextColor='#858585'
								placeholder="端口号" 
								onChangeText={(value)=> setPort(value)}
								/>
						</View>
						{/* <View style={styles.text1}>
							<Text style={{ color: 'white',fontSize:15}}>             选择:</Text>
						</View> */}
						{/* //https */}
						{/* <View style={styles.inputView2}>
							<TextInput
								value={https}
								style={styles.textInput1}
								inlineImageLeft='dian'
								inlineImagePadding={100}
								keyboardType="number-pad"
								placeholder="请选择"
								placeholderTextColor='#c1c1c1'
								onChangeText={(value)=> setHttps(value)}
							/>
							<Switch
								trackColor={{ false: "#767577", true: "#409EFF" }}
								thumbColor={isEnabled ? "#FFFFFF" : "#f4f3f4"}
								ios_backgroundColor="#3e3e3e"
								onValueChange={toggleSwitch}
								value={isEnabled}
							/>
						</View> */}
					</View>
					<View style={styles.btnview}>
						{/* 按钮 */}
						<Button style={styles.btn}  compact={true} mode="contained" onPress={() =>LOGIN()}>
							登录
						</Button>
					</View>
				</View>
			</View>
			{/* </ImageBackground> */}
		</>
	);
}
const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
	},
	slogan: {
		flexDirection: 'row',
		padding: 0,
		marginBottom: 50,
		marginTop: 30
	},
	pic1: {
		width: 58.24,
		padding: 0,
	},
	pic2: {
		padding: 0,
		width: 172.16,
	},
	image: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
		paddingTop: 20,
	},
	imgview: {
		justifyContent: 'center',
		height: 60,
		marginTop: 45,
	},
	inputView1: {
		width: 400,
		alignItems: 'center',
	},
	inputView: {
		marginTop:10,
		flexDirection: 'row',
		justifyContent:'space-around',
		width: 328,
		borderBottomWidth:1,
		borderBottomColor:'#D1D1D1',
		// backgroundColor:'#111111',
	},
	inputView2:{
		marginTop:10,
		flexDirection: 'row',
		width: 328,
	},
	textInput: {
		width: 328,
		fontSize: 14,
		color:'white',
		backgroundColor: 'rgba(0,0,0,0.32)',
		borderRadius:30,
		marginBottom:10,
	},
	textInput1: {
		width: 182,
		paddingRight: 24,
		fontSize: 12,
		color:'#000000',
		// backgroundColor:'pink'
	},
	textInput2: {
		width: 122,
		fontSize: 12,
		color:'#000000',
	},
	btn: {
		backgroundColor: '#21a3fe',
		borderRadius: 10,
		justifyContent: 'center',
		alignSelf: 'center',
		width: 328.64,
		height: 55,
	},
	text1: {
		alignSelf: 'flex-start',
		justifyContent: 'center',
		paddingTop: 20,
		width:328,
	},
	btnview: {
		marginTop: 20,
	},
});
export default observer(Login)