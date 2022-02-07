import white_circle from '../loading_circle_white.png';
import black_circle from '../loading_circle_black.png';
import hamburger_normal_white from '../hamburger_normal_white.png';
import hamburger_normal_black from '../hamburger_normal_black.png';
import hamburger_x_white from '../hamburger_x_white.png';
import hamburger_x_black from '../hamburger_x_black.png';

/*
DARK
  apple blue: 0a84ff
  darker apple blue: 0a6ac9
  
  my blue: 1a73e8
  my darker blue: 1967cf

LIGHT
  apple blue: 007ac9
  darker apple blue: 0071ba
*/


const themes = {
  light: {
    primaryColor: '#ffffff',
    textColor: '#000000',
    borderColor: '#000000',
    inputBckgColor: '#ffffff',
    accentColor: '#0a84ff',
    darkerAccentColor: '#0a6ac9',
    loadingCircle: black_circle,
    hamburger_normal: hamburger_normal_black,
    hamburger_x: hamburger_x_black
  },
  dark: {
    primaryColor: '#000000',
    textColor: '#ffffff',
    borderColor: '#ffffff',
    inputBckgColor: '#000000',
    accentColor: '#0a84ff',
    darkerAccentColor: '#0a6ac9',
    loadingCircle: white_circle,
    hamburger_normal: hamburger_normal_white,
    hamburger_x: hamburger_x_white
  },
  // dark: {
  //   layer1: '#000000',
  //   layer2: 'rgb(30, 30, 33)',
  //   layer3: 'rgb(50, 50, 53)',
  //   textColor: '#ffffff',
  //   borderColor: 'rgba(0, 0, 0, 0)',
  //   inputBckgColor: '#000000',
  //   accentColor: '#0a84ff',
  //   darkerAccentColor: '#0a6ac9',
  //   loadingCircle: white_circle,
  //   hamburger_normal: hamburger_normal_white,
  //   hamburger_x: hamburger_x_white
  // }
};

export default themes;