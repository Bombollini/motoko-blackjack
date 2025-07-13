// Utility functions for handling backend responses and data conversions

/**
 * Converts BigInt values to Numbers recursively in an object
 * @param {any} obj - The object to convert
 * @returns {any} - The object with BigInt values converted to Numbers
 */
export const convertBigIntToNumber = (obj) => {
  if (obj === null || obj === undefined) return obj
  
  if (typeof obj === 'bigint') {
    return Number(obj)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToNumber)
  }
  
  if (typeof obj === 'object') {
    const converted = {}
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertBigIntToNumber(value)
    }
    return converted
  }
  
  return obj
}

/**
 * Handles array response format from backend
 * @param {any} response - The response from backend
 * @returns {any} - The parsed response
 */
export const parseBackendResponse = (response) => {
  // Handle array format response
  const result = Array.isArray(response) ? response[0] : response
  
  // Convert BigInt values to Numbers
  return convertBigIntToNumber(result)
}

/**
 * Safely gets a value from an optional object
 * @param {any} obj - The object to get value from
 * @param {string} key - The key to get
 * @param {any} defaultValue - The default value if key doesn't exist
 * @returns {any} - The value or default value
 */
export const safeGet = (obj, key, defaultValue = null) => {
  if (!obj || typeof obj !== 'object') return defaultValue
  return obj[key] !== undefined ? obj[key] : defaultValue
}

/**
 * Safely gets an array from an optional object
 * @param {any} obj - The object to get array from
 * @param {string} key - The key to get
 * @returns {Array} - The array or empty array
 */
export const safeGetArray = (obj, key) => {
  if (!obj || typeof obj !== 'object') return []
  const value = obj[key]
  return Array.isArray(value) ? value : []
}

/**
 * Logs debug information for backend responses
 * @param {string} action - The action being performed
 * @param {any} response - The response from backend
 * @param {any} parsedResult - The parsed result
 */
export const logBackendResponse = (action, response, parsedResult) => {
  console.group(`🎮 Backend Action: ${action}`)
  console.log('Raw response:', response)
  console.log('Parsed result:', parsedResult)
  console.log('Success:', parsedResult?.success)
  if (parsedResult?.message) {
    console.log('Message:', parsedResult.message)
  }
  console.groupEnd()
}
