export   const validation = (name: string, value: string) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  if (name === 'name') {
    if (value.trim().length >= 1 && value.trim().length < 255) {
      return true
    } else {
      return ('Name must be from 1 to 255 characters')
    }
  }

  if (name === 'email') {
    if (value.trim().length >= 1 && value.trim().length < 254 && emailPattern.test(value)) {
      return true
    } else {
      return ('Email must be from 1 to 255 characters and include @')
    }
  }

  if (name === 'birthday_date') {
    if (datePattern.test(value)) {
      return true
    } else {
      return ('Date must be YYYY-MM-DD')
    }
  }

  if (name === 'phone_number') {
    if (value.trim().length >= 1 && value.trim().length < 20) {
      return true
    } else {
      return ('phone_number must be from 1 to 255 characters')
    }
    
  }
  if (name === 'address') {
    if (value.trim().length >= 1) {
      return true
    } else {
      return ('Address must be from 1 to 255 characters')
    }
  }
}
