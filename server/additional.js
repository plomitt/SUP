function checkGrade(grade) {
  if (/(?=.*[^A-Za-z0-9])/.test(grade)) {
    return 'contains_spec_chars';
  } else if (/\d\d[A-G]/.test(grade) && !/\d(?=.{3,})/.test(grade)) {
    const found = parseInt(grade.match(/\d\d/));
    if (0 < found && found < 12) {
      return true;
    } else {
      return 'wrong_grade';
    }
  } else if (!/\d\d[A-G]/.test(grade) && /\d[A-G]/.test(grade) && !/\d(?=.{3,})/.test(grade)) {
    const found = parseInt(grade.match(/\d/));
    if (0 < found && found < 12) {
      return true;
    } else {
      return 'wrong_grade';
    }
  } else {
    return 'incorrect';
  }
}

function checkBio(bio) {
  if (!/(?=.{1,})/.test(bio)) {
    return 'too_short';
  }

  if (/(?=.{250,})/.test(bio)) {
    return 'too_long';
  }

  return true;
}

function checkName(name) {
  if (!/(?=.{1,})/.test(name)) {
    return 'too_short';
  }

  if (/(?=.{15,})/.test(name)) {
    return 'too_long';
  }

  if (/(?=.*[0-9])/.test(name)) {
    return 'contains_digits';
  }

  return true;
}

function checkRole(role) {
  if (role !== 'student' && role !== 'teacher') {
    return false;
  } else {
    return true;
  }
}

function checkEmail(email) {
  if (!/(?=.{4,})/.test(email)) {
    return 'too_short';
  }

  if (/(?=.{25,})/.test(email)) {
    return 'too_long';
  }

  if (/(?=.*[^A-Za-z0-9])/.test(email)) {
    return 'contains_spec_chars';
  }

  return true;
}

function checkPassword(password) {
  if (!/(?=.{8,})/.test(password)) {
    return 'too_short';
  }

  if (/(?=.{25,})/.test(password)) {
    return 'too_long';
  }

  if (!/(?=.*[^A-Za-z0-9])/.test(password)) {
    return 'no_spec_chars';
  }

  if (!/(?=.*[0-9])/.test(password)) {
    return 'no_digits';
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return 'no_uppercase';
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return 'no_lowercase';
  }

  return true;
}

function userHasEmptyFields(user) {
  const fields = ['pfp', 'name', 'surname', 'grade', 'bio', 'phone'];
  return fields.some(field => user[field] === undefined)
}

module.exports = {checkBio, checkEmail, checkGrade, checkName, checkPassword, checkRole, userHasEmptyFields}