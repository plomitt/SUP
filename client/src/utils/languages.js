import placeholder from '../media/placeholder_orange.png';

const languages = {
  en: {
    general: {
      access_denied: 'Access denied',
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
        authorization: 'SUP | Authorization',
        signin: 'SUP | Signin',
        signup: 'SUP | Signup',
        userpreferences: 'SUP | Preferences',
        landing: 'SUP',
        work: 'SUP | Posts',
        editpost: 'SUP | New post',
        viewpost: 'SUP | View post',
        users: 'SUP | Tutors'
      },
      menu: {
        signin_btn: 'Sign in',
        landing_text: 'Home',
        signout_btn: 'Sign out',
        cancel_btn: 'Cancel',
        signout_title: 'Sign out?',
        link_user_pref_page: 'Preferences',
        work: 'Posts',
        talent: 'Tutors',
        myjobs: 'My Jobs',
        publish_btn: 'Submit',
        back_btn: 'Back',
        edit_btn: 'Edit',
        report_btn: 'Report',
        delete_btn: 'Delete',
        refresh_btn: 'Refresh'
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
        too_short: 'Name should be at least 1 character long',
        too_long: 'Name should be less than 15 characters',
        contains_spec_chars: 'Name should not contain special characters',
        contains_digits: 'Name should not contain numbers'
      },
      surname_error: {
        too_short: 'Surname should be at least 1 character long',
        too_long: 'Surname should be less than 15 characters',
        contains_spec_chars: 'Surname should not contain special characters',
        contains_digits: 'Surname should not contain numbers'
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
    edit_post_page: {
      title: 'Title',
      description: 'Description',
      deadline: 'Deadline',
      subjects: 'Subjects',
      delete_btn: 'Delete',
      delete_title: 'Delete post?',
      post_archived: 'The post is archived - unable to make changes',
      errors: {
        title: {
          too_short: 'Title should be at least 5 characters long',
          too_long: 'Title should be less than 50 characters',
        },
        description: {
          too_short: 'Description should be at least 1 character long',
          too_long: 'Description should be less than 500 characters',
        },
        deadline: {
          empty: 'Please fill out this field',
          not_in_future: 'Deadline should be in future'
        },
        subjects: {
          empty: 'Please select at least 1 subject'
        }
      },
      response: {
        new: {
          body: 'Post published successfully',
          title: 'Success'
        },
        update: {
          body: 'Post updated successfully',
          title: 'Success'
        },
        delete: {
          body: 'Post deleted successfully',
          title: 'Success'
        }
      }
    },
    view_post_page: {
      respond_btn: 'Respond',
      responded_btn: 'Responded',
      report_title: 'Report?',
      respond_title: 'Respond?',
      responded_text: 'Responded to the post successfully',
      already_responded_text: 'Already responded to this post',
      responses: 'Responses',
      no_responses: 'No responses yet',
      accept: 'Accept',
      decline: 'Decline',
      accept_title: 'Accept response?',
      decline_title: 'Decline response?',
      cacnel_title: 'Cacnel acceptance?',
      accepted_text: 'Response accepted successfully',
      declined_text: 'Response declined successfully',
      cancelled_text: 'Response cancelled successfully',
      response_status: {
        accepted: 'Accepted',
        declined: 'Declined',
        pending: 'Pending'
      },
      yes: 'Yes',
      in_progress: 'In progress',
      complete_post_btn: 'Complete',
      completed_btn: 'Completed',
      completed_text: 'Post completed successfully',
      complete_title: 'Complete post?'
    },
    user_preferences_page: {
      success: 'Success',
      failure: 'Failure',
      not_specified: 'Not specified',
      emptyFields: {
        name: 'Name',
        surname: 'Surname',
        pfp: 'Profile picture',
        grade: 'Grade',
        bio: 'Bio',
        subjectsCanHelp: 'Subjects you can help with',
        subjectsNeedHelp: 'Subjects you need help with',
        phone: 'Phone number',
        title: 'Empty fields',
        body: 'Plesase, fill out these fields first:'
      },
      verifification: {
        title: 'Account is: ',
        verified: 'Verified',
        not_verified: 'Not verified',
        text: 'Moderators will check your account soon'
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
        changed_success: 'Phone number updated successfully'
      },
      pfp: {
        title: 'Profile picture',
        upload: 'Upload profile picture',
        choose_file: 'Choose file',
        file_name: 'File: ',
        change_btn: 'Change profile picture',
        no_file_chosen: 'No file chosen',
        changed_success: 'Profile picutre updated successfully'
      },
      name: {
        title: 'Name: ',
        change_btn: 'Change name',
        name: 'Name',
        surname: 'Surname',
        changed_success: 'Name updated successfully'
      },
      bio: {
        title: 'Bio',
        change_btn: 'Change bio',
        changed_success: 'Bio updated successfully'
      },
      grade: {
        title: 'Grade: ',
        grade: 'Grade',
        change_btn: 'Change grade',
        changed_success: 'Grade updated successfully',
        teacher: 'Teacher'
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
      link_user_pref_page: 'Preferences',
      no_posts_found: 'No posts found',
      reported_text: 'Reported successfully',
      post: {
        subjects: 'Subjects: ',
        deadline: 'Deadline: ',
        edit: 'Edit',
        delete: 'Delete',
        report: 'Report'
      },
      search_txt: 'Search...'
    },
    users_page: {
      subjectsCanHelp: 'Can help: ',
      subjectsNeedHelp: 'Needs help: '
    },
    view_user_page: {
      subjectsCanHelp: 'Can help',
      subjectsNeedHelp: 'Needs help',
      hire_btn: 'Hire',
      list_label: {
        usrToLgd: 'Responses to you',
        lgdToUsr: 'Your responses'
      }
    }
  },
  ru: {
    general: {
      access_denied: 'Доступ запрещён',
      languageSelect: {
        en: 'Английский',
        ru: 'Русский'
      },
      themeSelect: {
        'light': 'Светлая',
        'dark': 'Тёмная'
      },
      page_titles: {
        error: 'SUP | Ошибка',
        authorization: 'SUP | Авторизация',
        signin: 'SUP | Войти',
        signup: 'SUP | Регистрация',
        userpreferences: 'SUP | Настройки',
        landing: 'SUP',
        work: 'SUP | Посты',
        users: 'SUP | Тьюторы'
      },
      menu: {
        signin_btn: 'Войти',
        landing_text: 'Домой',
        signout_btn: 'Выйти',
        cancel_btn: 'Отмена',
        signout_title: 'Выйти?',
        link_user_pref_page: 'Настройки',
        work: 'Посты',
        talent: 'Тьюторы',
        myjobs: 'Мои работы',
        publish_btn: 'Опубликовать',
        back_btn: 'Назад',
        edit_btn: 'Править',
        report_btn: 'Жалоба',
        delete_btn: 'Удалить',
        refresh_btn: 'Обновить'
      },
      create_account: 'Создать аккаунт',
      server_error_text: 'Что-то пошло не так. Пожалуйста, повторите попытку позже',
      file_error: {
        file_too_large: 'Выбранный файл слишком большой',
        wrong_type: 'Выбранный файл не является изображением'
      },
      phone_error: {
        incorrect: 'Введенные данные не соответствуют формату \'1234567890\''
      },
      grade_error: {
        incorrect: 'Введенные данные не соответствуют формату \'11A\'',
        wrong_grade: 'Цифра номера класса должна быть между 1 и 11',
        contains_spec_chars: 'Номер класса не должен содержать специальных символов. Буква номера класса должна быть заглавной буквой латинского алфавита'
      },
      bio_error: {
        too_short: 'Био должно быть длиннее 1 символа',
        too_long: 'Био должно быть короче 250 символо',
      },
      name_error: {
        too_short: 'Имя должно быть длиннее 1 символа',
        too_long: 'Имя должно быть короче 15 символов',
        contains_spec_chars: 'Имя не должно содержать специальных символов',
        contains_digits: 'Имя не должно содержать цифр'
      },
      surname_error: {
        too_short: 'Фамилия должна быть длиннее 1 символа',
        too_long: 'Фамилия должна быть короче 15 символов',
        contains_spec_chars: 'Фамилия не должна содержать специальных символов',
        contains_digits: 'Фамилия не должна содержать цифр'
      },
      email_error: {
        too_short: 'Адрес должен быть длиннее 4 символов',
        too_long: 'Адрес должен быть короче 25 символов',
        contains_spec_chars: 'Адрес не должен содержать специальные символы',
        cant_be_same_email: 'Новый адрес должен отличаться от старого',
        emails_should_be_same: 'Адреса не совпадают',
        email_taken: 'Этот адрес занят, попробуйте другой'
      },
      password_error: {
        too_short: 'Пароль должен быть длиннее 8 символов',
        too_long: 'Пароль должен быть короче 25 символов',
        no_spec_chars: 'Пароль должен содержать хотя бы один специальный символ',
        no_digits: 'Пароль должен содержать хотя бы одну цифру',
        no_uppercase: 'Пароль должен содержать хотя бы одну заглавную букву',
        no_lowercase: 'Пароль должен содержать хотя бы одну строчную букву',
        password_cant_be_same: 'Новый пароль должен отличаться от старого',
      },
      subjects: {
        maths: 'Математика',
        physics: 'Физика',
        informatics: 'Информатика',
        russian: 'Русский язык',
        english: 'Английский язык'
      }
    },
    signin_page: {
      signin_text: 'Войти',
      auth_text: 'Введите свой пароль',
      filloutfield_text: 'Пожалуйста, заполните это поле',
      wrong_combination_text: 'Неправильная комбинация, попробуйте еще раз',
      server_error_text: 'Что-то пошло не так. Пожалуйста, повторите попытку позже',
      create_account_text: 'Создать аккаунт',
      next_btn: 'Дальше'
    },
    signup_page: {
      signup_text: 'Создать аккаунт',
      signin_text: 'Войти',
      next_btn: 'Дальше',
      server_error_text: 'Что-то пошло не так. Пожалуйста, повторите попытку позже'
    },
    authorization_page: {
      wrong_password: 'Неправильный пароль',
      server_error_text: 'Что-то пошло не так. Пожалуйста, повторите попытку позже'
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
      'go_back': 'Назад'
    },
    edit_post_page: {
      title: 'Заголовок',
      description: 'Описание',
      deadline: 'Дедлайн',
      subjects: 'Предметы',
      delete_btn: 'Удалить',
      delete_title: 'Удалить пост?',
      post_archived: 'Пост заархивирован - внесение изменений невозможно',
      errors: {
        title: {
          too_short: 'Заголовок должен быть длиннее 5 символов',
          too_long: 'Заголовок должен быть короче 50 символов',
        },
        description: {
          too_short: 'Описание должено быть длиннее 1 символа',
          too_long: 'Описание должено быть короче 500 символов',
        },
        deadline: {
          empty: 'Пожалуйста, заполните это поле',
          not_in_future: 'Дедлайн должен быть в будущем'
        },
        subjects: {
          empty: 'Пожалуйста, выберите хотя бы 1 предмет'
        }
      },
      response: {
        new: {
          body: 'Пост успешно опубликован',
          title: 'Успех'
        },
        update: {
          body: 'Пост успешно обновлён',
          title: 'Успех'
        },
        delete: {
          body: 'Пост успешно удалён',
          title: 'Успех'
        }
      }
    },
    view_post_page: {
      respond_btn: 'Ответить',
      responded_btn: 'Ответ отправлен',
      report_title: 'Пожаловаться?',
      respond_title: 'Ответить?',
      responded_text: 'Ответ на пост успешен',
      already_responded_text: 'Ответ на этот пост уже был отправлен',
      responses: 'Ответы',
      no_responses: 'Ответов ещё нет',
      accept: 'Принять',
      decline: 'Отклонить',
      accept_title: 'Принять ответ?',
      decline_title: 'Отклонить ответ?',
      cacnel_title: 'Отменить принятие?',
      accepted_text: 'Ответ успешно принят',
      declined_text: 'Ответ успешно отклонён',
      cancelled_text: 'Ответ успешно оменён',
      response_status: {
        accepted: 'Принят',
        declined: 'Отклонён',
        pending: 'В ожидании'
      },
      yes: 'Да',
      in_progress: 'Выполняется',
      complete_post_btn: 'Завершить',
      completed_btn: 'Завершён',
      completed_text: 'Пост успешно завершён',
      complete_title: 'Завершить пост?'
    },
    user_preferences_page: {
      success: 'Успех',
      failure: 'Сбой',
      not_specified: 'Отсутствует',
      emptyFields: {
        name: 'Имя',
        surname: 'Фамилия',
        pfp: 'Аватар',
        grade: 'Класс',
        bio: 'Био',
        subjectsCanHelp: 'Предметы, с которыми вы можете помочь',
        subjectsNeedHelp: 'Предметы, с которыми вам нужна помощь',
        phone: 'Номер телефона',
        title: 'Незаполненные поля',
        body: 'Пожалуйста, заполните следующие поля:'
      },
      verifification: {
        title: 'Аккаунт: ',
        verified: 'Подтверждён',
        not_verified: 'Не подтверждён',
        text: 'Модераторы скоро проверят ваш аккаунт',
      },
      email: {
        title: 'Email: ',
        change_btn: 'Сменить адрес электронной почты',
        enter_email: 'Введите новый адрес',
        confirm_email: 'Подтвердите адрес',
        confirm_password: 'Введите текущий пароль',
        changed_success: 'Письмо с подтверждением было отправлено на ваш новый почтовый ящик',
        placeholder: 'Email'
      },
      password: {
        title: 'Пароль',
        confirm_new_password: 'Подтвердите новый пароль',
        enter_current_password: 'Введите текущий пароль',
        enter_new_password: 'Введите новый пароль',
        change_btn: 'Сменить пароль',
        placeholder: 'Пароль',
        changed_success: 'Пароль успешно обновлён'
      },
      phone: {
        title: 'Номер телефона: ',
        phone: 'Номер телефона',
        placeholder: 'Формат: 1234567890',
        change_btn: 'Сменить номер телефона',
        changed_success: 'Номер телефона успешно обновлён'
      },
      pfp: {
        title: 'Аватар',
        upload: 'Загрузить аватар',
        choose_file: 'Выбрать файл',
        file_name: 'Файл: ',
        change_btn: 'Сменить аватар',
        no_file_chosen: 'Файл не выбран',
        changed_success: 'Аватар успешно обновлён'
      },
      name: {
        title: 'Имя: ',
        change_btn: 'Сменить имя',
        name: 'Имя',
        surname: 'Фамилия',
        changed_success: 'Имя успешно обновлено'
      },
      bio: {
        title: 'Био',
        change_btn: 'Сменить био',
        changed_success: 'Био успешно обновлено'
      },
      grade: {
        title: 'Класс: ',
        grade: 'Класс',
        change_btn: 'Сменить класс',
        changed_success: 'Класс успешно обновлён',
        teacher: 'Учитель'
      },
      subjects: {
        change_btn: 'Сменить предметы',
        changed_success: 'Предметы успешно обновлены',
        subjectsNeedHelp: {
          title: 'Предметы, с которыми вам нужна помощь'
        },
        subjectsCanHelp: {
          title: 'Предметы, с которыми вы можете помочь'
        }
      },
      server_error_text: 'Что-то пошло не так. Пожалуйста, повторите попытку позже',
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
      link_user_pref_page: 'Настройки',
      no_posts_found: 'Постов не найдено',
      reported_text: 'Жалоба была отправлена',
      post: {
        subjects: 'Предметы: ',
        deadline: 'Дэдлайн: ',
        edit: 'Править',
        delete: 'Удалить',
        report: 'Жалоба'
      },
      search_txt: 'Поиск...'
    },
    users_page: {
      subjectsCanHelp: 'Может помочь: ',
      subjectsNeedHelp: 'Нужна помощь: '
    },
    view_user_page: {
      subjectsCanHelp: 'Может помочь',
      subjectsNeedHelp: 'Нужна помощь',
      hire_btn: 'Нанять',
      list_label: {
        usrToLgd: 'Ответы вам',
        lgdToUsr: 'Ваши ответы'
      }
    }
  }
}

export default languages;