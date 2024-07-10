const getRole = data => {
  if (localStorage.getItem('role')) {
    return JSON.parse(localStorage.getItem('role'))
  } else {
    return 'User'
  }
}
export default getRole
