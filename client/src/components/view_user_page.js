import React from 'react';
import styled, { withTheme } from 'styled-components';
import style from '../styles/viewuser_page.module.css';
import { MessagePopUp, Footer, Menu, Button, sendRequest, LoadingCircle, getUrlParam, DangerButton, getUserData, PFP, stringifyPhone, LoadingCircleContainer, stringifyUserGrade, SelectContainer, StyledSelect, ArrowDown } from '../utils/additional';
import languages from '../utils/languages';

const StyledDropdownList = styled.ul`
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

    padding-top: 0;
    padding-bottom: 0;

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

  & li:hover {
    color: ${props => props.theme.darkerAccentColor};
    cursor: pointer;
  }

  & select {
    font-size: 12pt;
    height: 20px;
  }

  & a {
    text-decoration: none;
  }
`

const StyledDropdown = styled.div`
  display: none;

  color: ${props => props.theme.textColor};
  background-color: ${props => props.theme.primaryColor};
  border-color: ${props => props.theme.borderColor};
`

const StyledLabel = styled.label`
  color: ${props => props.theme.textColor};
  font-size: 20pt;

  &:hover {
    cursor: text;
  }
`

const DangerP = styled.p`
  color: ${props => props.theme.dangerColor};

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.darkerDangerColor};
  }
`

const SafeP = styled.p`
  color: ${props => props.theme.accentColor};

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.darkerAccentColor};
  }
`

const Green = styled.p`
  color: ${props => props.theme.greenColor};
`

const Red = styled.p`
  color: ${props => props.theme.dangerColor};
`

const Orange = styled.p`
  color: ${props => props.theme.orangeColor};
`

class Responses extends React.Component {
  constructor(props) {
    super(props);
    this.setDropdown = this.setDropdown.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.confirmAccept = this.confirmAccept.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
    this.confirmDecline = this.confirmDecline.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.confirmCancel = this.confirmCancel.bind(this);

    this.state = {
      userId: getUrlParam('id')
    }
  }

  setDropdown(eKey, state) {
    const dropdown = document.getElementById('dropdown' + eKey);
  
    if (state === 'none') {
      if (!dropdown.matches(':hover')) {
        dropdown.style.display = 'none';
      }
    } else {
      dropdown.style.display = state;
    }
  }

  handleAccept(postId) {
    sendRequest('/respond', 'POST', {data: JSON.stringify(['accept', postId, this.state.userId])})
    .then(response => {
      if (response.status === 'ok') {
        this.props.setMessage(languages[this.props.language].view_post_page.accepted_text, 'text', languages[this.props.language].user_preferences_page.success, 'success');
        this.props.fetchResponses();
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }

  handleDecline(postId) {
    sendRequest('/respond', 'POST', {data: JSON.stringify(['decline', postId, this.state.userId])})
    .then(response => {
      if (response.status === 'ok') {
        this.props.setMessage(languages[this.props.language].view_post_page.declined_text, 'text', languages[this.props.language].user_preferences_page.success, 'success');
        this.props.fetchResponses();
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }

  handleCancel(postId) {
    sendRequest('/respond', 'POST', {data: JSON.stringify(['cancel', postId, this.state.userId])})
    .then(response => {
      if (response.status === 'ok') {
        this.props.setMessage(languages[this.props.language].view_post_page.cancelled_text, 'text', languages[this.props.language].user_preferences_page.success, 'success');
        this.props.fetchResponses();
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }


  confirmAccept(postId) {
    const body = (
      <div className={style.dialog_btn_container}>
        <Button onClick={() => { this.props.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
        <SafeP className={style.dialog_confirm} onClick={() => { this.props.setMessage(false, false, false, false, false, () => {}); this.handleAccept(postId); }}>{languages[this.props.language].view_post_page.accept}</SafeP>
      </div>
    )
  
    this.props.setMessage(body, 'other', languages[this.props.language].view_post_page.accept_title, 'normal', true);
  }

  confirmDecline(postId) {
    const body = (
      <div className={style.dialog_btn_container}>
        <Button onClick={() => { this.props.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
        <DangerP className={style.dialog_confirm} onClick={() => { this.props.setMessage(false, false, false, false, false, () => {}); this.handleDecline(postId); }}>{languages[this.props.language].view_post_page.decline}</DangerP>
      </div>
    )
  
    this.props.setMessage(body, 'other', languages[this.props.language].view_post_page.decline_title, 'normal', true);
  }

  confirmCancel(postId) {
    const body = (
      <div className={style.dialog_btn_container}>
        <Button onClick={() => { this.props.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
        <DangerP className={style.dialog_confirm} onClick={() => { this.props.setMessage(false, false, false, false, false, () => {}); this.handleCancel(postId); }}>{languages[this.props.language].view_post_page.yes}</DangerP>
      </div>
    )
  
    this.props.setMessage(body, 'other', languages[this.props.language].view_post_page.cacnel_title, 'normal', true);
  }

  render() {
    const responses = this.props.responses;

    let toShow;
    if (responses.length === 0) {
      toShow = (
        <p>{languages[this.props.language].view_post_page.no_responses}</p>
      )
    } else {
      const listType = this.props.type;
      let newResponses = [];
      
      for (let i = 0; i < responses.length; i++) {
        const response = responses[i];

        let showDropdown = true;
        let dropdown;
        let responseStatus;
        if (response.status === 'pending') {
          responseStatus = (
            <p className={style.response_status_p}>{languages[this.props.language].view_post_page.response_status.pending}</p>
          );

          dropdown = [
            <li onClick={() => this.confirmAccept(response.postId)}><SafeP>{languages[this.props.language].view_post_page.accept}</SafeP></li>,
            <li onClick={() => this.confirmDecline(response.postId)}><DangerP>{languages[this.props.language].view_post_page.decline}</DangerP></li>
          ]
        } else if (response.status === 'accepted') {
          if (response.postStatus === 'completed') {
            responseStatus = (
              <Green className={style['response_status_p_margin' + listType]}>{languages[this.props.language].view_post_page.completed_btn}</Green>
            );

            showDropdown = false;
          } else {
            responseStatus = (
              <Orange className={style.response_status_p}>{languages[this.props.language].view_post_page.in_progress}</Orange>
            );
  
            dropdown = [
              <li onClick={() => this.confirmCancel(response.postId)}><DangerP>{languages[this.props.language].general.menu.cancel_btn}</DangerP></li>
            ]
          }
        } else if (response.status === 'declined') {
          responseStatus = (
            <Red className={style.response_status_p}>{languages[this.props.language].view_post_page.response_status.declined}</Red>
          )

          dropdown = [
            <li onClick={() => this.confirmAccept(response.postId)}><SafeP>{languages[this.props.language].view_post_page.accept}</SafeP></li>
          ]
        }

        const dropdownId = listType + i;

        let dropdownField;
        let dots;
        if (listType === 'usrToLgd' && showDropdown) {
          dropdownField = (
            <StyledDropdown id={'dropdown' + dropdownId} className={style.post_dropdown_container} onMouseLeave={() => { this.setDropdown(dropdownId, 'none'); }}>
              <StyledDropdownList>
                {dropdown}
              </StyledDropdownList>
            </StyledDropdown>
          );

          dots = (<img src={this.props.theme.dots} alt={':'} id={'dots' + dropdownId} className={style['dots']} onClick={() => { this.setDropdown(dropdownId, 'block'); }} onMouseOver={() => { this.setDropdown(dropdownId, 'block'); }} onMouseLeave={() => { this.setDropdown(dropdownId, 'none'); }}/>);
        }

        let title = response.title;
        if (this.props.menuType === 'mobile') {
          title = title.length > 15 ? title.slice(0, 16) + '...' : title;
        }

        newResponses.push(
          <li className={style.responses_list_li}>
            <div className={style.post_name_container}>
              <p className={style.post_title} onClick={() => { this.props.history.push('/viewpost?id=' + response.postId) }}>{title}</p>
              {responseStatus}
              {dots}
            </div>
            {dropdownField}
          </li>
        )
      }

      toShow = newResponses;
    }

    return (
      <div className={style.responses_container}>
        <div className={style.responses_title}>
          <StyledLabel>{languages[this.props.language].view_user_page.list_label[this.props.type]}</StyledLabel>
          <div className={style.refresh} onClick={() => { this.props.fetchResponses(); }}>
            <img src={this.props.theme.refresh_icon} alt={'r'}></img>
            <p>{languages[this.props.language].general.menu.refresh_btn}</p>
          </div>
        </div>
        <ul className={style.responses_list}>
          {toShow}
        </ul>
      </div>
    )
  }
}

class ViewUserPage extends React.Component {
  constructor(props) {
    super(props);
    this.setMessage = this.setMessage.bind(this);
    this.handleReport = this.handleReport.bind(this);
    this.confirmReport = this.confirmReport.bind(this);
    this.windowSizeChanged = this.windowSizeChanged.bind(this);
    this.fetchResponses = this.fetchResponses.bind(this);
    this.handleBan = this.handleBan.bind(this);
    this.confirmBan = this.confirmBan.bind(this);

    const userId = getUrlParam('id');

    this.state = {
      showMessage: false,
      messageTitle: 'temp title',
      messageType: 'text',
      titleType: 'normal',
      responded: false,
      preventAutoHiding: false,
      afterHidingCallback: () => {},
      menuType: 'desktop',
      showLoadingCircle: true,
      user: {
        id: userId,
        pfp: '',
        name: '',
        surname: '',
        grade: '',
        bio: '',
        subjectsCanHelp: [],
        subjectsNeedHelp: []
      },
      userReponsesToLoggedin: [],
      loggedinResponsesToUser: [],
      isUserVerified: getUserData('verified')
    }


    if (userId !== null) {
      sendRequest('/getusers', 'POST', {data: JSON.stringify(['view_user_page', userId])})
      .then(response => {
        if (response.status === 'ok') {
          this.setState({
            user: response.user,
            showLoadingCircle: false
          });

          document.title = 'SUP | ' + response.user.name + ' ' + response.user.surname;
        } else {
          this.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure', () => {this.props.history.back()});
        }
      })
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowSizeChanged);
    this.windowSizeChanged();
    if (this.state.isUserVerified === true) {
      this.fetchResponses();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowSizeChanged);
  }

  windowSizeChanged() {
    if (window.innerWidth >= 670) {
      this.setState({
        menuType: 'desktop'
      })
    } else if (window.innerWidth > 450 && window.innerWidth < 670) {
      this.setState({
        menuType: 'tablet'
      })
    } else {
      this.setState({
        menuType: 'mobile'
      })
    }
  }

  setMessage(body, msgType, title, titleType, callback) {
    this.setState({
      showMessage: body,
      messageType: msgType,
      messageTitle: title,
      titleType: titleType,
      preventAutoHiding: arguments[arguments.length - 1],
      afterHidingCallback: callback
    })
  }

  fetchResponses() {
    this.setState({
      showLoadingCircle: true
    })

    sendRequest('/getresponsestouser', 'POST', {data: JSON.stringify(['view_user_page', this.state.user.id])})
    .then(response => {
      if (response.status === 'ok') {
        this.setState({
          userReponsesToLoggedin: response.userReponsesToLoggedin,
          loggedinResponsesToUser: response.loggedinResponsesToUser,
          showLoadingCircle: false
        })
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }


  handleBan(duration) {
    sendRequest('/banuser', 'POST', {data: JSON.stringify([this.state.user.id, duration])})
    .then(response => {
      if (response.status === 'ok') {
        this.setMessage(languages[this.props.language].moderation_page.verify.ban_popup.successTitle, 'text', languages[this.props.language].user_preferences_page.success, 'success', () => {this.props.history.push('/users');});
      }

      if (response.status === 'error') {
        this.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }

  confirmBan(userId) {
    const body = (
      <div>
        <p>{languages[this.props.language].moderation_page.verify.ban_popup.body}</p>
        <div className={style.ban_dropdown_container}>
          <p className={style.ban_duration}>{languages[this.props.language].moderation_page.verify.ban_popup.duration}</p>
          <SelectContainer>
            <StyledSelect className={style.ban_select} id='ban_duration'>
              <option value='day'>{languages[this.props.language].moderation_page.verify.ban_popup.day}</option>
              <option value='week'>{languages[this.props.language].moderation_page.verify.ban_popup.week}</option>
              <option value='forever'>{languages[this.props.language].moderation_page.verify.ban_popup.forever}</option>
            </StyledSelect>
            <ArrowDown />
          </SelectContainer>
        </div>
        <div className={style.dialog_btn_container}>
          <Button onClick={() => { this.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
          <DangerP className={style.dialog_confirm} onClick={() => { this.setMessage(false, false, false, false, false, () => {}); this.handleBan(document.getElementById('ban_duration').value); }}>{languages[this.props.language].moderation_page.verify.ban_popup.btn}</DangerP>
        </div>
      </div>
    )
  
    this.setMessage(body, 'other', languages[this.props.language].moderation_page.verify.ban_popup.title, 'normal', true);
  }

  handleReport() {
    sendRequest('/report', 'POST', {data: JSON.stringify(['add', 'user', this.state.user.id])})
    .then(response => {
      if (response.status === 'ok') {
        this.setMessage(languages[this.props.language].work_page.reported_text, 'text', languages[this.props.language].user_preferences_page.success, 'success');
      }

      if (response.status === 'error') {
        this.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }

  confirmReport() {
    const body = (
      <div className={style.dialog_btn_container}>
        <Button onClick={() => { this.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
        <DangerP className={style.dialog_confirm} onClick={() => { this.setMessage(false, false, false, false, false, () => {}); this.handleReport(); }}>{languages[this.props.language].general.menu.report_btn}</DangerP>
      </div>
    )
  
    this.setMessage(body, 'other', languages[this.props.language].view_post_page.report_title, 'normal', true);
  }
  
  render() {
    const userField = (
      <div className={style['post_name_container']}>
        <div className={style['post_name_container1']} onClick={() => { this.props.history.push('/user?id=' + this.state.user.id); }}>
          <PFP theme={this.props.theme} type={'view_user_pfp'} pfp={this.state.user.pfp} />
          <div>
            <p className={style['user_name']}>{this.state.user.name + ' ' + this.state.user.surname}</p>
            <p className={style['user_grade']}>{stringifyUserGrade(this.state.user.role, this.state.user.grade, this.props.language)}</p>
          </div>
        </div>
      </div>
    )

    const bioField = (
      <div>
        <StyledLabel>{languages[this.props.language].user_preferences_page.bio.title}</StyledLabel>
        <p className={style.description}>{this.state.user.bio}</p>
      </div>
    )

    let subjectsCanHelpField;
    if (this.state.user.subjectsCanHelp.length > 0) {
      const subjectsCanHelp = this.state.user.subjectsCanHelp.map(subject => {
        return (
          languages[this.props.language].general.subjects[subject]
        )
      }).join(', ');

      subjectsCanHelpField = (
        <li>
          <div>
            <StyledLabel>{languages[this.props.language].view_user_page.subjectsCanHelp}</StyledLabel>
            <p className={style.description}>{subjectsCanHelp}</p>
          </div>
        </li>
      )
    }

    let subjectsNeedHelpField;
    if (this.state.user.subjectsNeedHelp.length > 0) {
      const subjectsNeedHelp = this.state.user.subjectsNeedHelp.map(subject => {
        return (
          languages[this.props.language].general.subjects[subject]
        )
      }).join(', ');

      subjectsNeedHelpField = (
        <li>
          <div>
            <StyledLabel>{languages[this.props.language].view_user_page.subjectsNeedHelp}</StyledLabel>
            <p className={style.description}>{subjectsNeedHelp}</p>
          </div>
        </li>
      )
    }

    let phoneField;
    if (this.state.user.phone !== undefined) {
      phoneField = (
        <div>
          <StyledLabel>{languages[this.props.language].user_preferences_page.phone.phone}</StyledLabel>
          <p className={style.description}>{stringifyPhone(this.state.user.phone)}</p>
        </div>
      )
    }

    let responsesField1;
    let responsesField2;
    let buttons;
    if (this.state.isUserVerified === false) {
      buttons = (
        <div className={style.emailBtnsContainer}>
          <Button id='back' onClick={() => { this.props.history.back(); }}>{languages[this.props.language].general.menu.back_btn}</Button>
        </div>
      )
    } else if (getUserData('id') === this.state.user.id) {
      buttons = (
        <div className={style.emailBtnsContainer}>
          <Button id='back' onClick={() => { this.props.history.back(); }}>{languages[this.props.language].general.menu.back_btn}</Button>
          <Button id='edit' onClick={() => { this.props.history.push('/userpreferences'); }}>{languages[this.props.language].general.menu.edit_btn}</Button>
        </div>
      );
    } else {
      let ban_report_btn;
      if (getUserData('moderator') === true) {
        ban_report_btn = (<DangerButton id='ban' onClick={() => { this.confirmBan(); }}>{languages[this.props.language].moderation_page.verify.ban_popup.btn}</DangerButton>);
      } else {
        ban_report_btn = (<DangerButton id='report' onClick={() => { this.confirmReport(); }}>{languages[this.props.language].general.menu.report_btn}</DangerButton>);
      }

      buttons = (
        <div className={style.emailBtnsContainer}>
          <Button id='back' onClick={() => { this.props.history.back(); }}>{languages[this.props.language].general.menu.back_btn}</Button>
          {ban_report_btn}
        </div>
      );

      responsesField1 = (
        <Responses user={this.state.user} type={'usrToLgd'} responses={this.state.userReponsesToLoggedin} language={this.props.language} history={this.props.history} theme={this.props.theme} menuType={this.state.menuType} setMessage={this.setMessage} fetchResponses={this.fetchResponses}/>
      )

      responsesField2 = (
        <Responses user={this.state.user} type={'lgdToUsr'} responses={this.state.loggedinResponsesToUser} language={this.props.language} history={this.props.history} theme={this.props.theme} menuType={this.state.menuType} setMessage={this.setMessage} fetchResponses={this.fetchResponses}/>
      )
    }
    
    let loadingCircle;
    if (this.state.showLoadingCircle === true) {
      loadingCircle = (
        <LoadingCircleContainer>
          <LoadingCircle theme={this.props.theme}/>
        </LoadingCircleContainer>
      )
    }

    return (
      <div>
        <div id='page'>
          <Menu history={this.props.history} theme={this.props.theme} style={style} language={this.props.language} changeTheme={this.props.changeTheme} changeLanguage={this.props.changeLanguage} setMessage={this.setMessage}/>
          <div id='pageBody' className={style['pageBodydesktop']}>
            <div className={style['pref_container' + this.state.menuType]}>
              <ul className={style['settings_listdesktop']}>
                <li>
                  {userField}
                </li>
                <li>
                  {phoneField}
                </li>
                <li>
                  {bioField}
                </li>
                <li>
                  {subjectsCanHelpField}
                </li>
                <li>
                  {subjectsNeedHelpField}
                </li>
              </ul>
              {buttons}
              {responsesField1}
              {responsesField2}
            </div>
          </div>
          <Footer />
        </div>
        {loadingCircle}
        <MessagePopUp elementId={'page'} callback={this.state.afterHidingCallback} showMessage={this.state.showMessage} title={this.state.messageTitle} msgType={this.state.messageType} titleType={this.state.titleType} preventAutoHiding={this.state.preventAutoHiding} style={style} theme={this.props.theme} language={this.props.language} setMessage={this.setMessage}/>
      </div>
    )
  }
}

export default withTheme(ViewUserPage);