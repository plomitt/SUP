import React from 'react';
import styled, { withTheme } from 'styled-components';
import style from '../styles/user_jobs_page.module.css';
import { MessagePopUp, Footer, Menu, sendRequest, LoadingCircle, getUrlParam, PFP, LoadingCircleContainer, stringifyUserGrade } from '../utils/additional';
import languages from '../utils/languages';

const Green = styled.p`
  color: ${props => props.theme.greenColor};
`

const Orange = styled.p`
  color: ${props => props.theme.orangeColor};
`

const Red = styled.p`
  color: ${props => props.theme.dangerColor};
`

class Responses extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: getUrlParam('id')
    }
  }

  render() {
    const elements = this.props.elements;
    const menuType = this.props.menuType;

    let toShow;
    if (elements.length === 0) {
      toShow = (
        <p>{languages[this.props.language].user_jobs_page[this.props.type].no_elements}</p>
      )
    } else {
      const listType = this.props.type;
      let newElements = [];

      if (listType === 'userPosts') {
        for (let i = 0; i < elements.length; i++) {
          const post = elements[i];
          let postStatus;
          if (post.status === 'pending') {
            postStatus = (
              <p className={style['response_status_p' + menuType]}>{languages[this.props.language].view_post_page.response_status.pending}</p>
            );
          } else if (post.status === 'completed') {
            postStatus = (
              <Green className={style['response_status_p' + menuType]}>{languages[this.props.language].view_post_page.completed_btn}</Green>
            );
          } else if (post.status === 'in_progress') {
            postStatus = (
              <Orange className={style['response_status_p' + menuType]}>{languages[this.props.language].view_post_page.in_progress}</Orange>
            )
          }
  
  
          let title = post.title;
          let responsesAmount;
          if (this.props.menuType === 'mobile') {
            title = title.length > 15 ? title.slice(0, 16) + '...' : title;

            responsesAmount = post.responsesAmount;
          } else {
            responsesAmount = post.responsesAmount + languages[this.props.language].user_jobs_page.responsesAmountTxt;
          }
  
          newElements.push(
            <li className={style.responses_list_li}>
              <div className={style.post_name_container}>
                <p className={style['post_title' + menuType]} onClick={() => { this.props.history.push('/viewpost?id=' + post.id) }}>{title}</p>
                <p className={style['responses_amount' + menuType]}>{responsesAmount}</p>
                {postStatus}
              </div>
            </li>
          )
        }
      } else {
        for (let i = 0; i < elements.length; i++) {
          const response = elements[i];
          let responseStatus;
          if (response.status === 'pending') {
            responseStatus = (
              <p className={style['response_status_p' + menuType]}>{languages[this.props.language].view_post_page.response_status.pending}</p>
            );
          } else if (response.status === 'declined') {
            responseStatus = (
              <Red className={style['response_status_p' + menuType]}>{languages[this.props.language].view_post_page.response_status.declined}</Red>
            )
          } else if (response.status === 'accepted') {
            if (response.post.status === 'completed') {
              responseStatus = (
                <Green className={style['response_status_p' + menuType]}>{languages[this.props.language].view_post_page.completed_btn}</Green>
              );
            } else {
              responseStatus = (
                <Orange className={style['response_status_p' + menuType]}>{languages[this.props.language].view_post_page.in_progress}</Orange>
              )
            }
          }

          const user = response.user;
          const post = response.post;

          let userField;
          let title = post.title;

          if (menuType === 'mobile') {
            title = title.length > 15 ? title.slice(0, 16) + '...' : title;

            userField = (
              <p className={style['user_name' + menuType]}>{user.name}</p>
            )
          } else {
            userField = (
              <div className={style.post_name_container1} onClick={() => { this.props.history.push('/user?id=' + user.id); }}>
                <PFP theme={this.props.theme} type={'work_page_post_pfp'} pfp={user.pfp} />
                <div>
                  <p className={style['user_name' + menuType]}>{user.name + ' ' + user.surname}</p>
                  <p className={style['user_name' + menuType]}>{stringifyUserGrade(user.role, user.grade, this.props.language)}</p>
                </div>
              </div>
            )
          }
  
          newElements.push(
            <li className={style.responses_list_li}>
              <div className={style.post_name_container}>
                {userField}
                <p className={style['response_post_status' + menuType]} onClick={() => { this.props.history.push('/viewpost?id=' + post.id) }}>{title}</p>
                {responseStatus}
              </div>
            </li>
          )
        }
      }

      toShow = newElements;
    }

    return (
      <div className={style.responses_container}>
        <div className={style.responses_title}>
          <p className={style['list_label' + menuType]}>{languages[this.props.language].user_jobs_page[this.props.type].label}</p>
          <div className={style.refresh} onClick={() => { this.props.fetchPostsAndResponses(); }}>
            <img className={style['refresh_icn' + menuType]} src={this.props.theme.refresh_icon} alt={'r'}></img>
            <p className={style['refresh_txt' + menuType]}>{languages[this.props.language].general.menu.refresh_btn}</p>
          </div>
        </div>
        <ul className={style.responses_list}>
          {toShow}
        </ul>
      </div>
    )
  }
}

class UserJobsPage extends React.Component {
  constructor(props) {
    super(props);
    this.setMessage = this.setMessage.bind(this);
    this.windowSizeChanged = this.windowSizeChanged.bind(this);
    this.fetchPostsAndResponses = this.fetchPostsAndResponses.bind(this);

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
      userPosts: [],
      userResponses: []
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowSizeChanged);
    this.windowSizeChanged();
    this.fetchPostsAndResponses();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowSizeChanged);
  }

  windowSizeChanged() {
    if (window.innerWidth >= 450) {
      this.setState({
        menuType: 'desktop'
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

  fetchPostsAndResponses() {
    this.setState({
      showLoadingCircle: true
    })

    sendRequest('/getuserjobs', 'GET')
    .then(response => {
      if (response.status === 'ok') {
        this.setState({
          userPosts: response.userPosts,
          userResponses: response.userResponses,
          showLoadingCircle: false
        })
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }
  
  render() {    
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
              <Responses user={this.state.user} type={'userPosts'} elements={this.state.userPosts} language={this.props.language} history={this.props.history} theme={this.props.theme} menuType={this.state.menuType} setMessage={this.setMessage} fetchPostsAndResponses={this.fetchPostsAndResponses}/>
              <Responses user={this.state.user} type={'userResponses'} elements={this.state.userResponses} language={this.props.language} history={this.props.history} theme={this.props.theme} menuType={this.state.menuType} setMessage={this.setMessage} fetchPostsAndResponses={this.fetchPostsAndResponses}/>
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

export default withTheme(UserJobsPage);