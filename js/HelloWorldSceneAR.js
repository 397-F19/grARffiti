'use strict';

import React, { Component } from 'react';

import {StyleSheet, TouchableHighlight, View, Image} from 'react-native';

import {
  ViroARScene,
  ViroText,
  ViroMaterials,
  ViroBox,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroARPlane,
  ViroARPlaneSelector,
  ViroQuad,
  ViroNode,
  ViroAnimations,
  ViroConstants,
} from 'react-viro';



export default class HelloWorldSceneAR extends Component {
   constructor() {
    super();

    this.state = {
      hasARInitialized : false,
      text : "Initializing AR...",
      lat: null,
      lng: null,
    }
    this._onTrackingUpdated = this._onTrackingUpdated.bind(this);
    this.inPolygon = this.inPolygon.bind(this);
  }

  componentDidMount() {
   
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let point = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })

        let polygonArray = [
          {
            x: point.lat - 0.2,
            y: point.lng - 0.2
          },
          {
            x: point.lat+0.2,
            y: point.lng+0.2
          }
        ] // example of polygonArray 
   
        if (this.inPolygon(point, polygonArray)) {
          this.setState({
            text: "Hello mudd"
          })
        } else {
          this.setState({
            text: "bye cruel world"
          })
        }
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  render () {
    return (
      <ViroARScene onTrackingUpdated={this._onTrackingUpdated}>

        {/* Text to show whether or not the AR system has initialized yet, see ViroARScene's onTrackingInitialized*/}
        <ViroText text={this.state.text} scale={[.5, .5, .5]} position={[0, 0, -1]} style={styles.helloWorldTextStyle} />
        <ViroText text={this.state.lat} scale={[.5, .5, .5]} position={[0, 1, -1]} style={styles.helloWorldTextStyle} />
        <ViroText text={this.state.lng} scale={[.5, .5, .5]} position={[0, -1, -1]} style={styles.helloWorldTextStyle} />

        <ViroAmbientLight color={"#aaaaaa"} influenceBitMask={1} />

        <ViroSpotLight
            innerAngle={5}
            outerAngle={90}
            direction={[0,-1,-.2]}
            position={[0, 3, 1]}
            color="#aaaaaa"
            castsShadow={true}
            />

        {/* Node that contains a light, an object and a surface to catch its shadow
            notice that the dragType is "FixedToWorld" so the object can be dragged
            along real world surfaces and points. */}
        <ViroNode position={[-.5, -.5, -.5]} dragType="FixedToWorld" onDrag={()=>{}} >

          {/* Spotlight to cast light on the object and a shadow on the surface, see
              the Viro documentation for more info on lights & shadows */}
          <ViroSpotLight
            innerAngle={5}
            outerAngle={45}
            direction={[0,-1,-.2]}
            position={[0, 3, 0]}
            color="#ffffff"
            castsShadow={true}
            influenceBitMask={2}
            shadowMapSize={2048}
            shadowNearZ={2}
            shadowFarZ={5}
            shadowOpacity={.7} />

          <Viro3DObject
              source={require('./res/emoji_smile/emoji_smile.vrx')}
              position={[0, .2, 0]}
              scale={[.2, .2, .2]}
              type="VRX"
            lightReceivingBitMask={3}
            shadowCastingBitMask={2}
            transformBehaviors={['billboardY']}
            resources={[require('./res/emoji_smile/emoji_smile_diffuse.png'),
                       require('./res/emoji_smile/emoji_smile_specular.png'),
                       require('./res/emoji_smile/emoji_smile_normal.png')]}/>

          <ViroQuad
            rotation={[-90,0,0]}
            width={.5} height={.5}
            arShadowReceiver={true}
            lightReceivingBitMask={2} />

        </ViroNode>

        {/* Node that contains a light, an object and a surface to catch its shadow
          notice that the dragType is "FixedToWorld" so the object can be dragged
          along real world surfaces and points. */}
        <ViroNode position={[.5,-.5,-.5]} dragType="FixedToWorld" onDrag={()=>{}} >

          {/* Spotlight to cast light on the object and a shadow on the surface, see
              the Viro documentation for more info on lights & shadows */}
          <ViroSpotLight
            innerAngle={5}
            outerAngle={45}
            direction={[0,-1,-.2]}
            position={[0, 3, 0]}
            color="#ffffff"
            castsShadow={true}
            influenceBitMask={4}
            shadowMapSize={2048}
            shadowNearZ={2}
            shadowFarZ={5}
            shadowOpacity={.7} />

          <Viro3DObject
            source={require('./res/object_soccerball/object_soccer_ball.vrx')}
            position={[0, .15, 0]}
            scale={[.3, .3, .3]}
            type="VRX"
            lightReceivingBitMask={5}
            shadowCastingBitMask={4}
            transformBehaviors={['billboardY']}
            resources={[require('./res/object_soccerball/object_soccer_ball_diffuse.png'),
                       require('./res/object_soccerball/object_soccer_ball_normal.png'),
                       require('./res/object_soccerball/object_soccer_ball_specular.png')]}/>
          <ViroQuad
            rotation={[-90,0,0]}
            width={.5} height={.5}
            arShadowReceiver={true}
            lightReceivingBitMask={4} />

        </ViroNode>

      </ViroARScene>
    );
  }

  inPolygon(point, poly) {
    var x = point.lat, y = point.lng;

    for (var i = 0; i < (poly.length - 1); i++) {
        var vertex1 = poly[i], vertex2 = poly[i+1];

        var maxX = Math.max(vertex1.x, vertex2.x), minX = Math.min(vertex1.x, vertex2.x),
            maxY = Math.max(vertex1.y, vertex2.y), minY = Math.min(vertex1.y, vertex2.y);

        if(x < minX || x > maxX || y < minY || y > maxY) {
            console.log("NO");
            return false;
        }
    }

    console.log("YES");
    return true;
}


  _onTrackingUpdated(state, reason) {
    // if the state changes to "TRACKING_NORMAL" for the first time, then
    // that means the AR session has initialized!
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.setState({
        hasARInitialized : true,
      });
    }
  }
};

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});


ViroAnimations.registerAnimations({
  rotate: {
    properties: {
      rotateY: "+=90"
    },
    duration: 250, //.25 seconds
  },
});

module.exports = HelloWorldSceneAR;
