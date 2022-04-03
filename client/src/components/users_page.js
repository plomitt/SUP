import React from 'react';
import style from '../styles/users_page.module.css';
import { Footer, LoadingCircle, Menu, MessagePopUp, PFP, sendRequest } from '../utils/additional';
import styled, { withTheme } from 'styled-components';
import languages from '../utils/languages';

const StyledPost = styled.div`
  border-color: ${props => props.theme.textColor};
`

const LoadingCircleContainer = styled.div`
  position: fixed;
  top: 40%;
  background-color: ${props => props.theme.inputBckgColor};
  border-radius: 10px;
  border: solid 1px;
  border-color: ${props => props.theme.borderColor};
`

const SearchInput = styled.input`
  background-color: ${props => props.theme.inputBckgColor};
  color: ${props => props.theme.textColor};

  width: -webkit-fill-available;
  height: 54px;

  border: none;
  font-size: 15pt;
`

const StyledSearchbar = styled.div`
  display: flex;
  flex-flow: row;

  margin: auto;
  border-style: solid;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${props => props.theme.borderColor};

  width: -webkit-fill-available;
  max-width: 2864px;
  min-width: 289px;
  height: 56px;

  font-size: 15pt;

  padding-left: 5px;
  padding-right: 5px;

  align-items: center;

  &:focus {
    outline-style: none;
    box-shadow: none;
    border-color: transparent;
  }
`

function User(props) {
  let subjectsCanHelp = props.user.subjectsCanHelp.map(subject => {
    return (
      languages[props.language].general.subjects[subject]
    )
  }).join(', ');
  subjectsCanHelp = subjectsCanHelp > 70 ? subjectsCanHelp.slice(0, 71) + '...' : subjectsCanHelp;

  let subjectsNeedHelp = props.user.subjectsNeedHelp.map(subject => {
    return (
      languages[props.language].general.subjects[subject]
    )
  }).join(', ');
  subjectsNeedHelp = subjectsNeedHelp > 70 ? subjectsNeedHelp.slice(0, 71) + '...' : subjectsNeedHelp;


  const bio = props.user.bio.length > 70 ? props.user.bio.slice(0, 71) + '...' : props.user.bio;


  const userPath = '/user?id=' + props.user.id;

  return (
    <StyledPost className={style['post_box']}>
      <ul className={style['post_list']}>
        <li onClick={() => { props.history.push(userPath); }}>
          <div className={style['post_name_container']}>
            <div className={style['post_name_container1']}>
              <PFP theme={props.theme} type={'users_page_post_pfp'} pfp={props.user.pfp} />
              <div>
                <p className={style['user_name']}>{props.user.name + ' ' + props.user.surname}</p>
                <p className={style['user_grade']}>{props.user.grade}</p>
              </div>
            </div>
          </div>
        </li>
        <li onClick={() => { props.history.push(userPath); }}>
          <div className={style['post_title_container']}>
            <p className={style['user_bio']}>{bio}</p>
          </div>
        </li>
        <li onClick={() => { props.history.push(userPath); }}>
          <div>
            <p className={style['user_subjects']}>{languages[props.language].users_page.subjectsCanHelp}{subjectsCanHelp}</p>
          </div>
        </li>
        <li onClick={() => { props.history.push(userPath); }}>
          <div>
            <p className={style['user_subjects']}>{languages[props.language].users_page.subjectsNeedHelp}{subjectsNeedHelp}</p>
          </div>
        </li>
      </ul>
    </StyledPost>
  )
}

function Users(props) {
  let postsList = [];
  const users = props.users;

  for (let i = 0; i < users.length; i++) {
    postsList.push(
      <User user={users[i]} eKey={i} menuType={props.menuType} history={props.history} theme={props.theme} language={props.language} refreshPosts={props.refreshPosts} setMessage={props.setMessage}/>
    )
  }
  
  return (
    <div className={style['posts_container_' + props.menuType]}>
      {postsList}
    </div>
  )
}

function Pagination(props) {
  let left_arrow_style = 'arrow_left';
  let right_arrow_style = 'arrow_right';

  if (props.pageNumber <= 1) {
    left_arrow_style = 'arrow_left_hide';
  }

  if (props.pageNumber >= props.amountOfPages) {
    right_arrow_style = 'arrow_right_hide';
  }

  return (
    <div className={style.pagination_container}>
      <img src={props.theme.arrow_left} alt={'<'} id={'arrow_left'} className={style[left_arrow_style]} onClick={() => { props.setPageNumber(props.pageNumber - 1); }}/>
      <p className={style.pagination_number}>{props.pageNumber}</p>
      <img src={props.theme.arrow_right} alt={'>'} id={'arrow_right'} className={style[right_arrow_style]} onClick={() => { props.setPageNumber(props.pageNumber + 1); }}/>
    </div>
  )
}

function Searchbar(props){
  return (
    <div className={style.searchbar_container1}>
      <StyledSearchbar>
        <SearchInput id='search_input' placeholder={languages[props.language].work_page.search_txt} onKeyUp={(e) => { if (e.key === 'Enter') { props.refreshPosts(undefined, document.getElementById('search_input').value) } }}></SearchInput>
        <img className={style.searchbar_refresh} src={props.theme.search_icon} alt={'s'} onClick={() => props.refreshPosts(undefined, document.getElementById('search_input').value) }></img>
        <img className={style.searchbar_refresh} src={props.theme.refresh_icon} alt={'r'} onClick={() => props.refreshPosts() }></img>
      </StyledSearchbar>
    </div>
  )
}

class UsersPage extends React.Component {
  constructor(props) {
    super(props);
    this.windowSizeChanged = this.windowSizeChanged.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.refreshPosts = this.refreshPosts.bind(this);
    this.setPageNumber = this.setPageNumber.bind(this);

    this.state = {
      showMessage: false,
      messageTitle: 'temp title',
      messageType: 'text',
      titleType: 'normal',
      preventAutoHiding: false,
      afterHidingCallback: () => {},
      pageNumber: 1,
      amountOfPages: 1,
      users: [],
      showLoadingCircle: true
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowSizeChanged);
    this.refreshPosts(1);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowSizeChanged);
  }

  refreshPosts(pageNumber, filter) {
    this.setState({
      showLoadingCircle: true
    })

    const number = pageNumber === undefined ? this.state.pageNumber : pageNumber;

    sendRequest('/getusers', 'POST', {data: JSON.stringify(['users_page', number, filter])})
    .then(response => {
      if (response.status === 'ok') {
        this.setState({
          users: response.users,
          amountOfPages: response.amountOfPages,
          showLoadingCircle: false
        })
        this.windowSizeChanged();
      }

      if (response.status === 'error') {
        this.setState({
          showLoadingCircle: false
        })
        this.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
        this.windowSizeChanged();
      }
    })
  }

  windowSizeChanged() {
    let cols;

    if (window.innerWidth >= 1940) {
      cols = 6;
    } else if (window.innerWidth >= 1620 && window.innerWidth < 1940) {
      cols = 5;
    } else if (window.innerWidth >= 1300 && window.innerWidth < 1620) {
      cols = 4;
    } else if (window.innerWidth >= 980 && window.innerWidth < 1300) {
      cols = 3;
    } else if (window.innerWidth >= 660 && window.innerWidth < 980) {
      cols = 2;
    } else if (window.innerWidth < 660) {
      cols = 1;
    }

    const usersAmount = this.state.users.length;

    if (usersAmount === 0) {
      this.setState({
        menuType: '1col'
      })
    } else if (usersAmount < cols) {
      this.setState({
        menuType: usersAmount + 'col'
      })
    } else {
      this.setState({
        menuType: cols + 'col'
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

  setPageNumber(number) {
    if (number >= 1 && number <= this.state.amountOfPages) {
      this.setState({
        pageNumber: number
      })
      this.refreshPosts(number);
    }
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

    let noPostsMsg;
    if (this.state.users.length === 0) {
      noPostsMsg = (
        <p>{languages[this.props.language].work_page.no_posts_found}</p>
      )
    }

    return (
      <div>
        <div id={'page'}>
          <Menu history={this.props.history} theme={this.props.theme} style={style} language={this.props.language} changeTheme={this.props.changeTheme} changeLanguage={this.props.changeLanguage} setMessage={this.setMessage}/>
          <div id='pageBody' className={style['pageBody']}>
            <Searchbar menuType={this.state.menuType} theme={this.props.theme} language={this.props.language} refreshPosts={this.refreshPosts}/>
            <Users menuType={this.state.menuType} users={this.state.users} history={this.props.history} theme={this.props.theme} language={this.props.language} refreshPosts={this.refreshPosts} setMessage={this.setMessage}/>
            {noPostsMsg}
            {loadingCircle}
            <Pagination pageNumber={this.state.pageNumber} amountOfPages={this.state.amountOfPages} setPageNumber={this.setPageNumber} theme={this.props.theme} language={this.props.language}/>
          </div>
          <Footer />
        </div>
        <MessagePopUp elementId={'page'} callback={this.state.afterHidingCallback} showMessage={this.state.showMessage} title={this.state.messageTitle} msgType={this.state.messageType} titleType={this.state.titleType} preventAutoHiding={this.state.preventAutoHiding} style={style} theme={this.props.theme} language={this.props.language} setMessage={this.setMessage}/>
      </div>
    );
  }
}

export default withTheme(UsersPage);