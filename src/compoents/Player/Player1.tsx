import React from 'react'
import {
	Button,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,DeviceEventEmitter,Overlay,Image
  } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import {
	RTCPeerConnection,
	RTCIceCandidate,
	RTCSessionDescription,
	RTCView,
	MediaStream,
	MediaStreamTrack,
	mediaDevices,
	registerGlobals
} from 'react-native-webrtc';
//及时更新
import useSyncCallback from '../../hooks/useSyncCallback';


//mobx 
import {observer, useLocalObservable, useObserver} from 'mobx-react'
import store from '../../store/store'

import ViewShot, { captureScreen, captureRef } from "react-native-view-shot";
// import CameraRoll from '@react-native-community/cameraroll';
interface Myplayer{
	width:number;
	height:number;
}




const Player1=()=>{


	const [ stream, setStream] = useState(null );
	const [ remoteStream, setRemoteStream ] = useState( null );
	const remoteStreamRef = useRef(remoteStream);
	const [ pc, setPc ] = useState(new RTCPeerConnection());
	// const [ ws, setWs ] = useState(
	// 	new WebSocket(
	// 		'ws://192.168.100.105:8080/api/v1/h5srtcapi?token='+''+'&profile=main&session=c1782caf-b670-42d8-ba90-2244d0b0ee83'
	// 	)
	// );
	// const [ws,setWs] = useState(new WebSocket('ws://'+store.data.host+':'+store.data.port+'/api/v1/h5srtcapi?token='+store.data.video2+'&profile=main&session='+store.data.session+''))
	const [ iceConnectionState, setIceConnectionState ] = useState();
	const url = 'ws://'+store.data.host+':'+store.data.port+'/api/v1/h5srtcapi?token='+store.data.video2+'&profile=main&session='+store.data.session+''
	console.log('====================================');
	console.log('url2',url);
	console.log('====================================');
	const [ws,setWs] = useState(new WebSocket(url))

	const [posterImage,setPosterImage] =useState(false);
	const changeImage = () => {
    setPosterImage(false)
  }
	useEffect(() => {
		console.log('====================================');
		console.log(posterImage);
		console.log('====================================');
	},[posterImage])
	// const setT1 = (s) => {
    //     setWs(new WebSocket('ws://192.168.100.105:8080/api/v1/h5srtcapi?token='+s+'&profile=main&session=c1782caf-b670-42d8-ba90-2244d0b0ee83'));
    //     func();
    // }
    // const func = useSyncCallback(() => {
    //    console.log('进去了回调函数')
    // })

	// useEffect(()=>{
	// //对WS进行初始化
	// console.log('ws的值为',ws)
	// setT1(store.data.token)
	// console.log('ws的值为',ws)
	// },[store.data.token])

	const Toast = Overlay.Toast;
	const ref1 = useRef(null);
	
	function DoSnapshotWeb(){
		console.log('====================================');
		console.log(22222222222);
		console.log('====================================');
		ref1.current.capture().then(uri => {
				var promise = CameraRoll.saveToCameraRoll(uri);
				promise.then(function(result) {
					console.log(result);
				// resolve({statusCode:200});
			 
				//alert('保存成功！地址如下：\n' + result);
					Toast.show('已保存到系统相册'+ result,2000,{
						textStyle: {
							backgroundColor: 'white',
							color: '#67C23A',
						},
						position: Toast.Position.Top
					});
				}).catch(function(error) {
				console.log('error', error);
				// alert('保存失败！\n' + error);
				});
    }).catch(function (error) {
			console.log(error);
		})
	}
	useEffect(() => {
		
		if (ws!= new WebSocket('ws://localhost:8080') ){
		setPosterImage(true)
		// ws.close()
		ws.onopen = () => {
			console.log('连接开始了');

			let j = {};
			j.type = 'open';
			ws.send(JSON.stringify(j));
		};

		ws.onmessage = (msg) => {
			let data = JSON.parse(msg.data);
			// console.log(data);
			if (data.type=='videochanged') {
				changeImage()
				DeviceEventEmitter.emit('browse');
			}
			switch (data.type) {
				case 'offer':
					console.log('正在进入offer处理');

					handleOffer(data);
					break;
				case 'iceserver':
					console.log('iceserver 进入中······');
					break;
				case 'remoteice':
					console.log('remoteice,进入中里面是', data);
					onRemoteICECandidate(data);
					break;
				// case 'videochanged':

				default:
                    console.log('默认返回')
					break;
			}

			ws.onerror = function(err) {
				console.log('错误是：', err);
			};
		};
		

		// pc.onicecandidate = event => {
		//     if (event.candidate) {
		//       ws.send(JSON.stringify({
		//         type: 'candidate',
		//         candidate: event.candidate,
		//       }));
		//     }
		//   };

	}
		//  return function clean(){
		// 	 console.log('清除函数已执行');
		// 	 ws.close();
		//  }
		DeviceEventEmitter.addListener('allClose',(node)=>{
			console.log('====================================');
			console.log(node,'全部关闭11111');
			console.log('====================================');
			ws.close();
			setPosterImage(false)
		})
		DeviceEventEmitter.addListener('localhostSnapshot',(node)=>{
			console.log('====================================');
			console.log(1111111111111111);
			console.log('====================================');
			console.log('====================================');
			console.log(111111111111,node);
			console.log('====================================');
			DoSnapshotWeb()
		})
	},[ws]);

	useEffect(() => {
		pc.onaddstream = (event) => {
			console.log('on add Stream:', event.target._remoteStreams);
			console.log('EVENT.stream：', event.stream);
			setRemoteStream(event.stream);
			remoteStreamRef.current = event.stream;
			console.log('这里是远程流：', JSON.stringify(remoteStream));
		};
	},[remoteStream])
	//下面不是effect
	const handleOffer = async (data) => {
		console.log('handleOffer is running···········');
		// console.log('offer is : ',data);
		try {
			console.log('data是:');
			// pc.oniceconnectionstatechange = onICEConnectionchange(data);
			// pc.onicecandidate = onIceCandidate;
			await pc.setRemoteDescription(new RTCSessionDescription(data));
			const answer = await pc.createAnswer();
			console.log('answer是:', answer);
			await pc.setLocalDescription(answer);
			ws.send(JSON.stringify(answer));
			console.log('发送成功');
		} catch (err) {
			console.log('Offer ERROR :', err);
		}
	};
	//icecandidate部分
	const onRemoteICECandidate = async (data) => {
		if (pc) {
			console.log('进入了onremoteicecandidate这个函数了');
			pc.addIceCandidate(
				new RTCIceCandidate({
					sdpMLineIndex: data.sdpMLineIndex,
					sdpMid: data.sdpMid,
					candidate: data.candidate
				})
			);
		} else {
			console.log('pc丢失了');
		}
	};
	
	//  ice相关  局域网应该没用
	// const onICEConnectionchange =function on_ICE_Connection_State_Change(e) {
	//     console.info('ICE Connection State Changed:', e.target.iceConnectionState)
	//     setIceConnectionState(e.target.iceConnectionState);
	//     switch (e.target.iceConnectionState) {
	//       case 'closed':
	//       case 'disconnected':
	//       case 'failed':
	//           if (pc){
	//               console.log('pc该关掉了')
	//           }
	//         break
	//     }
	//   }
// 	surfaceViewRenderer.addFrameListener(new EglRenderer.FrameListener() {
//     @Override
//     public void onFrame(Bitmap bitmap) {
//         try {
//             // --- default is convert to jpeg and save to cameraRoll
//         } finally {
//             // --- remove listener immediately
//             surfaceViewRenderer.removeFrameListener(this);
//             // --- send result to js
//             module.sendEvent("WebRTCViewSnapshotResult", params);
//         }
//     }
// }, 1);
	return (
		<RTCView objectFit='cover' streamURL={remoteStream?.toURL()} style={[styles.stream,{width: '100%',height:'100%'}]} /> 
		// <View style={{width: '100%', height: '100%'}}>
		// 	<ViewShot ref={ref1} options={{ format: "png", quality: 0.9 ,result:'tmpfile'}}>
		// 		<RTCView objectFit='cover'  streamURL={remoteStream?.toURL()} style={[styles.stream,{width: '100%',height:'100%'}]} />
		// 	</ViewShot>
		// </View>
		// <View style={{width: '100%', height: '100%'}}>
		// {posterImage ? <Image source={{
		// 	uri: 'http://' + store.data.host + ':' + store.data.port + '/api/v1/GetImage?token='+store.data.video2+'&session=' + store.data.session+' '}} resizeMode='contain' style={{width: '100%', height: '100%'}} />: <RTCView objectFit='cover' streamURL={remoteStream?.toURL()} style={styles.stream} onFirstFrame={() => {console.log('视频第一'); 
		// 	}} onFrame={()=>{ console.log('监听')}}/> 	}
		// </View>
	);
};

const styles = StyleSheet.create({
	body:{
		flex:1,
		justifyContent:'center',
		alignItems:'center',
	},
	stream:{
		
	}
  });

  export default observer(Player1)