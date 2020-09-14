import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  asset,
  Environment,
  NativeModules,
  Image,
} from 'react-360';
import TourHotspot from 'TourHotspot.react';
import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import lodash from 'lodash';

const Hotspot = (props) => {
  const {useDynamicSurface, mainSurfaceWidth, ...otherProps} = props;
  return <TourHotspot {...otherProps} />
};

const Control = NativeModules.Control;

class BrowserBridge {
  constructor() {
      this._subscribers = {};
  }

  subscribe(handler) {
      const key = String(Math.random());
      this._subscribers[key] = handler;
      return () => {
          delete this._subscribers[key];
      };
  }

  notifyEvent(accion, dato1) {
      lodash.forEach(this._subscribers, handler => {
          handler(accion, dato1);
      });
  }
}

const browserBridge = new BrowserBridge();
BatchedBridge.registerCallableModule('BrowserBridge', browserBridge);


export default class manageLinks extends React.Component {

  constructor(props){
    super(props);
    this.informationLinks = null;
    this.enlaceLinks = null;
    this.editable = null;
    this.state = {
      salaUrl: '360_2 - Panorama.jpg',
      salaId: '',
      posX: '',
      posY: '',
      posZ: '',
      action: 0
    }
  }

  onBrowserEvent = (info, data) => {
    console.log('AQUIIIIII: ');
    accion = info.split(';')[0];
    switch (accion) {
      case 'cambioAmbiente':
        // datos = data.split(';')
        console.log(data);
        this.informationLinks = data.informationLinks;
        this.enlaceLinks = data.enlaceLinks;
        this.setState({
          salaUrl: data.salaUrl,
          salaId: data.salaId,
          action: 0
        });
        // this.getEnlaceLinks(datos[1]);
        // this.getInformationLinks(datos[0], datos[1]);
        break;
      case 'cambioUbicacion':
        console.log('mande');
        console.log(data);
        this.editable = data.editable;
        this.setState({
          posX: data.posX,
          posY: data.posY,
          posZ: data.posZ,
          action: 1,
        });
        this.editable = '';
        break;
      default:
        //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
        break;
      }
  }

  componentDidMount(){
    console.log('1');
    console.log(this.state);
    
    this.unsubscribe = browserBridge.subscribe(this.onBrowserEvent);
    console.log(Control);
    Control.fillMuseos();
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
        this.unsubscribe();
        delete this.unsubscribe;
    }
  }

  render() {

    if(this.state.action == 0){
      Environment.setBackgroundImage(
        asset(this.state.salaUrl),
        {
          format: '2D',
          // transition: ,
          // rotate the background image to the rotation offset so we are smoothly
          // transiting from one to another
          // rotateTransform: [{rotateY: `${-nextRotation}deg`}],
        });
    }
    

    return (
      <View  style={{
        width: 4096,
        height: 600,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        { this.informationLinks &&
          this.informationLinks.map((link, index) => {
              if('info'+link.idObra == this.editable){
                console.log('1');
                return(
                  <Hotspot
                    key={'info'+link.idObra}
                    rotationY={this.state.posY}
                    rotationX={this.state.posX}
                    rotationZ={this.state.posZ}>
                    <Image source={asset('info_icon.png')} style={{width: 40, height: 40}} />
                  </Hotspot>
                );
              }else{
                console.log('2');
                return(
                  <Hotspot
                    key={link.idObra}
                    rotationY={link.posY}
                    rotationX={link.posX}
                    rotationZ={link.posZ}>
                    <Image source={asset('info_icon.png')} style={{width: 40, height: 40}} />
                  </Hotspot>
                );
              }
          }) 
        }
        { this.enlaceLinks &&
          this.enlaceLinks.map((link, index) => {
            if('nav'+link.idEnlace == this.editable){
              console.log('3');
              console.log(link);
              return(
                <Hotspot
                  key={'nav'+link.idEnlace}
                  rotationY={this.state.posY}
                  rotationX={this.state.posX}
                  rotationZ={this.state.posZ}>
                  <Image source={asset('nav_icon.png')} style={{width: 60*1.4, height: 60*0.6}} />
                </Hotspot>
              );
            }else{
              console.log('4');
              console.log(link);
              return(
                <Hotspot
                  key={'nav'+link.idEnlace}
                  rotationY={link.posYIcono}
                  rotationX={link.posXIcono}
                  rotationZ={link.posZIcono}>
                  <Image source={asset('nav_icon.png')} style={{width: 60*1.4, height: 60*0.6}} />
                </Hotspot>
              );
            }
          })
        }   
      </View> 
      
    );
    
  }

  

};

const styles = StyleSheet.create({
  panel: {
    // Fill the entire surface
    width: 1000,
    height: 600,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingBox: {
    padding: 20,
    backgroundColor: '#000000',
    borderColor: '#639dda',
    borderWidth: 2,
  },
  greeting: {
    fontSize: 30,
  },
});

AppRegistry.registerComponent('manageLinks', () => manageLinks);
