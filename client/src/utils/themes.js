import white_circle from '../media/loading_circle_white.png';
import black_circle from '../media/loading_circle_black.png';
import hamburger_normal_white from '../media/hamburger_normal_white.png';
import hamburger_normal_black from '../media/hamburger_normal_black.png';
import hamburger_x_white from '../media/hamburger_x_white.png';
import hamburger_x_black from '../media/hamburger_x_black.png';
import dots_black from '../media/dots_icon_black.png';
import dots_white from '../media/dots_icon_white.png';
import new_icon_black from '../media/new_icon_black.png';
import new_icon_white from '../media/new_icon_white.png';
import arrow_right_black from '../media/arrow_right_black.png';
import arrow_right_white from '../media/arrow_right_white.png';
import arrow_left_black from '../media/arrow_left_black.png';
import arrow_left_white from '../media/arrow_left_white.png';
import refresh_icon_black from '../media/refresh_icon_black.png';
import refresh_icon_white from '../media/refresh_icon_white.png';
import search_icon_black from '../media/search_icon_black.png';
import search_icon_white from '../media/search_icon_white.png';

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
    safeColor: '#0a84ff',
    dangerColor: '#ED230D',
    greenColor: '#1EB100',
    darkerGreenColor: '#168500',
    orangeColor: '#FFA500',
    darkerDangerColor: '#c21b0a',
    greyedOutColor: '#757575',
    loadingCircle: black_circle,
    hamburger_normal: hamburger_normal_black,
    hamburger_x: hamburger_x_black,
    dots: dots_black,
    new_icon: new_icon_black,
    arrow_right: arrow_right_black,
    arrow_left: arrow_left_black,
    refresh_icon: refresh_icon_black,
    search_icon: search_icon_black
  },
  dark: {
    primaryColor: '#000000',
    textColor: '#ffffff',
    borderColor: '#ffffff',
    inputBckgColor: '#000000',
    accentColor: '#0a84ff',
    darkerAccentColor: '#0a6ac9',
    safeColor: '#0a84ff',
    dangerColor: '#ED230D',
    greenColor: '#1EB100',
    darkerGreenColor: '#168500',
    orangeColor: '#FFA500',
    darkerDangerColor: '#c21b0a',
    greyedOutColor: '#757575',
    loadingCircle: white_circle,
    hamburger_normal: hamburger_normal_white,
    hamburger_x: hamburger_x_white,
    dots: dots_white,
    new_icon: new_icon_white,
    arrow_right: arrow_right_white,
    arrow_left: arrow_left_white,
    refresh_icon: refresh_icon_white,
    search_icon: search_icon_white
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