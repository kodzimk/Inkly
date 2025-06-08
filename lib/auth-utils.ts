export const clearUserData = () => {
  // Clear all user-related data from localStorage
  localStorage.removeItem('users')
  localStorage.removeItem('currentUser')
  
  // You can add more items to clear if needed
  // localStorage.removeItem('other-user-data')
  
  // Optional: Clear all localStorage data
  // localStorage.clear()
}

export const isUserLoggedIn = () => {
  const currentUser = localStorage.getItem('currentUser')
  return currentUser !== null
}

export const getCurrentUser = () => {
  const currentUser = localStorage.getItem('currentUser')
  return currentUser ? JSON.parse(currentUser) : null
}

export const logout = () => {
  clearUserData()
  // Redirect to home page or sign-in page
  window.location.href = '/'
} 