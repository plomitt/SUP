import React from 'react';
import styled, { withTheme } from 'styled-components';
import style from '../styles/moderation_page.module.css';
import { MessagePopUp, SelectContainer, StyledSelect, ArrowDown, Footer, Menu, getUrlParam, Button, sendRequest, PFP, stringifyUserEmail, stringifyUserGrade, shortenString } from '../utils/additional';
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

const StyledLabel = styled.label`
  color: ${props => props.theme.textColor};
  font-size: 20pt;

  &:hover {
    cursor: text;
  }
`

const StyledSidebar = styled.div`
  padding: 10px;
  background-color: ${props => props.theme.primaryColor};
  border-radius: 10px;
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

const Red = styled.p`
  color: ${props => props.theme.dangerColor};
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

const Blue = styled.p`
  color: ${props => props.theme.accentColor};
`


class Verification extends React.Component {
  constructor(props) {
    super(props);

    this.handleBan = this.handleBan.bind(this);
    this.confirmBan = this.confirmBan.bind(this);
    this.handleVerification = this.handleVerification.bind(this);
    this.confirmVerification = this.confirmVerification.bind(this);
  }

  handleVerification(userId) {
    sendRequest('/verifyuser', 'POST', {data: JSON.stringify([userId])})
    .then(response => {
      if (response.status === 'ok') {
        this.props.setMessage(languages[this.props.language].moderation_page.verify.verify_popup.successTitle, 'text', languages[this.props.language].user_preferences_page.success, 'success');
        this.props.fetchUsersAndReports();
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }
  
  confirmVerification(userId) {
    const body = (
      <div className={style.dialog_btn_container}>
        <Button onClick={() => { this.props.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
        <DangerP className={style.dialog_confirm} onClick={() => { this.props.setMessage(false, false, false, false, false, () => {}); this.handleVerification(userId); }}>{languages[this.props.language].moderation_page.verify.verify_popup.btn}</DangerP>
      </div>
    )
    
    this.props.setMessage(body, 'other', languages[this.props.language].moderation_page.verify.verify_popup.title, 'normal', true);
  }

  handleBan(userId, duration) {
    sendRequest('/banuser', 'POST', {data: JSON.stringify([userId, duration])})
    .then(response => {
      if (response.status === 'ok') {
        this.props.setMessage(languages[this.props.language].moderation_page.verify.ban_popup.successTitle, 'text', languages[this.props.language].user_preferences_page.success, 'success');
        this.props.fetchUsersAndReports();
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
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
          <Button onClick={() => { this.props.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
          <DangerP className={style.dialog_confirm} onClick={() => { this.props.setMessage(false, false, false, false, false, () => {}); this.handleBan(userId, document.getElementById('ban_duration').value); }}>{languages[this.props.language].moderation_page.verify.ban_popup.btn}</DangerP>
        </div>
      </div>
    )
  
    this.props.setMessage(body, 'other', languages[this.props.language].moderation_page.verify.ban_popup.title, 'normal', true);
  }

  render() {
    let toShow;
    if (this.props.users.length === 0) {
      toShow = (
        <p>{languages[this.props.language].moderation_page.verify.no_elements}</p>
      )
    } else {
      const users = this.props.users;
      let newResponses = [];
  
      for (let i = 0; i < users.length; i++) {
        const dropdown = [
          <li onClick={() => this.confirmVerification(users[i].id)}><Blue>{languages[this.props.language].moderation_page.verify.verify_popup.btn}</Blue></li>,
          <li onClick={() => this.confirmBan(users[i].id)}><Red>{languages[this.props.language].moderation_page.verify.ban_popup.btn}</Red></li>
        ]

        const dropdownId = 'vrfdrpdwn' + i;
  
        const dropdownContainer = (
          <StyledDropdown id={dropdownId} className={style.post_dropdown_container} onMouseLeave={() => { this.props.setDropdown(dropdownId, 'none'); }}>
            <StyledDropdownList>
              {dropdown}
            </StyledDropdownList>
          </StyledDropdown>
        );

        let userField;
        let email = stringifyUserEmail(users[i].role, users[i].email);
        if (this.props.menuType === 'mobile') {
          email = shortenString(email, 10);

          const name = shortenString(users[i].name, 10);

          userField = (
            <p className={style['user_name_mobile']}>{name}</p>
          )
        } else {
          userField = (
            <div className={style['post_name_container1']}>
              <PFP theme={this.props.theme} type={'work_page_post_pfp'} pfp={users[i].pfp} />
              <div>
                <p className={style['user_name']}>{users[i].name + ' ' + users[i].surname}</p>
                <p className={style['user_name']}>{stringifyUserGrade(users[i].role, users[i].grade, this.props.language)}</p>
              </div>
            </div>
          )
        }

  
        newResponses.push(
          <li className={style.responses_list_li}>
            <div className={style['post_name_container']}>
              <div className={style['post_name_container2']} onClick={() => { this.props.history.push('/user?id=' + users[i].id); }}>
                {userField}
                <p className={style['user_email']}>{email}</p>
              </div>
              <img src={this.props.theme.dots} alt={':'} id={'vrfdots' + i} className={style['dots']} onClick={() => { this.props.setDropdown(dropdownId, 'block'); }} onMouseOver={() => { this.props.setDropdown(dropdownId, 'block'); }} onMouseLeave={() => { this.props.setDropdown(dropdownId, 'none'); }}/>
            </div>
            {dropdownContainer}
          </li>
        )
      }
  
      toShow = newResponses;
    }
  
    const refreshBtn = (
      <div className={style.refresh} onClick={() => { this.props.fetchUsersAndReports(); }}>
        <img src={this.props.theme.refresh_icon} alt={'r'}></img>
        <p>{languages[this.props.language].general.menu.refresh_btn}</p>
      </div>
    )
  
    return (
      <div className={style.responses_container}>
        <div className={style.responses_title}>
          <StyledLabel>{languages[this.props.language].moderation_page.verify.title}</StyledLabel>
          {refreshBtn}
        </div>
        <ul className={style.responses_list}>
          {toShow}
        </ul>
      </div>
    )
  }
}

class Reports extends React.Component {
  constructor(props) {
    super(props);

    this.handleBan = this.handleBan.bind(this);
    this.confirmBan = this.confirmBan.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.confirmDismiss = this.confirmDismiss.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleDeleteAndBan = this.handleDeleteAndBan.bind(this);
    this.confirmDeleteAndBan = this.confirmDeleteAndBan.bind(this);
  }

  handleBan(reportId, userId, duration) {
    sendRequest('/banuser', 'POST', {data: JSON.stringify([userId, duration])})
    .then(response => {
      if (response.status === 'ok') {
        sendRequest('/report', 'POST', {data: JSON.stringify(['dismiss', reportId])})
        .then(response1 => {
          if (response1.status === 'ok') {
            this.props.setMessage(languages[this.props.language].moderation_page.verify.ban_popup.successTitle, 'text', languages[this.props.language].user_preferences_page.success, 'success');
            this.props.fetchUsersAndReports();
          }

          if (response1.status === 'error') {
            this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
          }
        })
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }

  confirmBan(reportId, userId) {
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
          <Button onClick={() => { this.props.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
          <DangerP className={style.dialog_confirm} onClick={() => { this.props.setMessage(false, false, false, false, false, () => {}); this.handleBan(reportId, userId, document.getElementById('ban_duration').value); }}>{languages[this.props.language].moderation_page.verify.ban_popup.btn}</DangerP>
        </div>
      </div>
    )
  
    this.props.setMessage(body, 'other', languages[this.props.language].moderation_page.verify.ban_popup.title, 'normal', true);
  }

  handleDismiss(reportId) {
    sendRequest('/report', 'POST', {data: JSON.stringify(['dismiss', reportId])})
    .then(response => {
      if (response.status === 'ok') {
        this.props.setMessage(languages[this.props.language].moderation_page.reports.dismiss_popup.successTitle, 'text', languages[this.props.language].user_preferences_page.success, 'success');
        this.props.fetchUsersAndReports();
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }
  
  confirmDismiss(reportId) {
    const body = (
      <div className={style.dialog_btn_container}>
        <Button onClick={() => { this.props.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
        <SafeP className={style.dialog_confirm} onClick={() => { this.props.setMessage(false, false, false, false, false, () => {}); this.handleDismiss(reportId); }}>{languages[this.props.language].moderation_page.reports.dismiss_popup.btn}</SafeP>
      </div>
    )
    
    this.props.setMessage(body, 'other', languages[this.props.language].moderation_page.reports.dismiss_popup.title, 'normal', true);
  }

  handleDelete(reportId, postId) {
    sendRequest('/deletepost', 'POST', {data: JSON.stringify([postId])})
    .then(response => {
      if (response.status === 'ok') {
        sendRequest('/report', 'POST', {data: JSON.stringify(['dismiss', reportId])})
        .then(response1 => {
          if (response1.status === 'ok') {
            this.props.setMessage(languages[this.props.language].moderation_page.reports.delete_popup.successTitle, 'text', languages[this.props.language].user_preferences_page.success, 'success');
            this.props.fetchUsersAndReports();
          }

          if (response1.status === 'error') {
            this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
          }
        })
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }
  
  confirmDelete(reportId, postId) {
    const body = (
      <div className={style.dialog_btn_container}>
        <Button onClick={() => { this.props.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
        <DangerP className={style.dialog_confirm} onClick={() => { this.props.setMessage(false, false, false, false, false, () => {}); this.handleDelete(reportId, postId); }}>{languages[this.props.language].moderation_page.reports.delete_popup.btn}</DangerP>
      </div>
    )
    
    this.props.setMessage(body, 'other', languages[this.props.language].moderation_page.reports.delete_popup.title, 'normal', true);
  }

  handleDeleteAndBan(reportId, postId, userId, duration) {
    sendRequest('/deletepost', 'POST', {data: JSON.stringify([postId])})
    .then(response => {
      if (response.status === 'ok') {
        sendRequest('/banuser', 'POST', {data: JSON.stringify([userId, duration])})
        .then(response1 => {
          if (response1.status === 'ok') {
            sendRequest('/report', 'POST', {data: JSON.stringify(['dismiss', reportId])})
            .then(response2 => {
              if (response2.status === 'ok') {
                this.props.setMessage(languages[this.props.language].moderation_page.reports.delete_ban_popup.successTitle, 'text', languages[this.props.language].user_preferences_page.success, 'success');
                this.props.fetchUsersAndReports();
              }
    
              if (response2.status === 'error') {
                this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
              }
            })
          }
    
          if (response1.status === 'error') {
            this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
          }
        })
      }

      if (response.status === 'error') {
        this.props.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }

  confirmDeleteAndBan(reportId, postId, userId) {
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
          <Button onClick={() => { this.props.setMessage(false, false, false, false, false); }}>{languages[this.props.language].general.menu.cancel_btn}</Button>
          <DangerP className={style.dialog_confirm} onClick={() => { this.props.setMessage(false, false, false, false, false, () => {}); this.handleDeleteAndBan(reportId, postId, userId, document.getElementById('ban_duration').value); }}>{languages[this.props.language].moderation_page.reports.delete_ban_popup.btn}</DangerP>
        </div>
      </div>
    )
  
    this.props.setMessage(body, 'other', languages[this.props.language].moderation_page.reports.delete_ban_popup.title, 'normal', true);
  }

  render() {
    let toShow;
    if (this.props.reports.length === 0) {
      toShow = (
        <p>{languages[this.props.language].moderation_page.reports.no_elements}</p>
      )
    } else {
      const reports = this.props.reports;
      let newResponses = [];
  
      for (let i = 0; i < reports.length; i++) {
        const report = reports[i];
        let dropdown;
        if (report.type === 'post') {
          dropdown = [
            <li onClick={() => this.confirmDismiss(report.id)}><Blue>{languages[this.props.language].moderation_page.reports.dismiss_popup.btn}</Blue></li>,
            <li onClick={() => this.confirmDelete(report.id, report.post.id)}><Red>{languages[this.props.language].moderation_page.reports.delete_popup.btn}</Red></li>,
            <li onClick={() => this.confirmDeleteAndBan(report.id, report.post.id, report.post.userId)}><Red>{languages[this.props.language].moderation_page.reports.delete_ban_popup.btn}</Red></li>
          ]
        } else {
          dropdown = [
            <li onClick={() => this.confirmDismiss(report.id)}><Blue>{languages[this.props.language].moderation_page.reports.dismiss_popup.btn}</Blue></li>,
            <li onClick={() => this.confirmBan(report.id, report.user.id)}><Red>{languages[this.props.language].moderation_page.verify.ban_popup.btn}</Red></li>
          ]
        }

        const dropdownId = 'rptdrpdwn' + i;
        const dropdownContainer = (
          <StyledDropdown id={dropdownId} className={style.post_dropdown_container} onMouseLeave={() => { this.props.setDropdown(dropdownId, 'none'); }}>
            <StyledDropdownList>
              {dropdown}
            </StyledDropdownList>
          </StyledDropdown>
        );

        let row;
        if (report.type === 'post') {
          const reportOwner = report.reportOwner;
          const post = report.post;

          let userField;
          let title = post.title; 
          if (this.props.menuType === 'mobile') {
            title = shortenString(title, 10);

            userField = (
              <p className={style['user_name_mobile_report']}>{reportOwner.name}</p>
            )
          } else {
            userField = (
              <div className={style['post_name_container1_reports']} onClick={() => { this.props.history.push('/user?id=' + reportOwner.id); }}>
                <PFP theme={this.props.theme} type={'work_page_post_pfp'} pfp={reportOwner.pfp} />
                <div>
                  <p className={style['user_name']}>{reportOwner.name + ' ' + reportOwner.surname}</p>
                  <p className={style['user_name']}>{stringifyUserGrade(reportOwner.role, reportOwner.grade, this.props.language)}</p>
                </div>
              </div>
            )
          }

          row = (
            <li className={style.responses_list_li}>
              <div className={style['post_name_container']}>
                <div className={style['post_name_container2']}>
                  {userField}
                  <p className={style['report_post_title']} onClick={() => { this.props.history.push('/viewpost?id=' + post.id); }}>{title}</p>
                </div>
                <img src={this.props.theme.dots} alt={':'} id={'rptdots' + i} className={style['dots']} onClick={() => { this.props.setDropdown(dropdownId, 'block'); }} onMouseOver={() => { this.props.setDropdown(dropdownId, 'block'); }} onMouseLeave={() => { this.props.setDropdown(dropdownId, 'none'); }}/>
              </div>
              {dropdownContainer}
            </li>
          )
        } else {
          const reportOwner = report.reportOwner;
          const reportTarget = report.user;

          let reportOwnerField;
          let reportTargetField;
          if (this.props.menuType === 'mobile') {
            const roName = shortenString(reportOwner.name, 10);
            reportOwnerField = (
              <p className={style['user_name_mobile_report']}>{roName}</p>
            )

            const rtName = shortenString(reportTarget.name, 10)
            reportTargetField = (
              <p className={style['user_name_mobile_report']}>{rtName}</p>
            )
          } else {
            reportOwnerField = (
              <div className={style['post_name_container1_reports']} onClick={() => { this.props.history.push('/user?id=' + reportOwner.id); }}>
                <PFP theme={this.props.theme} type={'work_page_post_pfp'} pfp={reportOwner.pfp} />
                <div>
                  <p className={style['user_name']}>{reportOwner.name + ' ' + reportOwner.surname}</p>
                  <p className={style['user_name']}>{stringifyUserGrade(reportOwner.role, reportOwner.grade, this.props.language)}</p>
                </div>
              </div>
            )

            reportTargetField = (
              <div className={style['post_name_container1_reports']} onClick={() => { this.props.history.push('/user?id=' + reportTarget.id); }}>
                <PFP theme={this.props.theme} type={'work_page_post_pfp'} pfp={reportTarget.pfp} />
                <div>
                  <p className={style['user_name']}>{reportTarget.name + ' ' + reportTarget.surname}</p>
                  <p className={style['user_name']}>{stringifyUserGrade(reportTarget.role, reportTarget.grade, this.props.language)}</p>
                </div>
              </div>
            )
          }

          row = (
            <li className={style.responses_list_li}>
              <div className={style['post_name_container']}>
                <div className={style['post_name_container2']}>
                  {reportOwnerField}
                  {reportTargetField}
                </div>
                <img src={this.props.theme.dots} alt={':'} id={'rptdots' + i} className={style['dots']} onClick={() => { this.props.setDropdown(dropdownId, 'block'); }} onMouseOver={() => { this.props.setDropdown(dropdownId, 'block'); }} onMouseLeave={() => { this.props.setDropdown(dropdownId, 'none'); }}/>
              </div>
              {dropdownContainer}
            </li>
          )
        }
  
        newResponses.push(row);
      }
  
      toShow = newResponses;
    }
  
    const refreshBtn = (
      <div className={style.refresh} onClick={() => { this.props.fetchUsersAndReports(); }}>
        <img src={this.props.theme.refresh_icon} alt={'r'}></img>
        <p>{languages[this.props.language].general.menu.refresh_btn}</p>
      </div>
    )
  
    return (
      <div className={style.responses_container}>
        <div className={style.responses_title}>
          <StyledLabel>{languages[this.props.language].moderation_page.reports.title}</StyledLabel>
          {refreshBtn}
        </div>
        <ul className={style.reports_list}>
          {toShow}
        </ul>
      </div>
    )
  }
}

function Sidebar(props) {
  if (props.tab === 'reports') {
    return (
      <StyledSidebar className={style['sidebar' + props.menuType]}>
        <StyledP onClick={() => props.setTab('verify')} className={style['profile_btn' + props.menuType]}>{languages[props.language].moderation_page.sidebar.verify}</StyledP>
        <SelectedP onClick={() => props.setTab('reports')} className={style['settings_btn' + props.menuType]}>{languages[props.language].moderation_page.sidebar.reports}</SelectedP>
      </StyledSidebar>
    )
  } else {
    return (
      <StyledSidebar className={style['sidebar' + props.menuType]}>
        <SelectedP onClick={() => props.setTab('verify')} className={style['profile_btn' + props.menuType]}>{languages[props.language].moderation_page.sidebar.verify}</SelectedP>
        <StyledP onClick={() => props.setTab('reports')} className={style['settings_btn' + props.menuType]}>{languages[props.language].moderation_page.sidebar.reports}</StyledP>
      </StyledSidebar>
    )
  }
}

class ModerationPage extends React.Component {
  constructor(props) {
    super(props);
    this.setTab = this.setTab.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.windowSizeChanged = this.windowSizeChanged.bind(this);
    this.fetchUsersAndReports = this.fetchUsersAndReports.bind(this);

    this.state = {
      tab: 'verify',
      showMessage: false,
      messageTitle: 'temp title',
      messageType: 'text',
      titleType: 'normal',
      preventAutoHiding: false,
      menuType: 'desktop',
      users: [],
      reports: []
    }
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.windowSizeChanged);
    this.windowSizeChanged();
    
    const tab = getUrlParam('tab');
    this.setTab(tab);

    this.fetchUsersAndReports();

    const unlisten = this.props.history.listen(({action, location}) => {
      localStorage.setItem('authorized', 'false');
      unlisten();
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowSizeChanged);
  }

  windowSizeChanged() {
    if (window.innerWidth >= 670) {
      this.setState({
        menuType: 'desktop'
      })
    } else if (window.innerWidth > 420 && window.innerWidth < 670) {
      this.setState({
        menuType: 'tablet'
      })
    } else {
      this.setState({
        menuType: 'mobile'
      })
    }
  }

  setDropdown(eKey, state) {
    const dropdown = document.getElementById(eKey);
  
    if (state === 'none') {
      if (!dropdown.matches(':hover')) {
        dropdown.style.display = 'none';
      }
    } else {
      dropdown.style.display = state;
    }
  }

  setTab(tab) {
    if (tab === 'verify' || tab === 'reports') {
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

  fetchUsersAndReports() {
    this.setState({
      showLoadingCircle: true
    })

    sendRequest('/getusersandreports', 'GET')
    .then(response => {
      if (response.status === 'ok') {
        this.setState({
          users: response.users,
          reports: response.reports,
          showLoadingCircle: false
        })
      }

      if (response.status === 'error') {
        this.setMessage(languages[this.props.language].general.server_error_text, 'text', languages[this.props.language].user_preferences_page.failure, 'failure');
      }
    })
  }
  
  render() {
    let tab;

    if (this.state.tab === 'verify') {
      tab = (<Verification users={this.state.users} fetchUsersAndReports={this.fetchUsersAndReports} menuType={this.state.menuType} language={this.props.language} theme={this.props.theme} history={this.props.history} setMessage={this.setMessage} setDropdown={this.setDropdown}/>)
    }

    if (this.state.tab === 'reports') {
      tab = (<Reports reports={this.state.reports} fetchUsersAndReports={this.fetchUsersAndReports} menuType={this.state.menuType} language={this.props.language} theme={this.props.theme} history={this.props.history} setMessage={this.setMessage} setDropdown={this.setDropdown}/>)
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

export default withTheme(ModerationPage);