import React from 'react';
import styled, { withTheme } from 'styled-components';
import style from '../styles/viewpost_page.module.css';
import { MessagePopUp, Footer, Menu, Button, sendRequest, LoadingCircle, getUrlParam, DangerButton, getUserData, DisabledButton, PFP, setUserData, stringifyPhone, stringifyUserGrade } from '../utils/additional';
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

const GreenButton = styled.button`
  display: inline-block;
  border-style: solid;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${props => props.theme.greenColor};

  font-size: 14pt;

  height: 48px;

  padding-left: 17px;
  padding-right: 17px;

  color: ${props => props.theme.greenColor};
  background-color: ${props => props.theme.primaryColor};
`

const GreenButton1 = styled.button`
  display: inline-block;
  border-style: solid;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${props => props.theme.borderColor};

  font-size: 14pt;

  height: 48px;

  padding-left: 17px;
  padding-right: 17px;

  color: ${props => props.theme.textColor};
  background-color: ${props => props.theme.greenColor};

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.darkerGreenColor};
  }
`

const RedButton = styled.button`
  display: inline-block;
  border-style: solid;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${props => props.theme.dangerColor};

  font-size: 14pt;

  height: 48px;

  padding-left: 17px;
  padding-right: 17px;

  color: ${props => props.theme.dangerColor};
  background-color: ${props => props.theme.primaryColor};
`

const Green = styled.p`
  color: ${props => props.theme.greenColor};
`

const Red = styled.p`
  color: ${props => props.theme.dangerColor};
`

class Responses extends React.Component {
  constructor(props) {
    super(props);
    this.setDropdown = this.setDropdown.bind(this);
    this.fetchResponses = this.fetchResponses.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.confirmAccept = this.confirmAccept.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
    this.confirmDecline = this.confirmDecline.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.confirmCancel = this.confirmCancel.bind(this);

    this.state = {
      postId: getUrlParam('id'),
      responses: []
    }

    this.fetchResponses();
  }

  componentDidMount() {
    this.fetchResponses();
  }

  fetchResponses() {
    sendRequest('/getresponsestouser', 'POST', {data: JSON.stringify(['viewpost_page', this.state.postId])})
    .then(response => {
      if (response.status === 'ok') {
        this.setState({
          responses: response.responses
        })
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
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

  handleAccept(userId) {
    sendRequest('/respond', 'POST', {data: JSON.stringify(['accept', this.state.postId, userId])})
    .then(response => {
      if (response.status === 'ok') {
        this.props.setMessage(languages[this.props.language].view_post_page.accepted_text, 'text', languages[this.props.language].user_preferences_page.success, 'success');
        this.fetchResponses();
        this.props.fetchPost();
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }

  handleDecline(userId) {
    sendRequest('/respond', 'POST', {data: JSON.stringify(['decline', this.state.postId, userId])})
    .then(response => {
      if (response.status === 'ok') {
        this.props.setMessage(languages[this.props.language].view_post_page.declined_text, 'text', languages[this.props.language].user_preferences_page.success, 'success');
        this.fetchResponses();
        this.props.fetchPost();
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }

  handleCancel(userId) {
    sendRequest('/respond', 'POST', {data: JSON.stringify(['cancel', this.state.postId, userId])})
    .then(response => {
      if (response.status === 'ok') {
        this.props.setMessage(languages[this.props.language].view_post_page.cancelled_text, 'text', languages[this.props.language].user_preferences_page.success, 'success');
        this.fetchResponses();
        this.props.fetchPost();
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }


  confirmAccept(userId) {
    const body = (
      <div className={style.dialog_btn_container}>
        <Button onClick={() => { this.props.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
        <SafeP className={style.dialog_confirm} onClick={() => { this.props.setMessage(false, false, false, false, false, () => {}); this.handleAccept(userId); }}>{languages[this.props.language].view_post_page.accept}</SafeP>
      </div>
    )
  
    this.props.setMessage(body, 'other', languages[this.props.language].view_post_page.accept_title, 'normal', true);
  }

  confirmDecline(userId) {
    const body = (
      <div className={style.dialog_btn_container}>
        <Button onClick={() => { this.props.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
        <DangerP className={style.dialog_confirm} onClick={() => { this.props.setMessage(false, false, false, false, false, () => {}); this.handleDecline(userId); }}>{languages[this.props.language].view_post_page.decline}</DangerP>
      </div>
    )
  
    this.props.setMessage(body, 'other', languages[this.props.language].view_post_page.decline_title, 'normal', true);
  }

  confirmCancel(userId) {
    const body = (
      <div className={style.dialog_btn_container}>
        <Button onClick={() => { this.props.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
        <DangerP className={style.dialog_confirm} onClick={() => { this.props.setMessage(false, false, false, false, false, () => {}); this.handleCancel(userId); }}>{languages[this.props.language].view_post_page.yes}</DangerP>
      </div>
    )
  
    this.props.setMessage(body, 'other', languages[this.props.language].view_post_page.cacnel_title, 'normal', true);
  }

  render() {
    let toShow;
    if (this.state.responses.length === 0) {
      toShow = (
        <p>{languages[this.props.language].view_post_page.no_responses}</p>
      )
    } else {
      const responses = this.state.responses;
      let newResponses = [];

      for (let i = 0; i < responses.length; i++) {
        let dropdown;
        let responseStatus;
        if (responses[i].status === 'pending') {
          responseStatus = (
            <p className={style.response_status_p}>{languages[this.props.language].view_post_page.response_status.pending}</p>
          );

          dropdown = [
            <li onClick={() => this.confirmAccept(responses[i].userId)}><SafeP>{languages[this.props.language].view_post_page.accept}</SafeP></li>,
            <li onClick={() => this.confirmDecline(responses[i].userId)}><DangerP>{languages[this.props.language].view_post_page.decline}</DangerP></li>
          ]
        } else if (responses[i].status === 'accepted') {
          
          responseStatus = (
            <Green className={style.response_status_p}>{languages[this.props.language].view_post_page.response_status.accepted}</Green>
          );

          dropdown = [
            <li onClick={() => this.confirmCancel(responses[i].userId)}><DangerP>{languages[this.props.language].general.menu.cancel_btn}</DangerP></li>
          ]
        } else if (responses[i].status === 'declined') {
          responseStatus = (
            <Red className={style.response_status_p}>{languages[this.props.language].view_post_page.response_status.declined}</Red>
          )

          dropdown = [
            <li onClick={() => this.confirmAccept(responses[i].userId)}><SafeP>{languages[this.props.language].view_post_page.accept}</SafeP></li>
          ]
        }

        let dropdownContainer;
        let dots;
        if (this.props.postStatus !== 'completed') {
          dropdownContainer = (
            <StyledDropdown id={'dropdown' + i} className={style.post_dropdown_container} onMouseLeave={() => { this.setDropdown(i, 'none'); }}>
              <StyledDropdownList>
                {dropdown}
              </StyledDropdownList>
            </StyledDropdown>
          );

          dots = (<img src={this.props.theme.dots} alt={':'} id={'dots' + i} className={style['dots']} onClick={() => { this.setDropdown(i, 'block'); }} onMouseOver={() => { this.setDropdown(i, 'block'); }} onMouseLeave={() => { this.setDropdown(i, 'none'); }}/>);
        }

        newResponses.push(
          <li className={style.responses_list_li}>
            <div className={style['post_name_container']}>
              <div className={style['post_name_container1']} onClick={() => { this.props.history.push('/user?id=' + responses[i].userId); }}>
                <PFP theme={this.props.theme} type={'work_page_post_pfp'} pfp={responses[i].userPfp} />
                <div>
                  <p className={style['post_name']}>{responses[i].userName + ' ' + responses[i].userSurname}</p>
                  <p className={style['post_grade']}>{stringifyUserGrade(responses[i].userRole, responses[i].userGrade, this.props.language)}</p>
                </div>
              </div>
              {responseStatus}
              {dots}
            </div>
            {dropdownContainer}
          </li>
        )
      }

      toShow = newResponses;
    }

    let refreshBtn;
    if (this.props.postStatus !== 'completed') {
      refreshBtn = (
        <div className={style.refresh} onClick={() => { this.fetchResponses(); }}>
          <img src={this.props.theme.refresh_icon} alt={'r'}></img>
          <p>{languages[this.props.language].general.menu.refresh_btn}</p>
        </div>
      )
    }

    return (
      <div className={style.responses_container}>
        <div className={style.responses_title}>
          <StyledLabel>{languages[this.props.language].view_post_page.responses}</StyledLabel>
          {refreshBtn}
        </div>
        <ul className={style.responses_list}>
          {toShow}
        </ul>
      </div>
    )
  }
}

class PostPage extends React.Component {
  constructor(props) {
    super(props);
    this.fetchPost = this.fetchPost.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.handleReport = this.handleReport.bind(this);
    this.confirmReport = this.confirmReport.bind(this);
    this.handleRespond = this.handleRespond.bind(this);
    this.confirmRespond = this.confirmRespond.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.confirmComplete = this.confirmComplete.bind(this);
    this.windowSizeChanged = this.windowSizeChanged.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);

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
      subjects: [],
      title: '',
      description: '',
      deadline: '',
      postId: getUrlParam('id'),
      responseStatus: '',
      isUserVerified: getUserData('verified')
    }

    this.fetchPost();
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.windowSizeChanged);
    this.windowSizeChanged();
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

  fetchPost() {
    this.setState({
      showLoadingCircle: true
    });

    if (this.state.postId !== null) {
      sendRequest('/getposts', 'POST', {data: JSON.stringify(['viewpost_page', this.state.postId])})
      .then(response => {
        if (response.status === 'ok') {
          this.setState({
            title: response.post.title,
            description: response.post.description,
            deadline: response.post.deadline,
            subjects: response.post.subjects,
            postId: response.post.id,
            postStatus: response.post.status,
            userId: response.post.userId,
            userName: response.userName,
            userSurname: response.userSurname,
            userGrade: response.userGrade,
            userPfp: response.userPfp,
            userPhone: stringifyPhone(response.userPhone),
            responseStatus: response.responseStatus,
            showLoadingCircle: false
          });

          document.title = 'SUP | ' + response.post.title;
        } else {
          this.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure', () => {this.props.history.push('/work')});
        }
      })
    }
  }

  handleReport() {
    this.setState({
      showLoadingCircle: true
    })

    sendRequest('/report', 'POST', {data: JSON.stringify(['add', 'post', this.state.postId])})
    .then(response => {
      this.setState({
        showLoadingCircle: false
      })

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

  handleComplete() {
    this.setState({
      showLoadingCircle: true
    })

    sendRequest('/handlepost', 'POST', {data: JSON.stringify(['complete', this.state.postId, ])})
    .then(response => {
      if (response.status === 'ok') {
        this.setState({
          showLoadingCircle: false,
          postStatus: 'completed'
        })
        this.setMessage(languages[this.props.language].view_post_page.completed_text, 'text', languages[this.props.language].user_preferences_page.success, 'success');
      }

      if (response.status === 'error') {
        this.setState({
          showLoadingCircle: false
        })
        this.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }

  confirmComplete() {
    const body = (
      <div className={style.dialog_btn_container}>
        <Button onClick={() => { this.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
        <GreenButton1 className={style.dialog_confirm} onClick={() => { this.setMessage(false, false, false, false, false, () => {}); this.handleComplete(); }}>{languages[this.props.language].view_post_page.complete_post_btn}</GreenButton1>
      </div>
    )
  
    this.setMessage(body, 'other', languages[this.props.language].view_post_page.complete_title, 'normal', true);
  }

  handleRespond() {
    this.setState({
      showLoadingCircle: true
    })

    sendRequest('/respond', 'POST', {data: JSON.stringify(['add', this.state.postId])})
    .then(response => {
      this.setState({
        showLoadingCircle: false
      })

      if (response.status === 'ok') {
        this.setState({
          responded: true
        });

        let temp = getUserData('postsUserRespondedTo');
        temp.push({postId: this.state.postId});
        setUserData('postsUserRespondedTo', temp);

        this.setMessage(languages[this.props.language].view_post_page.responded_text, 'text', languages[this.props.language].user_preferences_page.success, 'success');
      }

      if (response.status === 'already_responded') {
        this.setMessage(languages[this.props.language].view_post_page.already_responded_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }

      if (response.status === 'error') {
        this.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }

  confirmRespond() {
    const body = (
      <div className={style.dialog_btn_container}>
        <Button onClick={() => { this.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
        <SafeP className={style.dialog_confirm} onClick={() => { this.setMessage(false, false, false, false, false, () => {}); this.handleRespond(); }}>{languages[this.props.language].view_post_page.respond_btn}</SafeP>
      </div>
    )
  
    this.setMessage(body, 'other', languages[this.props.language].view_post_page.respond_title, 'normal', true);
  }

  handleDelete() {
    sendRequest('/deletepost', 'POST', {data: JSON.stringify([this.state.postId])})
    .then(response => {
      if (response.status === 'ok') {
        this.setMessage(languages[this.props.language].moderation_page.reports.delete_popup.successTitle, 'text', languages[this.props.language].user_preferences_page.success, 'success', () => {this.props.history.push('/work')});
      }

      if (response.status === 'error') {
        this.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }
  
  confirmDelete() {
    const body = (
      <div className={style.dialog_btn_container}>
        <Button onClick={() => { this.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
        <DangerP className={style.dialog_confirm} onClick={() => { this.setMessage(false, false, false, false, false, () => {}); this.handleDelete(); }}>{languages[this.props.language].moderation_page.reports.delete_popup.btn}</DangerP>
      </div>
    )
    
    this.setMessage(body, 'other', languages[this.props.language].moderation_page.reports.delete_popup.title, 'normal', true);
  }
  
  render() {
    const titleField = (
      <div>
        <StyledLabel htmlFor='title'>{languages[this.props.language].edit_post_page.title}</StyledLabel>
        <p>{this.state.title}</p>
      </div>
    )

    const descriptionField = (
      <div>
        <StyledLabel htmlFor='description'>{languages[this.props.language].edit_post_page.description}</StyledLabel>
        <p className={style.description} id='description' type='text'>{this.state.description}</p>
      </div>
    )


    const subjects = this.state.subjects.map(subject => {
      return (
        languages[this.props.language].general.subjects[subject]
      )
    })

    const subjectsField = (
      <div>
          <StyledLabel>{languages[this.props.language].edit_post_page.subjects}</StyledLabel>
          <p>{subjects.join(', ')}</p>
      </div>
    )


    const deadlineField = (
      <div>
        <StyledLabel htmlFor='deadline'>{languages[this.props.language].edit_post_page.deadline}</StyledLabel>
        <p>{this.state.deadline}</p>
      </div>
    )


    let buttons;
    if (this.state.isUserVerified === false) {
      buttons = (
        <div className={style.emailBtnsContainer}>
          <Button id='back' onClick={() => { this.props.history.back(); }}>{languages[this.props.language].general.menu.back_btn}</Button>
        </div>
      )
    } else if (getUserData('id') === this.state.userId) {
      if (this.state.postStatus === 'in_progress') {
        buttons = (
          <div className={style.btns_container1}>
            <div className={style.emailBtnsContainer}>
              <Button id='back' onClick={() => { this.props.history.back(); }}>{languages[this.props.language].general.menu.back_btn}</Button>
              <Button id='edit' onClick={() => { this.props.history.push('/editpost?id=' + this.state.postId); }}>{languages[this.props.language].general.menu.edit_btn}</Button>
            </div>
            <GreenButton1 id='complete' className={style.next_btn} onClick={() => { this.confirmComplete(); }}>{languages[this.props.language].view_post_page.complete_post_btn}</GreenButton1>
          </div>
        )
      } else if (this.state.postStatus === 'completed') {
        buttons = (
          <div className={style.emailBtnsContainer}>
            <Button id='back' onClick={() => { this.props.history.back(); }}>{languages[this.props.language].general.menu.back_btn}</Button>
            <GreenButton id='completed' className={style.next_btn}>{languages[this.props.language].view_post_page.completed_btn}</GreenButton>
          </div>
        )
      } else {
        buttons = (
          <div className={style.emailBtnsContainer}>
            <Button id='back' onClick={() => { this.props.history.back(); }}>{languages[this.props.language].general.menu.back_btn}</Button>
            <Button id='edit' onClick={() => { this.props.history.push('/editpost?id=' + this.state.postId); }}>{languages[this.props.language].general.menu.edit_btn}</Button>
          </div>
        )
      }
    } else {
      let respondBtn;
      if (this.state.responded === true) {
        respondBtn = (
          <DisabledButton id='responded'>{languages[this.props.language].view_post_page.responded_btn}</DisabledButton>
        );
      } else {
        if (this.state.responseStatus === 'pending') {
          respondBtn = (<DisabledButton id='responded'>{languages[this.props.language].view_post_page.responded_btn}</DisabledButton>)
        } else if (this.state.responseStatus === 'accepted') {
          if (this.state.postStatus === 'completed') {
            respondBtn = (<GreenButton id='completed'>{languages[this.props.language].view_post_page.completed_btn}</GreenButton>)
          } else {
            respondBtn = (<GreenButton id='accepted'>{languages[this.props.language].view_post_page.response_status.accepted}</GreenButton>)
          }
        } else if (this.state.responseStatus === 'declined') {
          respondBtn = (<RedButton id='declined'>{languages[this.props.language].view_post_page.response_status.declined}</RedButton>)
        } else {
          if (this.state.postStatus === 'in_progress') {
            respondBtn = (<DisabledButton id='in_progress'>{languages[this.props.language].view_post_page.in_progress}</DisabledButton>)
          } else if (this.state.postStatus === 'completed') {
            respondBtn = (<DisabledButton id='completed'>{languages[this.props.language].view_post_page.completed_btn}</DisabledButton>)
          } else {
            respondBtn = (<Button id='respond' onClick={() => { this.confirmRespond(); }}>{languages[this.props.language].view_post_page.respond_btn}</Button>)
          }
        }
      }

      let reportBtn;
      if (this.state.postStatus !== 'completed' && this.state.responseStatus !== 'accepted' && this.state.responseStatus !== 'pending' && this.state.responseStatus !== 'declined') {
        reportBtn = (<DangerButton id='report' className={style.next_btn} onClick={() => { this.confirmReport(); }}>{languages[this.props.language].general.menu.report_btn}</DangerButton>);
      }

      if (getUserData('moderator') === true) {
        reportBtn = (<DangerButton id='delete' className={style.next_btn} onClick={() => { this.confirmDelete(); }}>{languages[this.props.language].moderation_page.reports.delete_popup.btn}</DangerButton>);
      }

      buttons = (
        <div className={style.btns_container1}>
          <div className={style.emailBtnsContainer}>
            <Button id='back' onClick={() => { this.props.history.back(); }}>{languages[this.props.language].general.menu.back_btn}</Button>
            {respondBtn}
          </div>
          {reportBtn}
        </div>
      )
    }

    const userField = (
      <div className={style['post_name_container']}>
        <div className={style['post_name_container1']} onClick={() => { this.props.history.push('/user?id=' + this.state.userId); }}>
          <PFP theme={this.props.theme} type={'work_page_post_pfp'} pfp={this.state.userPfp} />
          <div>
            <p className={style['post_name']}>{this.state.userName + ' ' + this.state.userSurname}</p>
            <p className={style['post_grade']}>{this.state.userGrade}</p>
          </div>
        </div>
        <img src={this.props.theme.dots} alt={':'} id={'dotso'} className={style['dots']} onClick={() => {  }} onMouseOver={() => {  }} onMouseLeave={() => {  }}/>
      </div>
    )

    let phoneNumberField;
    if (this.state.responseStatus === 'accepted') {
      phoneNumberField = (this.state.menuType === 'mobile') ? (
        <div className={style.phone_number_container}>
          <p className={style['phone_number_p' + this.state.menuType]}>{languages[this.props.language].user_preferences_page.phone.title}</p>
          <p className={style['phone_number_p' + this.state.menuType]}>{this.state.userPhone}</p>
        </div>
      ) : (
        <div className={style.phone_number_container}>
          <p className={style['phone_number_p' + this.state.menuType]}>{languages[this.props.language].user_preferences_page.phone.title + this.state.userPhone}</p>
        </div>
      )
    };
    
    let responsesList;
    if (this.state.userId === getUserData('id')) {
    responsesList = (
      <Responses fetchPost={this.fetchPost} postStatus={this.state.postStatus} postId={this.state.postId} language={this.props.language} history={this.props.history} theme={this.props.theme} setMessage={this.setMessage}/>
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
        <div id='page'>
          <Menu history={this.props.history} theme={this.props.theme} style={style} language={this.props.language} changeTheme={this.props.changeTheme} changeLanguage={this.props.changeLanguage} setMessage={this.setMessage}/>
          <div id='pageBody' className={style['pageBodydesktop']}>
            <div className={style['pref_container' + this.state.menuType]}>
              <ul className={style['settings_listdesktop']}>
                <li>
                  {titleField}
                </li>
                <li>
                  {descriptionField}
                </li>
                <li>
                  {deadlineField}
                </li>
                <li>
                  {subjectsField}
                </li>
                <li>
                  {userField}
                </li>
              </ul>
              {phoneNumberField}
              {buttons}
              {responsesList}
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

export default withTheme(PostPage);