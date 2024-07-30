// errorHandler.js
export const handleError = (error) => {
    // Check if the error response exists
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('Error response:', {
        status: error.response.status,
        message: error?.response?.data?.message || 'An error occurred',
      });
    } else if (error.request) {
      // Request was made but no response was received
      console.error('No response received:', {
        message: 'No response from server. Please try again later.',
      });
    } else {
      // Something else happened while setting up the request
      console.error('Error message:', {
        message: error?.message,
      });
    }
  };
  