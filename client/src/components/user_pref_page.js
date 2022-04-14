import React from 'react';
import styled, { withTheme } from 'styled-components';
import style from '../styles/user_pref_page.module.css';
import { MessagePopUp, SelectContainer, StyledSelect, ArrowDown, StyledInput, Footer, Menu, getUrlParam, getUserData, setUserData, checkEmail, Button, sendRequest, checkPassword, LoadingCircle, PFP, checkName, capitalizeFirstLetter, checkBio, checkGrade, checkPhone, stringifyPhone, checkFile, getEmptyUserProfileFields } from '../utils/additional';
import languages from '../utils/languages';

const StyledP = styled.p`
  color: ${props => props.theme.textColor};

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.darkerAccentColor};
  }
`

const SelectedP = styled.p`
  color: ${props => props.theme.accentColor};

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.darkerAccentColor};
  }
`

const SelectedSubject = styled.p`
  color: ${props => props.theme.accentColor};
  margin: 0px;

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.darkerAccentColor};
  }
`

const UnselectedSubject = styled.p`
  color: ${props => props.theme.textColor};
  margin: 0px;

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.darkerAccentColor};
  }
`

const StyledLabel = styled.label`
  color: ${props => props.theme.textColor};
  font-size: 20pt;

  &:hover {
    cursor: pointer;
  }
`

const StyledTextarea = styled.textarea`
  color: ${props => props.theme.textColor};
  background-color: ${props => props.theme.primaryColor};

  font-family: 'Helvetica Neue', sans-serif;

  min-height: 54px;
  max-height: 498px;
  height: fit-content;
  width: -webkit-fill-available;

  resize: none;
`

const StyledInputDiv = styled.div`
  margin-right: 0;
  margin: 0;

  border-style: solid;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${props => props.theme.borderColor};

  height: 56px;

  font-size: 15pt;

  padding-left: 5px;
  padding-right: 5px;
`

const StyledSidebar = styled.div`
  padding: 10px;
  background-color: ${props => props.theme.primaryColor};
  border-radius: 10px;
`


function Verifification(props) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user.verified === true) {
    return (
      <p className={style['title_text' + props.menuType]}>
        {languages[props.language].user_preferences_page.verifification.title}
        <span className={style.verified}>
          {languages[props.language].user_preferences_page.verifification['verified']}
        </span>
      </p>
    )
  } else {
    return (
      <div>
        <p className={style['title_text' + props.menuType]}>
          {languages[props.language].user_preferences_page.verifification.title}
          <span className={style.not_verified}>
            {languages[props.language].user_preferences_page.verifification['not_verified']}
          </span>
        </p>
        <p className={style.verifification_text}>{languages[props.language].user_preferences_page.verifification.text}</p>
      </div>
    )
  }
}

class Email extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.setEmail = this.setEmail.bind(this);

    this.state = {
      showMenu: false,
      email1CheckResult: true,
      showEmail2Field: false,
      email2CheckResult: true,
      showLoadingCircle: false,
      userEmail: 'email',
      userShortEmail: 'email'
    }
  }

  componentDidMount() {
    this.setEmail();
  }

  hideMenu() {
    this.setState({
      showMenu: false,
      email1CheckResult: true,
      showEmail2Field: false,
      email2CheckResult: true,
      showLoadingCircle: false,
    })
  }

  setEmail() {
    const userShortEmail = getUserData('email');
    let userEmail = userShortEmail;
    const userRole = getUserData('role');

    if (userRole === 'student') {
      userEmail += '@edu.sk.ru';
    }

    if (userRole === 'teacher') {
      userEmail += '@sk.ru';
    }

    this.setState({
      userEmail: userEmail,
      userShortEmail: userShortEmail
    })
  }

  handleClick() {
    const email1 = document.getElementById('email1').value;
    let emailCheck1;
    
    if (email1 === this.state.userShortEmail) {
      emailCheck1 = 'cant_be_same_email';
    } else {
      emailCheck1 = checkEmail(email1);
    }

    if (emailCheck1 !== true) {
      this.setState({
        email1CheckResult: emailCheck1,
        email2CheckResult: true,
        showEmail2Field: false,
        showLoadingCircle: false
      })
    } else {
      this.setState({
        email1CheckResult: true,
        showLoadingCircle: false
      })
    }
    

    if (emailCheck1 === true) {
      this.setState({
        showEmail2Field: true,
        showLoadingCircle: false
      })

      const emailField2 = document.getElementById('email2');

      if (emailField2 !== null) {
        
        const role1 = document.getElementById('emailSelect1').value;
        const role2 = document.getElementById('emailSelect2').value;
        
        const emailCheck2 = (role1 === role2) && (email1 === emailField2.value);

        if (emailCheck2 === true) {
          this.setState({
            showLoadingCircle: true
          })
        

          sendRequest('/updateuserpreferences', 'POST', {data: JSON.stringify(['email', email1, role1])})
          .then(response => {
            this.setState({
              email1CheckResult: true,
              email2CheckResult: true,
              showLoadingCircle: false
            })

            if (response.status === 'success') {
              setUserData('email', email1);
              setUserData('verified', false);
              this.setEmail();
              this.props.setMessage(languages[this.props.language].user_preferences_page.email.changed_success, 'text', languages[this.props.language].user_preferences_page.success, 'success');
              this.setState({
                showEmail2Field: false,
                showMenu: false
              })
            }

            if (response.status === 'error') {
              this.setState({
                showEmail2Field: false,
                showMenu: false
              })
              this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
            }

            if (response.status === 'email_taken') {
              this.setState({
                showEmail2Field: false,
                showMenu: false
              })
              this.props.setMessage(languages[this.props.language].general.email_error.email_taken, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
            }
          })
          
        } else {
          this.setState({
            email2CheckResult: 'emails_should_be_same',
            showLoadingCircle: false,
          })
        }
      }
    }
  }

  render() {
    let emailIncorrect1;
    if (this.state.email1CheckResult !== true) {
      emailIncorrect1 = (
        <p className={style.typing_error}>{languages[this.props.language].general.email_error[this.state.email1CheckResult]}</p>
      )
    }

    let emailIncorrect2;
    if (this.state.email2CheckResult !== true) {
      emailIncorrect2 = (
        <p className={style.typing_error}>{languages[this.props.language].general.email_error[this.state.email2CheckResult]}</p>
      )
    }

    let emailField2;
    if (this.state.showEmail2Field === true) {
      emailField2 = (
        <div className={style.email2Field}>
          <StyledLabel htmlFor='email2'>{languages[this.props.language].user_preferences_page.email.confirm_email}</StyledLabel>
          <StyledInputDiv>
            <StyledInput className={style.email} id='email2' type='text' placeholder={languages[this.props.language].user_preferences_page.email.placeholder} autoFocus onKeyUp={(e) => { if (e.key === 'Enter') { this.handleClick() }; if (e.key === 'Escape') { this.hideMenu() } }}></StyledInput>
            <span className={style.input_span}>
              <SelectContainer>
                <StyledSelect id='emailSelect2' defaultValue='student' className={style.email_select} onChange={() => { this.handleClick() }}>
                  <option value='student'>@edu.sk.ru</option>
                  <option value='teacher'>@sk.ru</option>
                </StyledSelect>
                <ArrowDown className={style.arrowDown}  onClick={() => { document.getElementById('emailSelect').click() }} />
              </SelectContainer>
            </span>
          </StyledInputDiv>
          {emailIncorrect2}
        </div>
      )
    }


    let loadingCircle;
    if (this.state.showLoadingCircle === true) {
      loadingCircle = (
        <LoadingCircle theme={this.props.theme} />
      )
    }

    if (this.state.showMenu === false) {
      return (
        <div className={style.email_container}>
          <p className={style['title_text' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.email.title}{this.state.userEmail}</p>
          <SelectedP onClick={() => this.setState({showMenu: true})} className={style['menu_toggle' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.email.change_btn}</SelectedP>
        </div>
      )
    } else {
      return (
        <div className={style.email_container}>
          <StyledLabel htmlFor='email1'>{languages[this.props.language].user_preferences_page.email.enter_email}</StyledLabel>
          <StyledInputDiv>
            <StyledInput className={style.email} id='email1' type='text' placeholder={languages[this.props.language].user_preferences_page.email.placeholder} onKeyUp={(e) => { if (e.key === 'Enter') { this.handleClick() }; if (e.key === 'Escape') { this.hideMenu() } }} autoFocus></StyledInput>
            <span className={style.input_span}>
              <SelectContainer>
                <StyledSelect id='emailSelect1' defaultValue='student' className={style.email_select} onChange={() => { this.handleClick() }}>
                  <option value='student'>@edu.sk.ru</option>
                  <option value='teacher'>@sk.ru</option>
                </StyledSelect>
                <ArrowDown className={style.arrowDown}  onClick={() => { document.getElementById('emailSelect').click() }} />
              </SelectContainer>
            </span>
          </StyledInputDiv>
          {emailIncorrect1}
          {emailField2}
          {loadingCircle}
          <div className={style.emailBtnsContainer}>
            <Button id='emailCancelBtn' className={style.next_btn} onClick={() => {this.hideMenu()}}>{languages[this.props.language].user_preferences_page.cancel_btn}</Button>
            <Button id='emailNextBtn' className={style.next_btn} onClick={() => {this.handleClick()}}>{languages[this.props.language].signup_page.next_btn}</Button>
          </div>
        </div>
      )
    }
  }
}

class Password extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      showMenu: false,
      password1CheckResult: true,
      showPassword2Field: false,
      password2CheckResult: true,
      showLoadingCircle: false
    }
  }

  hideMenu() {
    this.setState({
      showMenu: false,
      password1CheckResult: true,
      showPassword2Field: false,
      password2CheckResult: true,
      showLoadingCircle: false,
    })
  }

  handleClick() {
    const password1 = document.getElementById('password1').value;
    const passwordCheck1 = checkPassword(password1);

    if (passwordCheck1 !== true) {
      this.setState({
        password1CheckResult: passwordCheck1,
        password2CheckResult: true,
        showPassword2Field: false,
        showLoadingCircle: false
      })
    } else {
      this.setState({
        password1CheckResult: true,
        showLoadingCircle: false
      })
    }
    

    if (passwordCheck1 === true) {
      this.setState({
        showPassword2Field: true,
        showLoadingCircle: false
      })

      const passwordField2 = document.getElementById('password2');

      if (passwordField2 !== null) {
        
        if (password1 === passwordField2.value) {
          this.setState({
            showLoadingCircle: true
          })
          
          this.setState({
            showLoadingCircle: true,
            password3CheckResult: true
          })


          sendRequest('/updateuserpreferences', 'POST', {data: JSON.stringify(['password', password1])})
          .then(response => {
            this.setState({
              password1CheckResult: true,
              password2CheckResult: true,
              password3CheckResult: true,
              showLoadingCircle: false
            })

            if (response.status === 'success') {
              this.props.setMessage(languages[this.props.language].user_preferences_page.password.changed_success, 'text', languages[this.props.language].user_preferences_page.success, 'success');
              this.setState({
                showPassword2Field: false,
                showPassword3Field: false,
                showMenu: false
              })
            }


            if (response.status === 'error') {
              this.setState({
                showPassword2Field: false,
                showMenu: false
              })
              this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
            }
          })
          
        } else {
          this.setState({
            password2CheckResult: 'passwords_should_be_same',
            showLoadingCircle: false
          })
        }
      }
    }
  }

  render() {
    let passwordIncorrect1;
    if (this.state.password1CheckResult !== true) {
      passwordIncorrect1 = (
        <p className={style.typing_error}>{languages[this.props.language].general.password_error[this.state.password1CheckResult]}</p>
      )
    }

    let passwordIncorrect2;
    if (this.state.password2CheckResult !== true) {
      passwordIncorrect2 = (
        <p className={style.typing_error}>{languages[this.props.language].user_preferences_page[this.state.password2CheckResult]}</p>
      )
    }

    let passwordField2;
    if (this.state.showPassword2Field === true) {
      passwordField2 = (
        <div className={style.email2Field}>
          <StyledLabel htmlFor='password2'>{languages[this.props.language].user_preferences_page.password.confirm_new_password}</StyledLabel>
          <StyledInputDiv>
            <StyledInput className={style.password} id='password2' type='password' placeholder={languages[this.props.language].user_preferences_page.password.placeholder} autoFocus onKeyUp={(e) => { if (e.key === 'Enter') { this.handleClick() }; if (e.key === 'Escape') { this.hideMenu() } }}></StyledInput>
          </StyledInputDiv>
          {passwordIncorrect2}
        </div>
      )
    }


    let loadingCircle;
    if (this.state.showLoadingCircle === true) {
      loadingCircle = (
        <LoadingCircle theme={this.props.theme} />
      )
    }

    if (this.state.showMenu === false) {
      return (
        <div className={style.email_container}>
          <p className={style['title_text' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.password.title}</p>
          <SelectedP onClick={() => this.setState({showMenu: true})} className={style['menu_toggle' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.password.change_btn}</SelectedP>
        </div>
      )
    } else {
      return (
        <div className={style.email_container}>
          <StyledLabel htmlFor='password1'>{languages[this.props.language].user_preferences_page.password.enter_new_password}</StyledLabel>
          <StyledInputDiv>
            <StyledInput className={style.password} id='password1' type='password' placeholder={languages[this.props.language].user_preferences_page.password.placeholder} onKeyUp={(e) => { if (e.key === 'Enter') { this.handleClick() }; if (e.key === 'Escape') { this.hideMenu() } }} autoFocus></StyledInput>
          </StyledInputDiv>
          {passwordIncorrect1}
          {passwordField2}
          {loadingCircle}
          <div className={style.emailBtnsContainer}>
            <Button id='pswdCancelBtn' className={style.next_btn} onClick={() => {this.hideMenu()}}>{languages[this.props.language].user_preferences_page.cancel_btn}</Button>
            <Button id='paswdNextBtn' className={style.next_btn} onClick={() => {this.handleClick()}}>{languages[this.props.language].signup_page.next_btn}</Button>
          </div>
        </div>
      )
    }
  }
}

class Phone extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    const phoneNumber = getUserData('phone');
    let isSpecified = 'not_specified';
    let phoneNumberToDisplay = '';

    if (phoneNumber !== undefined) {
      phoneNumberToDisplay = stringifyPhone(phoneNumber);
      isSpecified = '';
    }

    this.state = {
      showMenu: false,
      phoneNumberCheck: true,
      showLoadingCircle: false,
      phoneNumber: phoneNumberToDisplay,
      isSpecified: isSpecified
    }
  }

  hideMenu() {
    this.setState({
      showMenu: false,
      phoneNumberCheck: true,
      showLoadingCircle: false
    })
  }

  handleClick() {
    const phoneNumber = document.getElementById('phone').value;
    const phoneNumberCheck = checkPhone(phoneNumber);

    if (phoneNumberCheck === true) {
      this.setState({
        phoneNumberCheck: true,
        showLoadingCircle: true
      })

      sendRequest('/updateuserpreferences', 'POST', {data: JSON.stringify(['phone', phoneNumber])})
      .then(response => {

        if (response.status === 'success') {
          this.setState({
            showMenu: false,
            phoneNumberCheck: true,
            showLoadingCircle: false,
            phoneNumber: stringifyPhone(phoneNumber),
            isSpecified: ''
          });

          setUserData('phone', phoneNumber);

          this.props.setMessage(languages[this.props.language].user_preferences_page.phone.changed_success, 'text', languages[this.props.language].user_preferences_page.success, 'success');
        }
        
        if (response.status === 'error') {
          this.hideMenu();
          this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
        }
      })
      
      
    } else {
      this.setState({
        phoneNumberCheck: phoneNumberCheck,
        showLoadingCircle: false
      })
    }
  }

  render() {
    let phoneIncorrect;
    if (this.state.phoneNumberCheck !== true) {
      phoneIncorrect = (
        <p className={style.typing_error}>{languages[this.props.language].general.phone_error[this.state.phoneNumberCheck]}</p>
      )
    }

    const phoneField = (
      <div>
          <StyledLabel htmlFor='phone'>{languages[this.props.language].user_preferences_page.phone.phone}</StyledLabel>
          <StyledInputDiv>
            <StyledInput className={style.password} id='phone' type='tel' placeholder={languages[this.props.language].user_preferences_page.phone.placeholder} onKeyUp={(e) => { if (e.key === 'Enter') { this.handleClick() }; if (e.key === 'Escape') { this.hideMenu() } }} autoFocus></StyledInput>
          </StyledInputDiv>
          {phoneIncorrect}
      </div>
    )

    let loadingCircle;
    if (this.state.showLoadingCircle === true) {
      loadingCircle = (
        <LoadingCircle theme={this.props.theme} />
      )
    }

    if (this.state.showMenu === false) {
      return (
        <div>
          <p className={style['title_text' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.phone.title}{this.state.phoneNumber}{languages[this.props.language].user_preferences_page[this.state.isSpecified]}</p>
          <SelectedP onClick={() => this.setState({showMenu: true})} className={style['menu_toggle' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.phone.change_btn}</SelectedP>
        </div>
      )
    } else {
      return (
        <div>
          {phoneField}
          {loadingCircle}
          <div className={style.emailBtnsContainer}>
            <Button id='phoneCancelBtn' className={style.next_btn} onClick={() => {this.hideMenu()}}>{languages[this.props.language].user_preferences_page.cancel_btn}</Button>
            <Button id='phoneNextBtn' className={style.next_btn} onClick={() => {this.handleClick()}}>{languages[this.props.language].signup_page.next_btn}</Button>
          </div>
        </div>
      )
    }
  }
}

function Settings(props) {
  return (
    <ul className={style['settings_list' + props.menuType]}>
      <li>
        <Verifification menuType={props.menuType} language={props.language} setMessage={props.setMessage}/>
      </li>
      <li>
        <Email menuType={props.menuType} language={props.language} theme={props.theme} setMessage={props.setMessage}/>
      </li>
      <li>
        <Password menuType={props.menuType} language={props.language} theme={props.theme} setMessage={props.setMessage}/>
      </li>
      <li>
        <Phone menuType={props.menuType} language={props.language} theme={props.theme} setMessage={props.setMessage}/>
      </li>
    </ul>
  )
}


class ProfilePictureMenu extends React.Component {
  constructor(props) {
    super(props);
    this.setPfp = this.setPfp.bind(this);
    this.sendPfp = this.sendPfp.bind(this);


    this.state = {
      showControls: false,
      fileChosen: false,
      fileName: 'no_file_chosen',
      fileError: true,
      showLoadingCircle: false
    }
  }

  toggleMenu() {
    const state = !this.state.showControls;
    this.setState({
      showControls: state
    })
  }

  setPfp() {
    const field = document.getElementById('userPfp').value;
    let fileName;

    if (field === '') {
      fileName = 'no_file_chosen';
    } else {
      let a = field.split('\\');
      fileName = a[a.length - 1];
    }

    this.setState({
      fileChosen: true,
      fileName: fileName
    })
  }

  sendPfp() {
    this.setState({
      showLoadingCircle: true
    })

    const field = document.getElementById('userPfp');

    const file = field.files[0];
    const fileCheck = checkFile(file);

    if (fileCheck === true) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        const image = (reader.result).split(',')[1];
  
        sendRequest('/updateuserpreferences', 'POST', {data: JSON.stringify(['pfp', image])})
        .then(response => {
          
          if (response.status === 'success') {
            this.setState({
              showControls: false,
              fileChosen: false,
              fileName: 'no_file_chosen',
              showLoadingCircle: false,
              fileError: true
            })
  
            setUserData('pfp', image);
            this.props.setMessage(languages[this.props.language].user_preferences_page.pfp.changed_success, 'text', languages[this.props.language].user_preferences_page.success, 'success');
          } 
          
          if (response.status === 'error') {
            this.setState({
              showControls: true,
              fileChosen: false,
              fileName: 'no_file_chosen',
              showLoadingCircle: false,
              fileError: true
            })
  
            this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
          }
        })
      };
    } else {
      this.setState({
        showControls: true,
        showLoadingCircle: false,
        fileError: fileCheck
      })
    }

  }

  render() {
    let fileError;
    if (this.state.fileError !== true) {
      fileError = (
        <p className={style.typing_error}>{languages[this.props.language].general.file_error[this.state.fileError]}</p>
      )
    }

    let sendButton;
    if (this.state.fileChosen === true) {
      sendButton = (
        <SelectedP onClick={() => this.sendPfp()} className={style['menu_toggle' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.pfp.upload}</SelectedP>
      )
    }

    let controls;
    if (this.state.showControls === true) {
      let file;
      if (this.state.fileName === 'no_file_chosen') {
        file = languages[this.props.language].user_preferences_page.pfp['no_file_chosen'];
      } else {
        file = this.state.fileName;
      }

      controls = (
        <div className={style.pfpControls}>
          <p className={style['menu_toggle' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.pfp.file_name}{file}</p>
          <SelectedP onClick={() => document.getElementById('userPfp').click()} className={style['menu_toggle' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.pfp.choose_file}</SelectedP>
          {fileError}
          <div className={style.pfpButtonsContainer}>
            <SelectedP onClick={() => this.setState({showControls: false, fileChosen: false, fileName: 'no_file_chosen', showLoadingCircle: false})} className={style['menu_toggle' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.cancel_btn}</SelectedP>
            {sendButton}
          </div>
          <input id='userPfp' className={style.pfp_input} onChange={() => this.setPfp()} type='file'></input>
        </div>
      )
    }

    let loadingCircle;
    if (this.state.showLoadingCircle === true) {
      loadingCircle = (
        <LoadingCircle theme={this.props.theme} />
      )
    }
  
    return (
      <div>
        <div className={style.pfpContainer}>
          <PFP theme={this.props.theme} type={'userprefpage_menubar_pfp' + this.props.menuType} onClick={() => this.toggleMenu()}/>
          <div className={style.pfpTextContainer}>
            <p className={style['title_text' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.pfp.title}</p>
            <SelectedP onClick={() => this.toggleMenu()} className={style['menu_toggle' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.pfp.change_btn}</SelectedP>
          </div>
        </div>
        {controls}
        {loadingCircle}
      </div>
    )
  }
}

class NameMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    const name = getUserData('name');
    const surname = getUserData('surname');
    let isSpecified = 'not_specified';
    let fullName = '';

    if (name !== undefined) {
      fullName = fullName + name;
    }

    if (surname !== undefined) {
      fullName = fullName + ' ' + surname;
    }

    if (fullName !== '') {
      isSpecified = ''
    }

    this.state = {
      showMenu: false,
      nameCheck: true,
      surnameCheck: true,
      showSurnameField: false,
      showLoadingCircle: false,
      fullName: fullName,
      isSpecified: isSpecified
    }
  }

  hideMenu() {
    this.setState({
      showMenu: false,
      nameCheck: true,
      surnameCheck: true,
      showSurnameField: false,
      showLoadingCircle: false
    })
  }

  handleClick() {
    const nameCheck = checkName(document.getElementById('name').value);

    if (nameCheck === true) {
      this.setState({
        nameCheck: true,
        showSurnameField: true,
        showLoadingCircle: false
      })
      
      const surnameField = document.getElementById('surname');
      
      if (surnameField !== null) {
        const surnameCheck = checkName(surnameField.value);
        
        if (surnameCheck === true) {
          this.setState({
            surnameCheck: true,
            showLoadingCircle: true
          })
          
          const name = capitalizeFirstLetter(document.getElementById('name').value);
          const surname = capitalizeFirstLetter(surnameField.value);
          
          sendRequest('/updateuserpreferences', 'POST', {data: JSON.stringify(['name', name, surname])})
          .then(response => {

            if (response.status === 'success') {
              const newName = name + ' ' + surname;

              this.setState({
                showMenu: false,
                nameCheck: true,
                surnameCheck: true,
                showSurnameField: false,
                showLoadingCircle: false,
                fullName: newName,
                isSpecified: ''
              });

              setUserData('name', name);
              setUserData('surname', surname);

              this.props.setMessage(languages[this.props.language].user_preferences_page.name.changed_success, 'text', languages[this.props.language].user_preferences_page.success, 'success');
            }
            
            if (response.status === 'error') {
              this.hideMenu();
              this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
            }
          })
        } else {
          this.setState({
            surnameCheck: surnameCheck,
            showLoadingCircle: false
          })
        }
      }
    } else {
      this.setState({
        nameCheck: nameCheck,
        showSurnameField: false,
        surnameCheck: true,
        showLoadingCircle: false
      })
    }
  }

  render() {
    let nameIncorrect;
    if (this.state.nameCheck !== true) {
      nameIncorrect = (
        <p className={style.typing_error}>{languages[this.props.language].general.name_error[this.state.nameCheck]}</p>
      )
    }

    let surnameIncorrect;
    if (this.state.surnameCheck !== true) {
      surnameIncorrect = (
        <p className={style.typing_error}>{languages[this.props.language].general.surname_error[this.state.surnameCheck]}</p>
      )
    }

    const nameField = (
      <div>
          <StyledLabel htmlFor='name'>{languages[this.props.language].user_preferences_page.name.name}</StyledLabel>
          <StyledInputDiv>
            <StyledInput className={style.password} id='name' type='text' placeholder={languages[this.props.language].user_preferences_page.name.name} autoFocus onKeyUp={(e) => { if (e.key === 'Enter') { this.handleClick() }; if (e.key === 'Escape') { this.hideMenu() } } }></StyledInput>
          </StyledInputDiv>
          {nameIncorrect}
      </div>
    )

    let surnameField;
    if (this.state.showSurnameField === true) {
      surnameField = (
        <div>
          <StyledLabel htmlFor='surname'>{languages[this.props.language].user_preferences_page.name.surname}</StyledLabel>
          <StyledInputDiv>
            <StyledInput className={style.password} id='surname' type='text' placeholder={languages[this.props.language].user_preferences_page.name.surname} autoFocus onKeyUp={(e) => { if (e.key === 'Enter') { this.handleClick() }; if (e.key === 'Escape') { this.hideMenu() } }}></StyledInput>
          </StyledInputDiv>
          {surnameIncorrect}
        </div>
      )
    }

    let loadingCircle;
    if (this.state.showLoadingCircle === true) {
      loadingCircle = (
        <LoadingCircle theme={this.props.theme} />
      )
    }

    if (this.state.showMenu === false) {
      return (
        <div>
          <p className={style['title_text' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.name.title}{this.state.fullName}{languages[this.props.language].user_preferences_page[this.state.isSpecified]}</p>
          <SelectedP onClick={() => this.setState({showMenu: true})} className={style['menu_toggle' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.name.change_btn}</SelectedP>
        </div>
      )
    } else {
      return (
        <div>
          {nameField}
          {surnameField}
          {loadingCircle}
          <div className={style.emailBtnsContainer}>
            <Button id='nameCancelBtn' className={style.next_btn} onClick={() => {this.hideMenu()}}>{languages[this.props.language].user_preferences_page.cancel_btn}</Button>
            <Button id='nameNextBtn' className={style.next_btn} onClick={() => {this.handleClick()}}>{languages[this.props.language].signup_page.next_btn}</Button>
          </div>
        </div>
      )
    }
  }
}

class GradeMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    const grade = getUserData('grade');
    let isSpecified = 'not_specified';
    let gradeToDisplay = '';

    if (grade !== undefined) {
      gradeToDisplay = grade;
      isSpecified = '';
    }

    this.state = {
      showMenu: false,
      gradeCheck: true,
      showLoadingCircle: false,
      grade: gradeToDisplay,
      isSpecified: isSpecified
    }
  }

  hideMenu() {
    this.setState({
      showMenu: false,
      gradeCheck: true,
      showLoadingCircle: false
    })
  }

  handleClick() {
    const grade = document.getElementById('grade').value;
    const gradeCheck = checkGrade(grade);

    if (gradeCheck === true) {
      this.setState({
        gradeCheck: true,
        showLoadingCircle: true
      })

      sendRequest('/updateuserpreferences', 'POST', {data: JSON.stringify(['grade', grade])})
      .then(response => {

        if (response.status === 'success') {

          this.setState({
            showMenu: false,
            gradeCheck: true,
            showLoadingCircle: false,
            grade: grade,
            isSpecified: ''
          });

          setUserData('grade', grade);

          this.props.setMessage(languages[this.props.language].user_preferences_page.grade.changed_success, 'text', languages[this.props.language].user_preferences_page.success, 'success');
        }
        
        if (response.status === 'error') {
          this.hideMenu();
          this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
        }
      })
    } else {
      this.setState({
        gradeCheck: gradeCheck,
        showLoadingCircle: false
      })
    }
  }

  render() {
    let gradeIncorrect;
    if (this.state.gradeCheck !== true) {
      gradeIncorrect = (
        <p className={style.typing_error}>{languages[this.props.language].general.grade_error[this.state.gradeCheck]}</p>
      )
    }

    const gradeField = (
      <div>
          <StyledLabel htmlFor='grade'>{languages[this.props.language].user_preferences_page.grade.grade}</StyledLabel>
          <StyledInputDiv>
            <StyledInput className={style.password} id='grade' type='text' placeholder={languages[this.props.language].user_preferences_page.grade.grade} onKeyUp={(e) => { if (e.key === 'Enter') { this.handleClick() }; if (e.key === 'Escape') { this.hideMenu() } }} autoFocus></StyledInput>
          </StyledInputDiv>
          {gradeIncorrect}
      </div>
    )

    let loadingCircle;
    if (this.state.showLoadingCircle === true) {
      loadingCircle = (
        <LoadingCircle theme={this.props.theme} />
      )
    }

    if (this.state.showMenu === false) {
      if (this.state.grade === 'teacher') {
        return (
          <p className={style['title_text' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.grade.title}{languages[this.props.language].user_preferences_page.grade.teacher}</p>
        )
      } else {
        return (
          <div>
            <p className={style['title_text' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.grade.title}{this.state.grade}{languages[this.props.language].user_preferences_page[this.state.isSpecified]}</p>
            <SelectedP onClick={() => this.setState({showMenu: true})} className={style['menu_toggle' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.grade.change_btn}</SelectedP>
          </div>
        )
      }
    } else {
      return (
        <div>
          {gradeField}
          {loadingCircle}
          <div className={style.emailBtnsContainer}>
            <Button id='gradeCancelBtn' className={style.next_btn} onClick={() => {this.hideMenu()}}>{languages[this.props.language].user_preferences_page.cancel_btn}</Button>
            <Button id='gradeNextBtn' className={style.next_btn} onClick={() => {this.handleClick()}}>{languages[this.props.language].signup_page.next_btn}</Button>
          </div>
        </div>
      )
    }
  }
}

class BioMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    const bio = getUserData('bio');
    let bioToDisplay = '';

    if (bio !== undefined) {
      bioToDisplay = bio;
    }

    this.state = {
      showMenu: false,
      bioCheck: true,
      showLoadingCircle: false,
      bio: bioToDisplay
    }
  }

  componentWillUnmount() {
    window.removeEventListener('input', this.resize())
  }

  resize() {
    const tx = document.getElementById('bio');

    if (tx !== null) {
      tx.style.height = 'auto';
      tx.style.height = (tx.scrollHeight) + 'px';
    }
  }

  hideMenu() {
    this.setState({
      showMenu: false,
      bioCheck: true,
      showLoadingCircle: false
    })
  }

  handleClick() {
    const bio = document.getElementById('bio').value;
    const bioCheck = checkBio(bio);

    if (bioCheck === true) {
      this.setState({
        bioCheck: true,
        showLoadingCircle: true
      })

      sendRequest('/updateuserpreferences', 'POST', {data: JSON.stringify(['bio', bio])})
      .then(response => {
  
        if (response.status === 'success') {

          this.setState({
            showMenu: false,
            bioCheck: true,
            showLoadingCircle: false,
            bio: bio
          });

          setUserData('bio', bio);

          this.props.setMessage(languages[this.props.language].user_preferences_page.bio.changed_success, 'text', languages[this.props.language].user_preferences_page.success, 'success');
        }
        
        if (response.status === 'error'){
          this.hideMenu();
          this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
        }
      })
      
      
    } else {
      this.setState({
        bioCheck: bioCheck,
        showLoadingCircle: false
      })
    }
  }

  render() {
    
    const tx = document.getElementById('bio');
    if (tx !== null) {
      tx.addEventListener('input', this.resize());
    }

    let bioIncorrect;
    if (this.state.bioCheck !== true) {
      bioIncorrect = (
        <p className={style.typing_error}>{languages[this.props.language].general.bio_error[this.state.bioCheck]}</p>
      )
    }

    const bioField = (
      <div>
          <StyledLabel htmlFor='bio'>{languages[this.props.language].user_preferences_page.bio.title}</StyledLabel>
          <div className={style.textarea_div}>
            <StyledTextarea className={style.password} id='bio' type='text' defaultValue={this.state.bio} placeholder={languages[this.props.language].user_preferences_page.bio.title} onKeyUp={(e) => { if (e.key === 'Escape') { this.hideMenu() } }} autoFocus></StyledTextarea>
          </div>
          {bioIncorrect}
      </div>
    )

    let loadingCircle;
    if (this.state.showLoadingCircle === true) {
      loadingCircle = (
        <LoadingCircle theme={this.props.theme} />
      )
    }

    if (this.state.showMenu === false) {
      return (
        <div>
          <p className={style['title_text' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.bio.title}</p>
          <SelectedP onClick={() => this.setState({showMenu: true})} className={style['menu_toggle' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.bio.change_btn}</SelectedP>
        </div>
      )
    } else {
      return (
        <div>
          {bioField}
          {loadingCircle}
          <div className={style.emailBtnsContainer}>
            <Button id='bioCancelBtn' className={style.next_btn} onClick={() => {this.hideMenu()}}>{languages[this.props.language].user_preferences_page.cancel_btn}</Button>
            <Button id='bioNextBtn' className={style.next_btn} onClick={() => {this.handleClick()}}>{languages[this.props.language].signup_page.next_btn}</Button>
          </div>
        </div>
      )
    }
  }
}

class Subjects extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubjectClick = this.handleSubjectClick.bind(this);

    let subjects = getUserData(this.props.subjectsType);

    if (subjects === undefined) {
      subjects = [];
    }
    const existingSubjects = languages[this.props.language].general.subjects;
    const keys = Object.keys(existingSubjects);

    this.state = {
      showMenu: false,
      showLoadingCircle: false,
      existingSubjects: existingSubjects,
      keys: keys,
      subjects: subjects
    }
  }

  hideMenu() {
    this.setState({
      showMenu: false,
      showLoadingCircle: false
    })
  }

  handleClick() {
    this.setState({
      showLoadingCircle: true
    })

    const subjects = this.state.subjects;

    sendRequest('/updateuserpreferences', 'POST', {data: JSON.stringify([this.props.subjectsType, subjects])})
    .then(response => {

      if (response.status === 'success') {

        this.setState({
          showMenu: false,
          showLoadingCircle: false
        });

        setUserData(this.props.subjectsType, subjects);

        this.props.setMessage(languages[this.props.language].user_preferences_page.subjects.changed_success, 'text', languages[this.props.language].user_preferences_page.success, 'success');
      }
      
      if (response.status === 'error') {
        this.hideMenu();
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }

  handleSubjectClick(key) {
    let subjects = this.state.subjects;
    const index = subjects.indexOf(key);
    if (index === -1) {
      subjects.push(key);
    } else {
      subjects.splice(index, 1);
    }

    this.setState({
      subjects: subjects
    })
  }

  render() {
    const existingSubjects = this.state.existingSubjects;
    const keys = this.state.keys;
    let subjectList = [];

    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i];
      if (this.state.subjects.includes(currentKey)) {
        subjectList.push(
          <li key={currentKey}>
            <SelectedSubject id={currentKey} onClick={() => this.handleSubjectClick(currentKey)}>{existingSubjects[currentKey]}</SelectedSubject>
          </li>
        )
      } else {
        subjectList.push(
          <li key={currentKey}>
            <UnselectedSubject id={currentKey} onClick={() => this.handleSubjectClick(currentKey)}>{existingSubjects[currentKey]}</UnselectedSubject>
          </li>
        )
      }
    }
    

    let loadingCircle;
    if (this.state.showLoadingCircle === true) {
      loadingCircle = (
        <LoadingCircle theme={this.props.theme} />
      )
    }

    if (this.state.showMenu === false) {
      return (
        <div>
          <p className={style['title_text' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.subjects[this.props.subjectsType].title}</p>
          <SelectedP onClick={() => this.setState({showMenu: true})} className={style['menu_toggle' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.subjects.change_btn}</SelectedP>
        </div>
      )
    } else {
      return (
        <div>
          <label  className={style['subjects_label' + this.props.menuType]}>{languages[this.props.language].user_preferences_page.subjects[this.props.subjectsType].title}</label>
          <ul className={style['subjects_list' + this.props.menuType]}>
            {subjectList}
          </ul>
          {loadingCircle}
          <div className={style.emailBtnsContainer}>
            <Button id='subjectsCancelBtn' className={style.next_btn} onClick={() => {this.hideMenu()}}>{languages[this.props.language].user_preferences_page.cancel_btn}</Button>
            <Button id='subjectsNextBtn' className={style.next_btn} onClick={() => {this.handleClick()}}>{languages[this.props.language].signup_page.next_btn}</Button>
          </div>
        </div>
      )
    }
  }
}

function Profile(props) {
  return (
    <ul className={style['settings_list' + props.menuType]}>
      <li>
        <ProfilePictureMenu menuType={props.menuType} language={props.language} setMessage={props.setMessage} theme={props.theme}/>
      </li>
      <li>
        <NameMenu menuType={props.menuType} language={props.language} theme={props.theme} setMessage={props.setMessage}/>
      </li>
      <li>
        <GradeMenu menuType={props.menuType} language={props.language} theme={props.theme} setMessage={props.setMessage}/>
      </li>
      <li>
        <BioMenu menuType={props.menuType} language={props.language} theme={props.theme} setMessage={props.setMessage}/>
      </li>
      <li>
        <Subjects menuType={props.menuType} subjectsType='subjectsNeedHelp' language={props.language} theme={props.theme} setMessage={props.setMessage}/>
      </li>
      <li>
        <Subjects menuType={props.menuType} subjectsType='subjectsCanHelp' language={props.language} theme={props.theme} setMessage={props.setMessage}/>
      </li>
    </ul>
  )
}

function Sidebar(props) {
  if (props.tab === 'settings') {
    return (
      <StyledSidebar className={style['sidebar' + props.menuType]}>
        <StyledP onClick={() => props.setTab('profile')} className={style['profile_btn' + props.menuType]}>{languages[props.language].user_preferences_page.sidebar.profile}</StyledP>
        <SelectedP onClick={() => props.setTab('settings')} className={style['settings_btn' + props.menuType]}>{languages[props.language].user_preferences_page.sidebar.settings}</SelectedP>
      </StyledSidebar>
    )
  } else {
    return (
      <StyledSidebar className={style['sidebar' + props.menuType]}>
        <SelectedP onClick={() => props.setTab('profile')} className={style['profile_btn' + props.menuType]}>{languages[props.language].user_preferences_page.sidebar.profile}</SelectedP>
        <StyledP onClick={() => props.setTab('settings')} className={style['settings_btn' + props.menuType]}>{languages[props.language].user_preferences_page.sidebar.settings}</StyledP>
      </StyledSidebar>
    )
  }
}

class UserPreferencesPage extends React.Component {
  constructor(props) {
    super(props);
    this.setTab = this.setTab.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.windowSizeChanged = this.windowSizeChanged.bind(this);

    this.state = {
      tab: 'profile',
      showMessage: false,
      messageTitle: 'temp title',
      messageType: 'text',
      titleType: 'normal',
      preventAutoHiding: false,
      menuType: 'desktop'
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowSizeChanged);
    this.windowSizeChanged();

    const tab = getUrlParam('tab');
    const showPopup = getUrlParam('showpopup');

    this.setTab(tab);

    if (showPopup === 'true') {
      this.showFieldsPopup();
    }
    
    const unlisten = this.props.history.listen(({action, location}) => {
      localStorage.setItem('authorized', 'false');
      unlisten();
    })

    const unblock = this.props.history.block(tx => {
      const fields = getEmptyUserProfileFields();
      if (fields.length === 0) {
        unblock();
        tx.retry();
      } else {
        this.showFieldsPopup();
      }
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowSizeChanged);
  }

  windowSizeChanged() {
    if (window.innerWidth >= 600) {
      this.setState({
        menuType: 'desktop'
      })
    } else if (window.innerWidth > 420 && window.innerWidth < 600) {
      this.setState({
        menuType: 'tablet'
      })
    } else {
      this.setState({
        menuType: 'mobile'
      })
    }
  }

  showFieldsPopup() {
    const fields = getEmptyUserProfileFields();

    const lis = fields.map(element => {
      return (
        <li>{languages[this.props.language].user_preferences_page.emptyFields[element]}</li>
      )
    })

    const body = (
      <div>
        <p className={style.fieldspopup_text}>{languages[this.props.language].user_preferences_page.emptyFields.body}</p>
        <ul className={style.fieldspopup_list}>
          {lis}
        </ul>
      </div>
    )

    this.setMessage(body, 'other', languages[this.props.language].user_preferences_page.emptyFields.title, 'failure');
  }

  setTab(tab) {
    if (tab === 'profile' || tab === 'settings') {
      this.setState({
        tab: tab
      })
    }
  }

  setMessage(body, msgType, title, titleType) {
    this.setState({
      showMessage: body,
      messageType: msgType,
      messageTitle: title,
      titleType: titleType,
      preventAutoHiding: arguments[arguments.length - 1]
    })
  }
  
  render() {
    let tab;

    if (this.state.tab === 'settings') {
      tab = (<Settings menuType={this.state.menuType} language={this.props.language} theme={this.props.theme} setMessage={this.setMessage}/>)
    }

    if (this.state.tab === 'profile') {
      tab = (<Profile menuType={this.state.menuType} language={this.props.language} theme={this.props.theme} setMessage={this.setMessage}/>)
    }


    return (
      <div>
        <div id='page'>
          <Menu history={this.props.history} theme={this.props.theme} style={style} language={this.props.language} changeTheme={this.props.changeTheme} changeLanguage={this.props.changeLanguage} setMessage={this.setMessage}/>
          <div id='pageBody' className={style['pageBody' + this.state.menuType]}>
            <Sidebar language={this.props.language} tab={this.state.tab} setTab={this.setTab} menuType={this.state.menuType} />
            {tab}
          </div>
          <Footer />
        </div>
        <MessagePopUp elementId={'page'} showMessage={this.state.showMessage} title={this.state.messageTitle} msgType={this.state.messageType} titleType={this.state.titleType} preventAutoHiding={this.state.preventAutoHiding} style={style} theme={this.props.theme} language={this.props.language} setMessage={this.setMessage}/>
      </div>
    )
  }
}

export default withTheme(UserPreferencesPage);