export const dev = process.env.NODE_ENV === 'development'
export const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout))
export const now = o => new Promise(resolve => resolve(o))
export const pack = (promise, callback) => promise.then(res => callback(res))

/** @type {Window} */ let winRef = null

export const openMsgWindow = (strUrl, storeName, HeadImageUrl) => {
  if (winRef && !winRef.closed) {
    if (winRef.location.pathname.indexOf(strUrl) === -1) {
      winRef.location.href = `${window.origin}${strUrl}${'/'+ encodeURI(storeName)}`
    }
    localStorage.setItem('HeadImageUrl', HeadImageUrl)
    winRef.focus()
  } else {
    winRef = window.open('', 'message_emake')
    localStorage.setItem('HeadImageUrl', HeadImageUrl)
    if (winRef.location.pathname.indexOf(strUrl) !== -1) {
      winRef.focus()
    } else {
      winRef.location.href = `${window.origin}${strUrl}${'/'+ encodeURI(storeName)}`
    }
  }
}

export const openNormalWindow = strUrl => {
  window.open(strUrl, 'origin_emake')
}

export const setNormalPage = () => {
  window.name = 'origin_emake'
}

export const setMessagePage = () => {
  window.name = 'message_emake'
}
