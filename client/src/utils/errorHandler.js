export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.message || 'An error occurred';
  } else if (error.request) {
    return 'No response from server. Please check your connection.';
  } else {
    return error.message || 'An unexpected error occurred';
  }
};

export const logError = (error, context = '') => {
  console.error(`Error in ${context}:`, error);
  
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack trace:', error.stack);
  }
};
