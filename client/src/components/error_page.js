import React from 'react';
import styled from 'styled-components';
import style from '../styles/error_page.module.css';
import logo from '../sup_logo.png';
import { withTheme } from 'styled-components';
import languages from './languages';
require('dotenv').config();

const StyledA = styled.a`
  color: ${props => props.theme.textColor};
`

function ErrorPage(props) {
  document.title = languages[props.language].general.page_titles.error;

  return (
    <div className={style.container}>
      <img src={logo} alt='sup_logo' className={style.logo} onClick={() => { window.location.href = '/' }}></img>
      <p className={style.error}>{props.error}: {languages[props.language].error_page[props.error]}</p>
      <p className={style.text}>{languages[props.language].error_page.go_back.split(' ')[0]} <StyledA className={style.link} href='/' onClick={() => { window.history.back() }}>{languages[props.language].error_page.go_back.split(' ')[1]}</StyledA></p>
    </div>
  );
}

export default withTheme(ErrorPage);