import React from 'react';
import { withTheme } from 'styled-components';
import style from '../styles/landing_page.module.css';
import { Button, Menu, Footer, MessagePopUp } from '../utils/additional';
import languages from '../utils/languages';

function Rows(props) {
  const rows_content = languages[props.language].landing_page.rows;
  const row_names = Object.keys(rows_content);

  let rowsToShow = [];

  for (let i = 0; i < row_names.length; i++) {
    const row_name = row_names[i];
    rowsToShow.push(<Row windowSize={props.windowSize} history={props.history} key={row_name} rowNumber={i} title={rows_content[row_name].title} text={rows_content[row_name].text} image={rows_content[row_name].image} language={props.language} />);
    rowsToShow.push(<span key={'sp' + i} className={style.horisontal_spacer}></span>);
  }

  return (
    <div className={style.rows_container}>
      {rowsToShow}
    </div>
  );
}

function Row(props) {
  let toShow;

  if (props.rowNumber % 2 === 0 || props.windowSize === 'mobile') {
    toShow = (
      <div className={style.row}>
        <Text position='row_text_left' history={props.history} rowNumber={props.rowNumber} title={props.title} text={props.text} language={props.language} />
        <Image image={props.image} />
      </div>
    )
  } else {
    toShow = (
      <div className={style.row}>
        <Image image={props.image} />
        <Text position='row_text_right' history={props.history} rowNumber={props.rowNumber} title={props.title} text={props.text} language={props.language}/>
      </div>
    )
  }

  return (
    <div className={style.row}>
      {toShow}
    </div>
  );
}

function Text(props) {
  let toShow;

  if (props.rowNumber === 0) {
    toShow = (
      <div className={style[props.position]}>
        <h1 className={style.title}>{props.title}</h1>
        <p className={style.text}>{props.text}</p>
        <div className={style.buttons_container}>
          <div>
            <Button className={style.signin_btn} onClick={() => { props.history.push('/signin') }}>{languages[props.language].general.menu.signin_btn}</Button>
            <Button onClick={() => { props.history.push('/signup') }}>{languages[props.language].general.create_account}</Button>
          </div>
        </div>
      </div>
    )
  } else {
    toShow = (
      <div className={style[props.position]}>
        <h1 className={style.title}>{props.title}</h1>
        <p className={style.text}>{props.text}</p>
      </div>
    )
  }
  return toShow;
}

function Image(props) {
  return (
    <img src={props.image} alt='sup_logo' className={style.image}></img>
  );
}

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.setMessage = this.setMessage.bind(this);
    this.windowSizeChanged = this.windowSizeChanged.bind(this);

    this.state = {
      showMessage: false,
      messageTitle: 'temp title',
      messageType: 'text',
      titleType: 'normal',
      preventAutoHiding: false,
      windowSize: 'desktop'
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
    if (window.innerWidth > 830) {
      this.setState({
        windowSize: 'desktop'
      })
    } else {
      this.setState({
        windowSize: 'mobile'
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
    return (
      <div>
        <div id='page'>
          <Menu setMessage={this.setMessage} history={this.props.history} theme={this.props.theme} style={style} language={this.props.language} changeTheme={this.props.changeTheme} changeLanguage={this.props.changeLanguage} />
          <div id='pageBody'>
            <Rows windowSize={this.state.windowSize} history={this.props.history} language={this.props.language}/>
          </div>
          <Footer />
        </div>
        <MessagePopUp elementId={'page'} showMessage={this.state.showMessage} title={this.state.messageTitle} msgType={this.state.messageType} titleType={this.state.titleType} preventAutoHiding={this.state.preventAutoHiding} style={style} theme={this.props.theme} language={this.props.language} setMessage={this.setMessage}/>
      </div>
    )
  }
}

export default withTheme(LandingPage);