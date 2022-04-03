import React from 'react';
import styled, { withTheme } from 'styled-components';
import style from '../styles/editpost_page.module.css';
import { MessagePopUp, StyledInput, Footer, Menu, Button, sendRequest, LoadingCircle,  capitalizeFirstLetter, getUrlParam, DangerButton } from '../utils/additional';
import languages from '../utils/languages';

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
  min-width: 260px;
  max-width: 435px;

  padding-left: 10px;
  border-style: none;
  display: inline-block;

  margin: 0;

  height: 100%;
  width: 100%;
  padding: 0px;

  font-size: 15pt;
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

const StyledDatepicker = styled.input`
  border-style: none;
  font-size: 20px;
  border-radius: 10px;
  border: solid 1px;
  padding: 10px;
  width: -webkit-fill-available;
  image-rendering: optimizequality;

  filter: ${() => localStorage.getItem('theme') === 'dark' ? 'invert(1)' : ''};

  &:hover {
    cursor: pointer;
  }
`

const DangerP = styled.p`
  color: ${props => props.theme.dangerColor};

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.darkerDangerColor};
  }
`

function checkTitle(title) {
  if (!/(?=.{5,})/.test(title)) {
    return 'too_short';
  }

  if (/(?=.{50,})/.test(title)) {
    return 'too_long';
  }

  return true;
}

function checkDescription(desc) {
  if (!/(?=.{1,})/.test(desc)) {
    return 'too_short';
  }

  if (/(?=.{500,})/.test(desc)) {
    return 'too_long';
  }

  return true;
}

function checkDeadline(date) {
  if (date === '') {
    return 'empty';
  }

  const now = new Date();
  const then = new Date(date);

  if (now >= then) {
    return 'not_in_future';
  }

  return true;
}

function checkSubjects(subjects) {
  if (subjects.length === 0) {
    return 'empty';
  }

  return true;
}

class PostPage extends React.Component {
  constructor(props) {
    super(props);
    this.resize = this.resize.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.windowSizeChanged = this.windowSizeChanged.bind(this);
    this.handleSubjectClick = this.handleSubjectClick.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);

    
    this.state = {
      showMessage: false,
      messageTitle: 'temp title',
      messageType: 'text',
      titleType: 'normal',
      preventAutoHiding: false,
      afterHidingCallback: () => {},
      menuType: 'desktop',
      titleCheck: true,
      descCheck: true,
      deadlineCheck: true,
      subjectsCheck: true,
      subjects: [],
      showLoadingCircle: false,
      initTitle: '',
      initDescription: '',
      initDeadline: '',
      postType: 'new',
      postId: ''
    }

    const postId = getUrlParam('id');

    if (postId !== null) {
      sendRequest('/getposts', 'POST', {data: JSON.stringify(['editpost_page', postId])})
      .then(response => {
        if (response.status === 'ok') {
          if (response.post.status === 'completed') {
            this.setMessage(languages[this.props.language].edit_post_page.post_archived, 'text', languages[this.props.language].general.access_denied, 'failure', () => {this.props.history.back()});
          } else {
            this.setState({
              initTitle: response.post.title,
              initDescription: response.post.description,
              initDeadline: response.post.deadline,
              subjects: response.post.subjects,
              postType: 'update',
              postId: postId
            });
            this.resize();
  
            document.title = 'SUP | ' + response.post.title;
          }
        }

        if (response.status === 'error') {
          this.setMessage(languages[this.props.language].general.access_denied, 'text', languages[this.props.language].user_preferences_page.failure, 'failure', () => {this.props.history.back()});
        }
      })
    }
  }

  resize() {
    const tx = document.getElementById('description');

    if (tx !== null) {
      tx.style.height = 'auto';
      tx.style.height = (tx.scrollHeight) + 'px';
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowSizeChanged);
    window.addEventListener('mouseup', this.resize);
    this.windowSizeChanged();
  }

  componentWillUnmount() {
    window.removeEventListener('input', this.resize)
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

  handleNext() {
    this.setState({
      titleCheck: true,
      descCheck: true,
      deadlineCheck: true,
      subjectsCheck: true,
      showLoadingCircle: false
    })

    const title = document.getElementById('title').value;
    const titleCheck = checkTitle(title);
  
    if (titleCheck === true) {
      const description = document.getElementById('description').value;
      const descCheck = checkDescription(description);

      if (descCheck === true) {
        const deadline = document.getElementById('deadline').value;
        const deadlineCheck = checkDeadline(deadline);

        if (deadlineCheck === true) {
          const subjects = this.state.subjects;
          const subjectsCheck = checkSubjects(subjects);
          
          if (subjectsCheck === true) {
            this.setState({
              showLoadingCircle: true
            })

            sendRequest('/handlepost', 'POST', {data: JSON.stringify([this.state.postType, this.state.postId, capitalizeFirstLetter(title), capitalizeFirstLetter(description), deadline, subjects])})
            .then(response => {
              this.setState({
                showLoadingCircle: false,
                subjects: []
              });
              document.getElementById('title').value = '';
              document.getElementById('description').value = '';
              document.getElementById('deadline').value = '';

              if (response.status === 'ok') {
                this.setMessage(languages[this.props.language].edit_post_page.response[response.type].body, 'text', languages[this.props.language].edit_post_page.response[response.type].title, 'success', () => { this.props.history.push('/work'); });
              }

              if (response.status === 'error') {
                this.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
              }
            })
          } else {
            this.setState({
              subjectsCheck: subjectsCheck
            })
          }
        } else {
          this.setState({
            deadlineCheck: deadlineCheck
          })
        }
      } else {
        this.setState({
          descCheck: descCheck
        })
      }
    } else {
      this.setState({
        titleCheck: titleCheck
      })
    }
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

  handleDelete() {
    this.setState({
      showLoadingCircle: true
    })

    sendRequest('/handlepost', 'POST', {data: JSON.stringify(['delete', this.state.postId])})
    .then(response => {
      this.setState({
        showLoadingCircle: false
      })

      if (response.status === 'ok') {
        this.setMessage(languages[this.props.language].edit_post_page.response.delete.body, 'text', languages[this.props.language].edit_post_page.response.delete.title, 'success', () => { this.props.history.push('/work'); });
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
        <DangerP className={style.dialog_confirm} onClick={() => { this.setMessage(false, false, false, false, false, () => {}); this.handleDelete(); }}>{languages[this.props.language].edit_post_page.delete_btn}</DangerP>
      </div>
    )
  
    this.setMessage(body, 'other', languages[this.props.language].edit_post_page.delete_title, 'normal', true);
  }
  
  render() {
    let titleIncorrect;
    if (this.state.titleCheck !== true) {
      titleIncorrect = (
        <p className={style.typing_error}>{languages[this.props.language].edit_post_page.errors.title[this.state.titleCheck]}</p>
      )
    }

    const titleField = (
      <div>
        <StyledLabel htmlFor='title'>{languages[this.props.language].edit_post_page.title}</StyledLabel>
        <StyledInputDiv>
          <StyledInput className={style.password} id='title' type='text' placeholder={languages[this.props.language].edit_post_page.title} defaultValue={this.state.initTitle} autoFocus></StyledInput>
        </StyledInputDiv>
        {titleIncorrect}
      </div>
    )

    const tx = document.getElementById('description');
    if (tx !== null) {
      tx.addEventListener('input', this.resize());
    }

    let descIncorrect;
    if (this.state.descCheck !== true) {
      descIncorrect = (
        <p className={style.typing_error}>{languages[this.props.language].edit_post_page.errors.description[this.state.descCheck]}</p>
      )
    }

    const descriptionField = (
      <div>
          <StyledLabel htmlFor='description'>{languages[this.props.language].edit_post_page.description}</StyledLabel>
          <div className={style.textarea_div} id='desc_container'>
            <StyledTextarea id='description' type='text' defaultValue={this.state.initDescription} placeholder={languages[this.props.language].edit_post_page.description}></StyledTextarea>
          </div>
          {descIncorrect}
      </div>
    )

    const existingSubjects = languages[this.props.language].general.subjects;
    const keys = Object.keys(existingSubjects);
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

    let subjectsIncorrect;
    if (this.state.subjectsCheck !== true) {
      subjectsIncorrect = (
        <p className={style.typing_error}>{languages[this.props.language].edit_post_page.errors.subjects[this.state.subjectsCheck]}</p>
      )
    }

    const subjectsField = (
      <div>
          <StyledLabel>{languages[this.props.language].edit_post_page.subjects}</StyledLabel>
          <ul className={style['subjects_listdesktop']}>
            {subjectList}
          </ul>
          {subjectsIncorrect}
      </div>
    )

    let deadlineIncorrect;
    if (this.state.deadlineCheck !== true) {
      deadlineIncorrect = (
        <p className={style.typing_error}>{languages[this.props.language].edit_post_page.errors.deadline[this.state.deadlineCheck]}</p>
      )
    }

    const deadlineField = (
      <div>
        <StyledLabel htmlFor='deadline'>{languages[this.props.language].edit_post_page.deadline}</StyledLabel>
        <StyledDatepicker type='date' id='deadline' defaultValue={this.state.initDeadline}></StyledDatepicker>
        {deadlineIncorrect}
      </div>
    )

    let buttons;
    if (this.state.postType === 'update') {
      buttons = (
        <div className={style.btns_container1}>
          <div className={style.emailBtnsContainer}>
            <Button id='cancelbtn' className={style.next_btn} onClick={() => { this.props.history.back(); }}>{languages[this.props.language].user_preferences_page.cancel_btn}</Button>
            <Button id='nextbtn' className={style.next_btn} onClick={() => { this.handleNext(); }}>{languages[this.props.language].general.menu.publish_btn}</Button>
          </div>
          <DangerButton id='deletebtn' className={style.delete_btn} onClick={() => { this.confirmDelete(); }}>{languages[this.props.language].edit_post_page.delete_btn}</DangerButton>
        </div>
      )
    } else {
      buttons = (
        <div className={style.emailBtnsContainer}>
          <Button id='cancelbtn' className={style.next_btn} onClick={() => { this.props.history.back(); }}>{languages[this.props.language].user_preferences_page.cancel_btn}</Button>
          <Button id='nextbtn' className={style.next_btn} onClick={() => { this.handleNext(); }}>{languages[this.props.language].general.menu.publish_btn}</Button>
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
              </ul>
              {loadingCircle}
              {buttons}
            </div>
          </div>
          <Footer />
        </div>
        <MessagePopUp elementId={'page'} callback={this.state.afterHidingCallback} showMessage={this.state.showMessage} title={this.state.messageTitle} msgType={this.state.messageType} titleType={this.state.titleType} preventAutoHiding={this.state.preventAutoHiding} style={style} theme={this.props.theme} language={this.props.language} setMessage={this.setMessage}/>
      </div>
    )
  }
}

export default withTheme(PostPage);