/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React, { Component } from 'react';
import {
  
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
  TextInput,
  AppRegistry,
  Text,
  View,
} from 'react-native';

import {
  
  ViroARSceneNavigator,
  ViroText,
  ViroVRSceneNavigator,
  ViroARCamera,
} from 'react-viro';

// import scene from './js/HelloWorldSceneAR'
/*
 TODO: Insert your API key below
 */
var sharedProps = {
  objects:[<ViroText text={"test"} scale={[.5, .5, .5]} position={[0, 1, 1]} style={{    fontFamily: 'Arial',
  fontSize: 60,
  color: '#ffffff',
  textAlignVertical: 'center',
  textAlign: 'center',  }} />],
  apiKey:"API_KEY_HERE",
}

// Sets the default scene you want for AR and VR


var UNSET = "UNSET";
var VR_NAVIGATOR_TYPE = "VR";
var AR_NAVIGATOR_TYPE = "AR";

var InitialARScene = require('./js/HelloWorldSceneAR');
var InitialVRScene = require('./js/HelloWorldSceneAR');
// This determines which type of experience to launch in, or UNSET, if the user should
// be presented with a choice of AR or VR. By default, we offer the user a choice.
var defaultNavigatorType = UNSET;
// viro new stuff
export default class ViroSample extends Component {
  constructor() {
    super();

    this.state = {
      navigatorType : defaultNavigatorType,
      sharedProps : sharedProps,
      objects: [],
      objID: 0,
      text: '',
    }
    this._getExperienceSelector = this._getExperienceSelector.bind(this);
    this._getARNavigator = this._getARNavigator.bind(this);
    this._getVRNavigator = this._getVRNavigator.bind(this);
    this._getExperienceButtonOnPress = this._getExperienceButtonOnPress.bind(this);
    this._exitViro = this._exitViro.bind(this);

  }

  // Replace this function with the contents of _getVRNavigator() or _getARNavigator()
  // if you are building a specific type of experience.
  render() {

    if (this.state.navigatorType == UNSET) {
      return this._getExperienceSelector();
    } else if (this.state.navigatorType == VR_NAVIGATOR_TYPE) {
      return this._getVRNavigator();
    } else if (this.state.navigatorType == AR_NAVIGATOR_TYPE) {
      return this._getARNavigator();
    }

  }

  // Presents the user with a choice of an AR or VR experience
  _getExperienceSelector() {
    return (
      <View style={localStyles.outer} >
        <View style={localStyles.inner} >

          <Text style={localStyles.titleText}>
            grARffiti
          </Text>

          <TouchableHighlight style={localStyles.buttons}
            onPress={this._getExperienceButtonOnPress(AR_NAVIGATOR_TYPE)}
            underlayColor={'#68a0ff'} >

            <Text style={localStyles.buttonText}>Get Started</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  addObjects() {
    let newObjects = this.state.objects;
    newObjects.push(<ViroARCamera key={this.state.objID}> 
                      <ViroText className="new" text={this.state.text} scale={[.5, .5, .5]} position={[0, 0, -1]} style={localStyles.helloWorldTextStyle} />
                    </ViroARCamera>)
    this.setState({
      objects: newObjects,
      text: "",
      objID: this.state.objID+1
    })
  }

  // Returns the ViroARSceneNavigator which will start the AR experience
  _getARNavigator() {
    return (
      <View style={{flex:1, position: 'absolute'}}>
        <ViroARSceneNavigator {...this.state.sharedProps}
          initialScene={{scene: InitialARScene}}
          style={{flex : 1}}
          viroAppProps={{objects: this.state.objects}}>
        </ViroARSceneNavigator>
        <View style={{position: 'absolute', left: "10%", bottom: "30%", color: "black", width: 128, backgroundColor: "white", height:34,  alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', height: 64}}>
          <TextInput placeholder="Text here!"
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}>
          </TextInput>
        </View>
        <View style={{position: 'absolute', left: "50%", bottom: "30%", height:34,  alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 64, backgroundColor: "red", }}>
          <TouchableHighlight onPress={() => this.addObjects()}>
            <Text style={localStyles.buttonText}>Add</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
  
  // Returns the ViroSceneNavigator which will start the VR experience
  _getVRNavigator() {
    return (
      <ViroVRSceneNavigator {...this.state.sharedProps}
        initialScene={{scene: InitialVRScene}} onExitViro={this._exitViro}/>
    );
  }

  // This function returns an anonymous/lambda function to be used
  // by the experience selector buttons
  _getExperienceButtonOnPress(navigatorType) {
    return () => {
      this.setState({
        navigatorType : navigatorType
      })
    }
  }

  // This function "exits" Viro by setting the navigatorType to UNSET.
  _exitViro() {
    this.setState({
      navigatorType : UNSET
    })
  }
}

var localStyles = StyleSheet.create({
  viroContainer :{
    flex : 1,
    backgroundColor: "black",
  },
  outer : {
    flex : 1,
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor: "black",
  },
  inner: {
    flex : 1,
    flexDirection: 'column',
    alignItems:'center',
    backgroundColor: "black",
  },
  titleText: {
    paddingTop: 30,
    paddingBottom: 20,
    color:'#fff',
    textAlign:'center',
    fontSize : 25
  },
  buttonText: {
    color:'black',
    textAlign:'center',
    fontSize : 20
  },
  buttons : {
    height: 80,
    width: 150,
    paddingTop:20,
    paddingBottom:20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  screenIcon: {
    position : 'absolute',
    height: 58,
    width: 58,
  },
  exitButton : {
    height: 50,
    width: 100,
    paddingTop:10,
    paddingBottom:10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
    helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 60,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',  
  },
});

module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
module.exports = ViroSample
