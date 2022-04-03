import React from 'react';
import style from '../styles/work_page.module.css';
import { Button, Footer, getUserData, LoadingCircle, Menu, MessagePopUp, PFP, sendRequest, setUserData } from '../utils/additional';
import styled, { withTheme } from 'styled-components';
import languages from '../utils/languages';

const StyledPost = styled.div`
  border-color: ${props => props.theme.textColor};
`

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

const DisabledLi = styled.li`
  color: ${props => props.theme.greyedOutColor};

  &:hover:hover {
    cursor: not-allowed;
    color: ${props => props.theme.greyedOutColor};
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
  
  margin-bottom: 20px;

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

const SearchbarButtonContainer = styled.div`
  border-radius: 10px;
  border: solid 1px ${props => props.theme.borderColor};

  border-radius: 10px;
  border: 1px solid rgb(255, 255, 255);
  display: flex;
  justify-content: center;
  min-width: 299px;

  margin-top: -10px;
`

const SelectedSubject = styled.li`
  color: ${props => props.theme.accentColor};
  margin: 0px;

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.darkerAccentColor};
  }
`

const UnselectedSubject = styled.li`
  color: ${props => props.theme.textColor};
  margin: 0px;

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.darkerAccentColor};
  }
`


class PostDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.handleRespond = this.handleRespond.bind(this);
    this.confirmPostRespond = this.confirmPostRespond.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.confirmPostDelete = this.confirmPostDelete.bind(this);
    this.handleReport = this.handleReport.bind(this);
    this.confirmReport = this.confirmReport.bind(this);
  }

  confirmPostDelete() {
    const body = (
      <div className={style.dialog_btn_container}>
        <Button onClick={() => { this.props.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
        <DangerP className={style.dialog_confirm} onClick={() => { this.props.setMessage(false, false, false, false, false, () => {}); this.handleDelete(); }}>{languages[this.props.language].edit_post_page.delete_btn}</DangerP>
      </div>
    )
  
    this.props.setMessage(body, 'other', languages[this.props.language].edit_post_page.delete_title, 'normal', true);
  }

  handleDelete() {
    sendRequest('/handlepost', 'POST', {data: JSON.stringify(['delete', this.props.post.id])})
    .then(response => {
      if (response.status === 'ok') {
        this.props.refreshPosts();
        this.props.setMessage(languages[this.props.language].edit_post_page.response.delete.body, 'text', languages[this.props.language].edit_post_page.response.delete.title, 'success');
      } else {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }

  handleRespond() {
    sendRequest('/respond', 'POST', {data: JSON.stringify(['add', this.props.post.id])})
    .then(response => {

      if (response.status === 'ok') {
        
        let temp = getUserData('postsUserRespondedTo');
        temp.push({postId: this.props.post.id});
        setUserData('postsUserRespondedTo', temp);
        
        this.props.refreshPosts();
        this.props.setMessage(languages[this.props.language].view_post_page.responded_text, 'text', languages[this.props.language].user_preferences_page.success, 'success');
      }

      if (response.status === 'already_responded') {
        this.props.setMessage(languages[this.props.language].view_post_page.already_responded_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  } 

  confirmPostRespond() {
    const body = (
      <div className={style.dialog_btn_container}>
        <Button onClick={() => { this.props.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
        <SafeP className={style.dialog_confirm} onClick={() => { this.props.setMessage(false, false, false, false, false, () => {}); this.handleRespond(); }}>{languages[this.props.language].view_post_page.respond_btn}</SafeP>
      </div>
    )
  
    this.props.setMessage(body, 'other', languages[this.props.language].view_post_page.respond_title, 'normal', true);
  }

  handleReport() {
    this.setState({
      showLoadingCircle: true
    })

    
    sendRequest('/report', 'POST', {data: JSON.stringify(['add', 'post', this.props.post.id])})
    .then(response => {
      if (response.status === 'ok') {
        this.props.setMessage(languages[this.props.language].work_page.reported_text, 'text', languages[this.props.language].user_preferences_page.success, 'success');
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }

  confirmReport() {
    const body = (
      <div className={style.dialog_btn_container}>
        <Button onClick={() => { this.props.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
        <DangerP className={style.dialog_confirm} onClick={() => { this.props.setMessage(false, false, false, false, false, () => {}); this.handleReport(); }}>{languages[this.props.language].general.menu.report_btn}</DangerP>
      </div>
    )
  
    this.props.setMessage(body, 'other', languages[this.props.language].view_post_page.report_title, 'normal', true);
  }


  render() {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const postPath = '/editpost?id=' + this.props.post.id;
  
    let toShow = [];
    if (userId === this.props.post.userId) {
      if (this.props.post.status === 'completed') {
        toShow = [
          <DisabledLi><p>{languages[this.props.language].view_post_page.completed_btn}</p></DisabledLi>
        ];
      } else {
        toShow = [
          <li onClick={() => this.props.history.push(postPath)}><p>{languages[this.props.language].work_page.post.edit}</p></li>,
          <li onClick={() => this.confirmPostDelete()}><DangerP>{languages[this.props.language].work_page.post.delete}</DangerP></li>
        ];
      }
    } else {
      if (getUserData('postsUserRespondedTo').some(e => e.postId === this.props.post.id)) {
        toShow = [
          <DisabledLi><p>{languages[this.props.language].view_post_page.responded_btn}</p></DisabledLi>
        ];
      } else {
        toShow = [
          <li onClick={() => this.confirmPostRespond()}><p>{languages[this.props.language].view_post_page.respond_btn}</p></li>,
          <li onClick={() => this.confirmReport()}><DangerP>{languages[this.props.language].work_page.post.report}</DangerP></li>
        ];
      }

    }
  
    return (
      <StyledDropdown id={'dropdown' + this.props.eKey} className={style.post_dropdown_container} onMouseLeave={() => { setDropdown(this.props.eKey, 'none'); }}>
        <StyledDropdownList>
          {toShow}
        </StyledDropdownList>
      </StyledDropdown>
    )
  }
}

function setDropdown(eKey, state) {
  const dropdown = document.getElementById('dropdown' + eKey);

  if (state === 'none') {
    if (!dropdown.matches(':hover')) {
      dropdown.style.display = 'none';
    }
  } else {
    dropdown.style.display = state;
  }
}


function Post(props) {
  let subjects = props.post.subjects.map(subject => {
    return (
      languages[props.language].general.subjects[subject]
    )
  }).join(', ');
  subjects = subjects > 70 ? subjects.slice(0, 71) + '...' : subjects;


  const postPath = '/viewpost?id=' + props.post.id;

  return (
    <StyledPost className={style['post_box']}>
      <ul className={style['post_list']}>
        <li onClick={() => { props.history.push(postPath); }}>
          <div className={style['post_title_container']}>
            <p className={style['post_title']}>{props.post.title}</p>
          </div>
        </li>
        <li onClick={() => { props.history.push(postPath); }}>
          <div>
            <p className={style['post_subjects']}>{languages[props.language].work_page.post.subjects}{subjects}</p>
          </div>
        </li>
        <li onClick={() => { props.history.push(postPath); }}>
          <div>
            <p className={style['post_deadline']}>{languages[props.language].work_page.post.deadline}{props.post.deadline}</p>
          </div>
        </li>
        <li>
          <div className={style['post_name_container']}>
            <div className={style['post_name_container1']} onClick={() => { props.history.push('/user?id=' + props.post.userId); }}>
              <PFP theme={props.theme} type={'work_page_post_pfp'} pfp={props.post.userPfp} />
              <div>
                <p className={style['post_name']}>{props.post.userName + ' ' + props.post.userSurname}</p>
                <p className={style['post_grade']}>{props.post.userGrade}</p>
              </div>
            </div>
            <img src={props.theme.dots} alt={':'} id={'dots' + props.eKey} className={style['dots']} onClick={() => { setDropdown(props.eKey, 'block'); }} onMouseOver={() => { setDropdown(props.eKey, 'block'); }} onMouseLeave={() => { setDropdown(props.eKey, 'none'); }}/>
          </div>
        </li>
      </ul>
      <PostDropdown eKey={props.eKey} post={props.post} history={props.history} theme={props.theme} language={props.language} refreshPosts={props.refreshPosts} setMessage={props.setMessage} />
    </StyledPost>
  )
}

function Posts(props) {
  let postsList = [];
  const posts = props.posts;

  for (let i = 0; i < posts.length; i++) {
    postsList.push(
      <Post post={posts[i]} eKey={i} menuType={props.menuType} history={props.history} theme={props.theme} language={props.language} refreshPosts={props.refreshPosts} setMessage={props.setMessage}/>
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

class Searchbar extends React.Component {
  constructor(props) {
    super(props);
    this.addSubject = this.addSubject.bind(this);
    this.removeSubject = this.removeSubject.bind(this);

    this.state = {
      selected: []
    }
  }

  addSubject(subject) {
    let subjects = this.state.selected;
    subjects.push(subject);

    this.setState({
      selected: subjects
    })
  }

  removeSubject(subject) {
    let subjects = this.state.selected;
    subjects.splice(subjects.indexOf(subject), 1);

    this.setState({
      selected: subjects
    })
  }

  render () {
    let subjectFilter;
    const subjects = languages[this.props.language].general.subjects;
    const keys = Object.keys(subjects);
    let options = [];
    
    for (let key of keys) {
      if (this.state.selected.includes(key)) {
        options.push(<SelectedSubject onClick={() => { this.removeSubject(key); }}>{languages[this.props.language].general.subjects[key]}</SelectedSubject>)
      } else {
        options.push(<UnselectedSubject onClick={() => { this.addSubject(key); }}>{languages[this.props.language].general.subjects[key]}</UnselectedSubject>)
      }
    }

    let dropdownStyle = window.innerWidth >= 600 ? 'search_dropdown_container' : 'search_dropdown_container_1col';

    const dropdown = (
      <StyledDropdown id='dropdown_search' className={style[dropdownStyle]} onMouseLeave={() => { setDropdown('_search', 'none'); }}>
        <StyledDropdownList>
          {options}
        </StyledDropdownList>
      </StyledDropdown>
    )
    
    if (window.innerWidth >= 660) {
      subjectFilter = (
        <div>
          <p className={style.search_dropdown_button} onMouseOver={() => { setDropdown('_search', 'block'); }} onMouseLeave={() => { setDropdown('_search', 'none'); }} onClick={() => { setDropdown('_search', 'block'); }}>{languages[this.props.language].edit_post_page.subjects}</p>
          {dropdown}
        </div>
      )

      return (
        <StyledSearchbar className={style.searchbar_container}>
          {subjectFilter}
          <SearchInput id='search_input' placeholder={languages[this.props.language].work_page.search_txt} onKeyUp={(e) => { if (e.key === 'Enter') { this.props.refreshPosts(undefined, document.getElementById('search_input').value, this.state.selected) } }}></SearchInput>
          <img className={style.searchbar_refresh} src={this.props.theme.search_icon} alt={'s'} onClick={() => this.props.refreshPosts(undefined, document.getElementById('search_input').value, this.state.selected) }></img>
          <img className={style.searchbar_refresh} src={this.props.theme.refresh_icon} alt={'r'} onClick={() => this.props.refreshPosts() }></img>
        </StyledSearchbar>
      )
    } else {
      subjectFilter = (
        <SearchbarButtonContainer>
          <p className={style.search_dropdown_button_1col} onMouseOver={() => { setDropdown('_search', 'block'); }} onMouseLeave={() => { setDropdown('_search', 'none'); }} onClick={() => { setDropdown('_search', 'block'); }}>{languages[this.props.language].edit_post_page.subjects}</p>
          {dropdown}
        </SearchbarButtonContainer>
      )

      return (
        <div className={style.searchbar_container1}>
          <StyledSearchbar className={style.searchbar_container}>
            <SearchInput id='search_input' placeholder={languages[this.props.language].work_page.search_txt} onKeyUp={(e) => { if (e.key === 'Enter') { this.props.refreshPosts(undefined, document.getElementById('search_input').value, this.state.selected) } }}></SearchInput>
            <img className={style.searchbar_refresh} src={this.props.theme.search_icon} alt={'s'} onClick={() => this.props.refreshPosts(undefined, document.getElementById('search_input').value, this.state.selected) }></img>
            <img className={style.searchbar_refresh} src={this.props.theme.refresh_icon} alt={'r'} onClick={() => this.props.refreshPosts() }></img>
          </StyledSearchbar>
          {subjectFilter}
        </div>
      )
    }
  }
}

class WorkPage extends React.Component {
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
      posts: [],
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

  refreshPosts(pageNumber, filter, subjects) {
    this.setState({
      showLoadingCircle: true
    })

    const number = pageNumber === undefined ? this.state.pageNumber : pageNumber;

    sendRequest('/getposts', 'POST', {data: JSON.stringify(['workpage_list', number, filter, subjects])})
    .then(response => {

      if (response.status === 'ok') {
        this.setState({
          posts: response.posts,
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

    const postsAmount = this.state.posts.length;

    if (postsAmount === 0) {
      this.setState({
        menuType: '1col'
      })
    } else if (postsAmount < cols) {
      this.setState({
        menuType: postsAmount + 'col'
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
    if (this.state.posts.length === 0) {
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
            <Posts menuType={this.state.menuType} posts={this.state.posts} history={this.props.history} theme={this.props.theme} language={this.props.language} refreshPosts={this.refreshPosts} setMessage={this.setMessage}/>
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

export default withTheme(WorkPage);