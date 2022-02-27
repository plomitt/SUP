import styled from 'styled-components';
import $ from 'jquery';
import themes from './themes';
import logo from '../media/sup_logo_2.png';
import icon from '../media/sup_icon_144.png';
import placeholder_pfp from '../media/placeholder_pfp.png';
import React from 'react';
import style from '../styles/additional.module.css';
import languages from './languages';

export function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export function getEmptyUserProfileFields() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user === null) {
    return [];
  }

  const fields = ['pfp', 'name', 'surname', 'grade', 'bio', 'subjectsCanHelp', 'subjectsNeedHelp', 'phone'];
  const emptyFields = [];
  
  fields.forEach(element => {
    if (user[element] === undefined) {
      emptyFields.push(element);
    }
  })

  return emptyFields;
}

export function redirectIfEmptyUserProfileFields(history) {
  const fields = getEmptyUserProfileFields();

  if (fields.length !== 0) {
    const path = '/userpreferences?tab=profile&showpopup=true'
    localStorage.setItem('authorized', 'true');

    history.push(path);
  }
}

export function getUserData(data) {
  const user = JSON.parse(localStorage.getItem('user'));

  // if (data === 'email') {
  //   if (user.role === 'student') {
  //     return user.email + '@edu.sk.ru';
  //   }

  //   if (user.role === 'teacher') {
  //     return user.email + '@sk.ru';
  //   }
  // }
  
  // if (data !== 'email') {
  //   return user.data;
  // }

  return user[data];
}

export function setUserData(name, data) {
  let user = JSON.parse(localStorage.getItem('user'));
  user[name] = data;

  localStorage.setItem('user', JSON.stringify(user));
}


export function getUrlParam(param) {
  const params = (new URL(document.location)).searchParams;
  return params.get(param);
}

export const Button = styled.button`
  display: inline-block;
  border-style: solid;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${props => props.theme.borderColor};

  font-size: 14pt;

  height: 48px;

  padding-left: 17px;
  padding-right: 17px;

  background-color: ${props => props.theme.accentColor};
  color: white;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.darkerAccentColor};
  }
`

export const StyledInput = styled.input`
  background-color: ${props => props.theme.inputBckgColor};
  color: ${props => props.theme.textColor};

  border-radius: 10px;
  border-width: 1px;
`

export const StyledInputDiv = styled.div`
  margin: auto;
  border-style: solid;
  border-radius: 10px;
  border-width: 1px;
  margin-top: 10px;
  border-color: ${props => props.theme.borderColor};

  width: 80%;
  height: 56px;

  font-size: 15pt;

  padding-left: 5px;
  padding-right: 5px;
`

export const SelectContainer = styled.div`
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`

export const StyledSelect = styled.select`
  border: none;
  background-color: ${props => props.theme.primaryColor};
  color: ${props => props.theme.textColor};
  height: 16px;


  padding-right: 10px;
  z-index: 2;
  background-color: transparent;

  -webkit-appearance: none;
  appearance: none;
  

  ${SelectContainer}:hover & {
    cursor: pointer;
    color: ${props => props.theme.darkerAccentColor};
  }
`

export const ArrowDown = styled.div`
  width: 0; 
  height: 0; 
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  margin-top: 2px;
  margin-left: -10px;
  z-index: 1;

  border-top: 6px solid ${props => props.theme.textColor};

  ${SelectContainer}:hover & {
    border-top-color: ${props => props.theme.darkerAccentColor};
  }
`

export function checkIfUserSignedIn() {
  return sendRequest('/checksignin', 'GET');
}

export function updateUserData(history) {

  sendRequest('/getuserdata', 'GET')
  .then(response => {
    if (response.status === 'ok') {
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    if (response.status === 'error') {
      signOut();
      history.push('/');
    }
  })

}

export function ThemeSelector(props) {
  let options = [];
  const keys = Object.keys(themes);

  for (let key of keys) {
    options.push(<option key={key} value={key}>{languages[props.language].general.themeSelect[key]}</option>)
  }

  return (
    <SelectContainer className={props.classname}>
      <StyledSelect id='themeSelect' className={props.style.themeSelect} onChange={(e) => { props.changeTheme(e.target.value) }} value={localStorage.getItem('theme')}>
        {options}
      </StyledSelect>
      <ArrowDown onClick={() => { document.getElementById('themeSelect').click() }} />
    </SelectContainer>
  )
}

export function LanguageSelector(props) {
  return (
    <SelectContainer>
      <StyledSelect className={props.style.languageSelect} onChange={(e) => { props.changeLanguage(e.target.value) }} value={localStorage.getItem('language')}>
        <option value='en'>{languages[props.language].general.languageSelect.en}</option>
        <option value='ru'>{languages[props.language].general.languageSelect.ru}</option>
      </StyledSelect>
      <ArrowDown />
    </SelectContainer>
  )
}


export function checkFile(file) {
  if (file.size > 1048576) {
    return 'file_too_large';
  }

  if (!file.type.match('image.*')) {
    return 'wrong_type'
  }

  return true;
}

export function stringifyPhone(phone) {
  return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' + phone.slice(6, 8) + '-' + phone.slice(8, 10);
}

export function checkPhone(phone) {
  if (/^[0-9]{10}$/.test(phone)) {
    return true;
  }

  return 'incorrect';
}

export function checkGrade(grade) {
  if (/(?=.*[^A-Za-z0-9])/.test(grade)) {
    return 'contains_spec_chars';
  } else if (/\d\d[A-G]/.test(grade) && !/\d(?=.{3,})/.test(grade)) {
    const found = parseInt(grade.match(/\d\d/));
    if (0 < found && found < 12) {
      return true;
    } else {
      return 'wrong_grade';
    }
  } else if (!/\d\d[A-G]/.test(grade) && /\d[A-G]/.test(grade) && !/\d(?=.{3,})/.test(grade)) {
    const found = parseInt(grade.match(/\d/));
    if (0 < found && found < 12) {
      return true;
    } else {
      return 'wrong_grade';
    }
  } else {
    return 'incorrect';
  }
}

export function checkBio(bio) {
  if (!/(?=.{1,})/.test(bio)) {
    return 'too_short';
  }

  if (/(?=.{250,})/.test(bio)) {
    return 'too_long';
  }

  return true;
}

export function checkName(name) {
  if (!/(?=.{1,})/.test(name)) {
    return 'too_short';
  }

  if (/(?=.{15,})/.test(name)) {
    return 'too_long';
  }

  if (/(?=.*[^A-Za-z0-9])/.test(name)) {
    return 'contains_spec_chars';
  }

  if (/(?=.*[0-9])/.test(name)) {
    return 'contains_digits';
  }

  return true;
}

export function checkEmail(email) {
  if (!/(?=.{4,})/.test(email)) {
    return 'too_short';
  }

  if (/(?=.{25,})/.test(email)) {
    return 'too_long';
  }

  if (/(?=.*[^A-Za-z0-9])/.test(email)) {
    return 'contains_spec_chars';
  }

  return true;
}

export function checkPassword(password) {
  if (!/(?=.{8,})/.test(password)) {
    return 'too_short';
  }

  if (/(?=.{25,})/.test(password)) {
    return 'too_long';
  }

  if (!/(?=.*[^A-Za-z0-9])/.test(password)) {
    return 'no_spec_chars';
  }

  if (!/(?=.*[0-9])/.test(password)) {
    return 'no_digits';
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return 'no_uppercase';
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return 'no_lowercase';
  }

  return true;
}

export function sendRequest(path, method, data) {
  return $.ajax({
    url: process.env.REACT_APP_API_SERVER + path,
    method: method,
    data: data
  })
}

export function signOut() {
  try {
    sendRequest('/signout', 'GET');
    localStorage.removeItem('user');
    localStorage.removeItem('authorized');
  } catch (e) {}
}

export const StyledFooter= styled.div`
  background-color: ${props => props.theme.primaryColor};
  color: ${props => props.theme.textColor};

  bottom: 0;
  z-index: 3;
  display: flex;
  position: fixed;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 30px;
`

export function Footer(props) {
  return (
    <StyledFooter>
      <p>Made by Tim</p>
    </StyledFooter>
  );
}

const PopUp = styled.div`
  background-color: ${props => props.theme.primaryColor};
  border-color: ${props => props.theme.borderColor};
`

export class MessagePopUp extends React.Component {
  hide() {
    try {
      document.getElementById(this.props.elementId).style = 'opacity: 1;';
    } catch (e) {}
    this.props.setMessage(false, false, false, false, false);
  }

  hideMessage(src) {
    if (src === 'event') {
      if (this.props.preventAutoHiding !== true) {
        this.hide();
      }
    } else {
      this.hide();
    }
  }

  componentDidMount() {
    window.addEventListener('keyup', () => {this.hideMessage('event')});
    window.addEventListener('mousedown', () => {this.hideMessage('event')});
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', () => {this.hideMessage('event')});
    window.removeEventListener('mousedown', () => {this.hideMessage('event')});
  }

  render() {
    if (this.props.showMessage !== false) {
      try {
        document.getElementById(this.props.elementId).style = 'opacity: 0.5;';
      } catch (e) {}

      const titleStyle = "fieldspopup_title_" + this.props.titleType;
      let msg;

      if (this.props.msgType === 'text') {
        msg = (
          <p className={style.fieldspopup_text}>{this.props.showMessage}</p>
        );
      } else {
        msg = this.props.showMessage;
      }

      return (
        <PopUp className={style.fieldspopup_box} id='messageBox'>
          <div className={style.fieldspopup_title_container}>
            <p className={style[titleStyle]}>{this.props.title}</p>
            <img src={this.props.theme.hamburger_x} alt='hamburger' className={style.fieldspopup_x} onClick={() => { this.hideMessage('btn'); }}></img>
          </div>
          <div className={style.fieldspopup_body_container}>
            {msg}
          </div>
      </PopUp>
      )
    } else {
      try {
        document.getElementById(this.props.elementId).style = 'opacity: 1;';
      } catch (e) {}

      return (
        <div></div>
      )
    }
  }

}

const StyledDiv = styled.div`
  color: ${props => props.theme.textColor};
  background-color: ${props => props.theme.primaryColor};
  border-color: ${props => props.theme.borderColor};
`

const StyledMenuBar = styled.div`
  color: ${props => props.theme.textColor};
  background-color: ${props => props.theme.primaryColor};
  border-color: ${props => props.theme.primaryColor};
`

const StyledP = styled.p`
  color: ${props => props.theme.textColor};
`

const StyledDropdown = styled.div`
  display: none;

  color: ${props => props.theme.textColor};
  background-color: ${props => props.theme.primaryColor};
  border-color: ${props => props.theme.borderColor};
`

const DropdownContainer = styled.div`
  &:hover {
    ${StyledDropdown} {
      display: block;
    }
  }
`

const StyledMenuCenterText = styled.p`
  &:hover {
    cursor: pointer;
    color: ${props => props.theme.darkerAccentColor};
  }
`

const StyledSelectedText = styled.p`
  color: ${props => props.theme.accentColor};

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.darkerAccentColor};
  }
`

const StyledText = styled.p`
  &:hover {
    cursor: pointer;
    color: ${props => props.theme.darkerAccentColor};
  }
`

const DangerText = styled.p`
  color: ${props => props.theme.dangerColor};

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.darkerDangerColor};
  }
`

const StyledDesktopMenuBarDropdown = styled.div`
  margin: 0;
  padding: 5px;

  & p {
    padding: 0px;
    margin: 0px;
  }

  & div:hover {
    color: white;
  }

  & li:first-child {
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
  }

  & li {
    list-style-type: none;
    height: 30px;
    display: flex;
    align-items: center;

    padding-right: 5px;
    padding-left: 5px;

    border-top-right-radius: 10px;
    border-top-left-radius: 10px;

    border-bottom-style: solid;
    border-bottom-color: gray;
    border-bottom-width: 1px;
  }
  
  & li:last-child {
    border: none;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  // & li:hover {
  //   background-color: ${props => props.theme.layer3};
  // }

  & select {
    font-size: 12pt;
    height: 20px;
  }

  & a {
    text-decoration: none;
  }
`

const StyledMenuBarMobileUl = styled.ul`
  z-index: 3;
  padding-right: 40px;
  margin-top: 48px;

  & li {
    list-style-type: none;
    height: 48px;
    display: flex;
    align-items: center;
    
    border-bottom-style: solid;
    border-bottom-color: gray;
    border-bottom-width: 1px;
  }

  & li:last-child {
    border: none;
  }

  & select {
    font-size: 12pt;
    height: 20px;
  }

  & a {
    text-decoration: none;
  }
`

const SelectedP = styled.p`
  color: ${props => props.theme.dangerColor};

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.darkerDangerColor};
  }
`

function confirmSignOut(setMessage, history) {
  const body = (
    <div className={style.dialog_btn_container}>
      <Button onClick={() => { setMessage(false, false, false, false, false); }}>Cancel</Button>
      <SelectedP className={style.dialog_confirm} onClick={() => { signOut(); history.push('/'); }}>Sign out</SelectedP>
    </div>
  )

  setMessage(body, 'other', 'Sign out?', 'normal', true);
}

export function LoadingCircle(props) {
  return (
    <img src={props.theme.loadingCircle} alt='Loading...' className={style.loading_circle}></img>
  )
}

const StyledPfp = styled.img`
  border-color: ${props => props.theme.textColor};
`

export function PFP(props) {
  const user = JSON.parse(localStorage.getItem('user'));
  
  let pfp;
  if (user.pfp === 'default' || user.pfp === undefined) {
    pfp = placeholder_pfp;
  } else {
    pfp = 'data:image/png;base64,' + user.pfp;
  }

  return (
    <StyledPfp src={pfp} alt='pfp' className={style[props.type]} onClick={props.onClick}></StyledPfp>
  )
}

function MenuBarDesktop(props) {
  const user = localStorage.getItem('user');

  if (user === null) {
    return (
      <StyledMenuBar className={style.menu_bar_desktop}>
        <img src={logo} alt='sup_logo' className={style.logo} onClick={() => { props.history.push('/') }}></img>
        <div className={style.flex_box}>
          <div className={style.selectors_div}>
            <ThemeSelector classname={style.theme_select} changeTheme={props.changeTheme} language={props.language} style={style}></ThemeSelector>
            <LanguageSelector language={props.language} style={style} changeLanguage={props.changeLanguage}></LanguageSelector>
          </div>
          <Button className={style.signin_btn} onClick={() => { props.history.push('/signin') }}>{languages[props.language].landing_page.signin_btn}</Button>
        </div>
      </StyledMenuBar>
    )
  } else {
    return (
      <StyledMenuBar className={style.menu_bar_desktop}>
        <img src={logo} alt='sup_logo' className={style.logo} onClick={() => { props.history.push('/') }}></img>
        <MenuBarCenterText history={props.history} style={style} language={props.language} />
        <DropdownContainer className={style.flex_box}>
          <div className={style.menubar_spacer}></div>
          <PFP theme={props.theme} type={'desktop_menubar_pfp'} onClick={() => { props.history.push('/userpreferences') }}/>
          <MenuBarDesktopDropdown setMessage={props.setMessage} history={props.history} style={style} changeTheme={props.changeTheme} changeLanguage={props.changeLanguage} language={props.language} />
        </DropdownContainer>
      </StyledMenuBar>
    )
  }
}

function MenuBarCenterText(props) {
  const destination = props.history.location.pathname;

  if (destination === '/work') {
    return (
      <div className={style.flex_box}>
        <StyledSelectedText onClick={() => props.history.push('/work')}>{languages[props.language].general.menu.work}</StyledSelectedText>
        <StyledMenuCenterText onClick={() => props.history.push('/talent')} className={style.menu_talent}>{languages[props.language].general.menu.talent}</StyledMenuCenterText>
        <StyledMenuCenterText onClick={() => props.history.push('/myjobs')}>{languages[props.language].general.menu.myjobs}</StyledMenuCenterText>
      </div>
    )
  } else if (destination === '/talent') {
    return (
      <div className={style.flex_box}>
        <StyledMenuCenterText onClick={() => props.history.push('/work')}>{languages[props.language].general.menu.work}</StyledMenuCenterText>
        <StyledSelectedText onClick={() => props.history.push('/talent')} className={style.menu_talent}>{languages[props.language].general.menu.talent}</StyledSelectedText>
        <StyledMenuCenterText onClick={() => props.history.push('/myjobs')}>{languages[props.language].general.menu.myjobs}</StyledMenuCenterText>
      </div>
    )
  } else if (destination === '/myjobs') {
    return (
      <div className={style.flex_box}>
        <StyledMenuCenterText onClick={() => props.history.push('/work')}>{languages[props.language].general.menu.work}</StyledMenuCenterText>
        <StyledMenuCenterText onClick={() => props.history.push('/talent')} className={style.menu_talent}>{languages[props.language].general.menu.talent}</StyledMenuCenterText>
        <StyledSelectedText onClick={() => props.history.push('/myjobs')}>{languages[props.language].general.menu.myjobs}</StyledSelectedText>
      </div>
    )
  } else {
    return (
      <div className={style.flex_box}>
        <StyledMenuCenterText onClick={() => props.history.push('/work')}>{languages[props.language].general.menu.work}</StyledMenuCenterText>
        <StyledMenuCenterText onClick={() => props.history.push('/talent')} className={style.menu_talent}>{languages[props.language].general.menu.talent}</StyledMenuCenterText>
        <StyledMenuCenterText onClick={() => props.history.push('/myjobs')}>{languages[props.language].general.menu.myjobs}</StyledMenuCenterText>
      </div>
    )
  }
}

function MenuBarDesktopDropdown(props) {
  return (
    <StyledDropdown className={style.menu_desktop_dropdown_container}>
      <StyledDesktopMenuBarDropdown>
        <li><StyledText onClick={() => props.history.push('/userpreferences')}>{languages[props.language].general.menu.link_user_pref_page}</StyledText></li>
        <li><ThemeSelector changeTheme={props.changeTheme} language={props.language} style={style}></ThemeSelector></li>
        <li><LanguageSelector language={props.language} style={style} changeLanguage={props.changeLanguage}></LanguageSelector></li>
        <li><DangerText onClick={() => { confirmSignOut(props.setMessage, props.history); }}>{languages[props.language].general.menu.signout_btn}</DangerText></li>
      </StyledDesktopMenuBarDropdown>
    </StyledDropdown>
  )
}


function MenuBarMobile(props) {
  const user = localStorage.getItem('user');

  if (user === null) {
    return (
      <StyledMenuBar className={style.menu_bar_mobile}>
        <img src={props.hamburger} alt='hamburger' className={style.hamburger} onClick={() => { props.toggleMenu() }}></img>
        <img src={icon} alt='sup_icon' className={style.icon} onClick={() => { props.history.push('/') }}></img>
        <span className={style.spacer}></span>
      </StyledMenuBar>
    )
  } else {
    return (
      <StyledMenuBar className={style.menu_bar_mobile}>
        <img src={props.hamburger} alt='hamburger' className={style.hamburger} onClick={() => { props.toggleMenu() }}></img>
        <img src={icon} alt='sup_icon' className={style.icon} onClick={() => { props.history.push('/') }}></img>
        <PFP style={style} theme={props.theme} type={'mobile_menubar_pfp'} onClick={() => { props.history.push('/userpreferences') }}/>
      </StyledMenuBar>
    )
  }
}

function MenuBodyMobile(props) {
  const user = localStorage.getItem('user');

  if (user === null) {
    return (
      <StyledDiv>
        <StyledMenuBarMobileUl>
          <li><StyledP onClick={() => { props.history.push('/') }}>{languages[props.language].general.menu.landing_text}</StyledP></li>
          <li><StyledP onClick={() => { props.history.push('/signin') }}>{languages[props.language].general.menu.signin_btn}</StyledP></li>
          <li><ThemeSelector changeTheme={props.changeTheme} language={props.language} style={style}></ThemeSelector></li>
          <li><LanguageSelector language={props.language} style={style} changeLanguage={props.changeLanguage}></LanguageSelector></li>
        </StyledMenuBarMobileUl>
      </StyledDiv>
    )
  } else {
    return (
      <StyledDiv>
        <StyledMenuBarMobileUl>
          <li><StyledP onClick={() => { props.history.push('/') }}>{languages[props.language].general.menu.landing_text}</StyledP></li>
          <li><StyledP onClick={() => { props.history.push('/work') }}>{languages[props.language].general.menu.work}</StyledP></li>
          <li><StyledP onClick={() => { props.history.push('/talent') }}>{languages[props.language].general.menu.talent}</StyledP></li>
          <li><StyledP onClick={() => { props.history.push('/myjobs') }}>{languages[props.language].general.menu.myjobs}</StyledP></li>
          <li><StyledP onClick={() => { props.history.push('/userpreferences') }}>{languages[props.language].general.menu.link_user_pref_page}</StyledP></li>
          <li><ThemeSelector changeTheme={props.changeTheme} language={props.language} style={style}></ThemeSelector></li>
          <li><LanguageSelector language={props.language} style={style} changeLanguage={props.changeLanguage}></LanguageSelector></li>
          <li><DangerText onClick={() => { confirmSignOut(props.setMessage, props.history); }}>{languages[props.language].general.menu.signout_btn}</DangerText></li>
        </StyledMenuBarMobileUl>
      </StyledDiv>
    )
  }
}

export class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.windowSizeChanged = this.windowSizeChanged.bind(this);

    this.state = {
      showMenu: false,
      menuType: 'desktop',
      signoutError: false
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowSizeChanged);
    this.windowSizeChanged();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowSizeChanged);
  }

  windowSizeChanged() {
    if (window.innerWidth > 670) {
      this.setState({
        showMenu: false,
        menuType: 'desktop'
      })

    } else {
      this.setState({
        menuType: 'mobile'
      })
    }
  }

  toggleMenu() {
    this.setState({
      showMenu: !this.state.showMenu
    })

    if (this.state.showMenu === false) {
      document.getElementById('pageBody').style = 'display: none;'
    } else {
      document.getElementById('pageBody').style = ''
    }

  }
  
  render() {
    let toShow;

    if (this.state.menuType === 'desktop') {
      toShow = (
        <MenuBarDesktop setMessage={this.props.setMessage} history={this.props.history} style={this.props.style} theme={this.props.theme} language={this.props.language} changeLanguage={this.props.changeLanguage} changeTheme={this.props.changeTheme}></MenuBarDesktop>
      )
    } else {
      if (this.state.showMenu === false) {
        toShow = (
          <MenuBarMobile setMessage={this.props.setMessage} history={this.props.history} style={this.props.style} theme={this.props.theme} hamburger={this.props.theme.hamburger_normal} language={this.props.language} toggleMenu={this.toggleMenu}></MenuBarMobile>
        )
      } else {
        toShow = (
          <div>
            <MenuBarMobile setMessage={this.props.setMessage} history={this.props.history} style={this.props.style} theme={this.props.theme} hamburger={this.props.theme.hamburger_x} language={this.props.language} toggleMenu={this.toggleMenu}></MenuBarMobile>
            <MenuBodyMobile setMessage={this.props.setMessage} history={this.props.history} style={this.props.style} language={this.props.language} changeTheme={this.props.changeTheme} changeLanguage={this.props.changeLanguage} toggleMenu={this.toggleMenu}></MenuBodyMobile>
          </div>
        )
      }
    }


    return toShow
  }
}