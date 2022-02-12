import placeholder from '../media/placeholder_orange.png';


// const placeholderRows = {
//   row0: {
//     title: 'Neque porro quisquam est qui dolorem',
//     text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sollicitudin massa in ante vehicula, eget fringilla nibh pretium. Nunc quis porttitor metus, in convallis lorem. Donec gravida tortor quis ante fringilla vestibulum.',
//     image: placeholder
//   },
//   row1: {
//     title: 'Praesent eget ullamcorper lacus',
//     text: 'Sed gravida molestie vehicula. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris molestie, mi id interdum sagittis, dolor diam consequat sem',
//     image: placeholder
//   },
//   row2: {
//     title: 'Cras semper varius tortor mattis dapibus',
//     text: 'Donec sed facilisis ligula. Sed vulputate nisl sed dignissim auctor. Quisque eu mattis tortor. Integer ac nisi lectus. Nunc faucibus, arcu id malesuada elementum, risus mauris scelerisque turpis.',
//     image: placeholder
//   }
// }

const languages = {
  en: {
    general: {
      languageSelect: {
        en: 'English',
        ru: 'Russian'
      },
      themeSelect: {
        'light': 'Light',
        'dark': 'Dark',
        'black': 'Black'
      },
      page_titles: {
        error: 'SUP | Error',
        auth: 'SUP | Authorization',
        signin: 'SUP | Signin',
        signup: 'SUP | Signup',
        userprefpage: 'SUP | Preferences',
        landing: 'SUP',
        work: 'SUP | Work',
      },
      menu: {
        signin_btn: 'Sign in',
        landing_text: 'Home',
        signout_btn: 'Sign out',
        link_user_pref_page: 'Preferences',
        work: 'Find work',
        talent: 'Find talent',
        myjobs: 'My Jobs'
      },
      create_account: 'Create account',
      server_error_text: 'Something went wrong, please try again later',
      file_error: {
        file_too_large: 'Selected file is too large',
        wrong_type: 'Selected file is not an image'
      },
      phone_error: {
        incorrect: 'Inputted data does not fit the format \'1234567890\''
      },
      grade_error: {
        incorrect: 'Inputted data does not fit the format \'11A\'',
        wrong_grade: 'Grade number should be between 1 and 11',
        contains_spec_chars: 'Grade should not contain special characters. Grade letter should be a capital letter from the latin alphabet'
      },
      bio_error: {
        too_short: 'Bio should be at least 1 character long',
        too_long: 'Bio should be less than 250 characters',
      },
      name_error: {
        too_short: ' should be at least 1 character long',
        too_long: ' should be less than 15 characters',
        contains_spec_chars: ' should not contain special characters',
        contains_digits: ' should not contain numbers'
      },
      email_error: {
        too_short: 'Email should be at least 4 characters long',
        too_long: 'Email should be less than 25 characters',
        contains_spec_chars: 'Email should not contain special characters',
        cant_be_same_email: 'New email should be different from the old one',
        emails_should_be_same: 'Emails do not match',
        email_taken: 'This email is taken, try another one'
      },
      password_error: {
        too_short: 'Password should be at least 8 characters long',
        too_long: 'Password should be less than 25 characters',
        no_spec_chars: 'Password should contain at least one special character',
        no_digits: 'Password should contain at least one digit',
        no_uppercase: 'Password should contain at least one uppercase letter',
        no_lowercase: 'Password should contain at least one lowercase letter',
        password_cant_be_same: 'New password should be different from the old one',
      },
      subjects: {
        maths: 'Maths',
        physics: 'Physics',
        informatics: 'Informatics',
        russian: 'Russian language',
        english: 'English language'
      }
    },
    signin_page: {
      signin_text: 'Sign in',
      auth_text: 'Enter your password',
      filloutfield_text: 'Please fill out this field',
      wrong_combination_text: 'Wrong combination, please try again',
      server_error_text: 'Something went wrong, please try again later',
      create_account_text: 'Create account',
      next_btn: 'Next'
    },
    signup_page: {
      signup_text: 'Create account',
      signin_text: 'Sign in',
      next_btn: 'Next',
      server_error_text: 'Something went wrong, please try again later'
    },
    authorization_page: {
      wrong_password: 'Wrong password',
      server_error_text: 'Something went wrong, please try again later'
    },
    landing_page: {
      signin_btn: 'Sign in',
      landing_text: 'Home',
      rows: {
        row0: {
          title: 'Welcome to SUP',
          text: 'SUP is an online tutoring service for students of the Skolkovo Gymnasium.',
          image: placeholder
        },
        row1: {
          title: 'By students - for students',
          text: 'Here, student experts in certain subjects help and advise in that subject without intermediaries.\n\nIn SUP you can find people willing to help you:\n- In scientific and research activities\n- In project activities\n- With the implementation of ideas in the framework of social initiatives',
          image: placeholder
        },
        row2: {
          title: 'For free',
          text: 'All assistance is carried out exclusively on a volunteer basis and does not involve payment.',
          image: placeholder
        },
        row3: {
          title: 'Upgrade',
          text: 'The tutor project in the Gymnasium is not a novelty, but previously the selection of tutors was carried out manually. Over time, we have grown significantly and are ready to go to a new level:\n\nWe are moving to an online platform.',
          image: placeholder
        },
        row4: {
          title: 'We are glad to work with you!',
          text: 'We are very proud of our tutoring staff and we promise that you will definitely not regret getting to know us.',
          image: placeholder
        }
      }
    },
    error_page: {
      '404': 'Page not found',
      '500': 'Internal server error',
      'go_back': 'Go Back'
    },
    user_preferences_page: {
      verifification: {
        title: 'Account is: ',
        verified: 'Verified',
        not_verified: 'Not verified',
        btn: 'Send verifification email'
      },
      email: {
        title: 'Email: ',
        change_btn: 'Change email',
        enter_email: 'Enter new email',
        confirm_email: 'Confirm email',
        confirm_password: 'Enter current password',
        changed_success: 'Confirmation email was sent to your new inbox',
        placeholder: 'Email'
      },
      password: {
        title: 'Password',
        confirm_new_password: 'Confirm new password',
        enter_current_password: 'Enter current password',
        enter_new_password: 'Enter new password',
        change_btn: 'Change password',
        placeholder: 'Password',
        changed_success: 'Password updated successfully'
      },
      phone: {
        title: 'Phone number: ',
        phone: 'Phone number',
        placeholder: 'Format: 1234567890',
        change_btn: 'Change phone number',
        changed_success: 'Phone number was updated successfully'
      },
      pfp: {
        title: 'Profile picture',
        upload: 'Upload profile picture',
        choose_file: 'Choose file',
        file_name: 'File: ',
        change_btn: 'Change profile picture',
        no_file_chosen: 'No file chosen',
        changed_success: 'Profile picutre was updated successfully'
      },
      name: {
        title: 'Name: ',
        change_btn: 'Change name',
        name: 'Name',
        surname: 'Surname',
        changed_success: 'Name was updated successfully'
      },
      bio: {
        title: 'Bio',
        change_btn: 'Change bio',
        changed_success: 'Bio was updated successfully'
      },
      grade: {
        title: 'Grade: ',
        grade: 'Grade',
        change_btn: 'Change grade',
        changed_success: 'Grade was updated successfully'
      },
      subjects: {
        change_btn: 'Change subjects',
        changed_success: 'Subjects updated successfully',
        subjectsNeedHelp: {
          title: 'Subjects you need help with'
        },
        subjectsCanHelp: {
          title: 'Subjects you can help with'
        }
      },
      server_error_text: 'Something went wrong, please try again later',
      wrong_password: 'Wrong password',
      empty_password: 'Please fill out this field',
      passwords_should_be_same: 'Passwords do not match',
      password_cant_be_same: 'New password should be different from the old one',
      cancel_btn: 'Cancel',
      sidebar: {
        settings: 'Settings',
        profile: 'Profile'
      }
    },
    work_page: {
      signin_btn: 'Sign in',
      landing_text: 'Home',
      signout_btn: 'Sign out',
      link_user_pref_page: 'Preferences'
    }
  },
  ru: {
    general: {
      languageSelect: {
        en: 'Английский',
        ru: 'Русский'
      },
      themeSelect: {
        'light': 'Светлая',
        'dark': 'Тёмная',
        'other': 'Другая'
      },
      menu: {
        signin_btn: 'Войти',
        landing_text: 'Домой',
        signout_btn: 'Выйти',
        link_user_pref_page: 'Настройки',
        work: 'Найти работу',
        talent: 'Найти талант',
        myjobs: 'Мои работы'
      },
      create_account: 'Создать аккаунт'
    },
    signin_page: {
      signin_text: 'Войдите',
      filloutfield_text: 'Заполните это поле',
      wrong_combination_text: 'Неверная комбинация, попробуйте снова',
      server_error_text: 'Что-то пошло не так, попробуйте позже',
      create_account_text: 'Создать аккаунт',
      next_btn: 'Дальше'
    },
    signup_page: {
      signup_text: 'Создайте аккаунт',
      signin_text: 'Войти',
      next_btn: 'Дальше',
      email_error: {
        too_short: 'Email должен состоять не менее чем из 4 символов',
        too_long: 'Email должен быть меньше 25 символов',
        contains_spec_chars: 'Email не должен содержать специальных символов',
        cant_be_same_email: 'Новый email должен отличаться от старого',
        emails_should_be_same: 'Введёная информация не совпадает'
      },
      password_error: {
        too_short: 'Пароль должен состоять не менее чем из 8 символов',
        too_long: 'Пароль должен быть меньше 25 символов',
        no_spec_chars: 'Пароль должен содержать хотя бы один специальный символ',
        no_digits: 'Пароль должен содержать хотя бы одну цифру',
        no_uppercase: 'Пароль должен содержать хотя бы одну заглавную букву',
        no_lowercase: 'Пароль должен содержать хотя бы одну строчную букву'
      },
      server_error_text: 'Что-то пошло не так, попробуйте позже'
    },
    landing_page: {
      signin_btn: 'Войти',
      landing_text: 'Домой',
      rows: {
        row0: {
          title: 'Добро пожаловать в SUP',
          text: 'SUP - это онлайн сервис тьюторской помощи студентам Гимназии Сколково.',
          image: placeholder
        },
        row1: {
          title: 'Студентам - от студентов',
          text: 'Здесь студенты-эксперты в тех или иных предметах помогают и консультируют по учёбе без посредников.\n\nВ SUPe вы можете найти желающих помочь вам:\n- В научной и исследовательской деятельности\n- В проектной деятельности\n- С осуществлением идей в рамках социальных инициатив',
          image: placeholder
        },
        row2: {
          title: 'Бесплатно',
          text: 'Вся помощь осуществляются исключительно на волонтерских началах и не предполагает оплаты.',
          image: placeholder
        },
        row3: {
          title: 'Апгрейд',
          text: 'Тьюторский проект в Гимназии - не новинка, но раньше подбор тьюторов осуществлялся вручную. Со временем мы значительно выросли и готовы выходить на новый уровень:\n\n Мы переезжаем на онлайн-платформу.',
          image: placeholder
        },
        row4: {
          title: 'Мы рады работать с вами!',
          text: 'Мы очень гордимся своим тьюторским составом и обещаем, что вы точно не пожалеете о знакомстве с нами.',
          image: placeholder
        }
      }
    },
    error_page: {
      '404': 'Страница не найдена',
      '500': 'Внутренняя ошибка сервера',
      'go_back': 'Вернуться назад'
    },
    user_preferences_page: {
      verifification: {
        title: 'Аккаунт: ',
        verified: 'Подтверждён',
        not_verified: 'Не подтверждён',
        btn: 'Отправить письмо для подтверждения'
      },
      email: {
        title: 'Email: ',
        change_email: 'Поменять email',
        enter_email: 'Введите новый email',
        confirm_email: 'Повторите email',
        confirm_password: 'Введите пароль',
        email_sent_success: 'Письмо было отправлено',
        placeholder: 'Email'
      },
      password: {
        title: 'Пароль',
        confirm_new_password: 'Повторите пароль',
        enter_current_password: 'Введите текущий пароль',
        enter_new_password: 'Введите новый пароль',
        btn: 'Поменять пароль',
        placeholder: 'Пароль'
      },
      pfp: {
        title: 'Аватар',
        upload: 'Загрузить новый аватар',
        choose_file: 'Выберите файл',
        file_name: 'Файл: ',
        btn: 'Поменять аватар',
        no_file_chosen: 'Файл не выбран',
        pfp_set: 'Аватар был успешно обновлён'
      },
      server_error_text: 'Что-то пошло не так, попробуйте позже',
      wrong_password: 'Неправильный пароль',
      empty_password: 'Пожалуйста, заполните это поле',
      passwords_should_be_same: 'Пароли не совпадают',
      password_cant_be_same: 'Новый пароль должен отличаться от старого',
      cancel_btn: 'Отмена',
      sidebar: {
        settings: 'Настройки',
        profile: 'Профиль'
      }
    },
    work_page: {
      signin_btn: 'Войти',
      landing_text: 'Домой',
      signout_btn: 'Выйти',
      link_user_pref_page: 'Настройки'
    }
  }
}

export default languages;