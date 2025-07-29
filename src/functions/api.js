// Configuración de la API según el entorno
const getApiBase = () => {
  // En desarrollo, usar localhost:80 (Docker Sail)
  if (import.meta.env.DEV) {
    return 'http://localhost/api/'
  }
  // En producción, usar la URL del servidor
  return import.meta.env.VITE_API_URL || '/api/'
}

const API_BASE = getApiBase()

async function handleResponse(res) {
  const contentType = res.headers.get('content-type')
  
  console.log('Content-Type de la respuesta:', contentType)
  console.log('Status de la respuesta:', res.status)
  
  if (contentType && contentType.includes('application/json')) {
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error('Error data:', errorData)
      throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`)
    }
    return await res.json()
  } else {
    // Si la respuesta es HTML (error de Laravel), crear un error apropiado
    if (!res.ok) {
      const text = await res.text()
      console.error('Respuesta HTML de error:', text.substring(0, 200))
      throw new Error(`Error ${res.status}: ${res.statusText}`)
    }
    throw new Error('Respuesta inesperada del servidor')
  }
}

export async function apiGet(endpoint, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  
  const res = await fetch(API_BASE + endpoint, { 
    headers
  })
  return handleResponse(res)
}

export async function apiPost(endpoint, data, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  
  const res = await fetch(API_BASE + endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function apiPut(endpoint, data, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  console.log(`📤 PUT ${API_BASE}${endpoint}`)
  console.log('📋 Headers:', headers)
  console.log('📄 Data:', data)
  console.log('📄 Data JSON:', JSON.stringify(data))

  const res = await fetch(API_BASE + endpoint, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data)
  })

  console.log(`📥 Respuesta PUT ${endpoint}:`, res.status, res.statusText)
  return handleResponse(res)
}

export async function apiDelete(endpoint, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  
  const res = await fetch(API_BASE + endpoint, {
    method: 'DELETE',
    headers
  })
  return handleResponse(res)
}

// Función específica para subir imagen de perfil usando FormData
export async function uploadProfileImageFormData(imageFile, token) {
  const formData = new FormData()
  formData.append('foto_perfil', imageFile)
  
  console.log('Enviando imagen usando FormData:', imageFile.name)
  
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  // No incluir Content-Type, dejar que el navegador lo establezca automáticamente para FormData
  
  // Probar diferentes endpoints
  const endpoints = [
    'perfil/imagen',
    'upload-profile-image',
    'profile-image',
    'usuario/imagen',
    'api/upload-image'
  ]
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Probando endpoint FormData: ${endpoint}`)
      const res = await fetch(API_BASE + endpoint, {
        method: 'POST',
        headers,
        body: formData
      })
      
      console.log(`Respuesta del endpoint ${endpoint}:`, res.status, res.statusText)
      
      if (res.ok) {
        return handleResponse(res)
      }
    } catch (error) {
      console.log(`Error con endpoint ${endpoint}:`, error.message)
      continue
    }
  }
  
  throw new Error('No se pudo encontrar un endpoint válido para subir la imagen')
}

// Función específica para subir imagen de perfil
export async function uploadProfileImage(imageFile, token, usuario_id) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const base64Image = e.target.result
        
        const headers = { 'Content-Type': 'application/json' }
        if (token) headers.Authorization = `Bearer ${token}`
        
        const payload = {
          usuario_id: usuario_id,
          foto_perfil: base64Image
        }
        
        console.log('Enviando petición a profile-image')
        console.log('Usuario ID:', usuario_id)
        console.log('Base64 length:', base64Image.length)
        
        // Usar el endpoint correcto para subir imágenes
        const res = await fetch(API_BASE + 'profile-image', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        })
        
        console.log('Respuesta del servidor:', res.status, res.statusText)
        
        const result = await handleResponse(res)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo de imagen'))
    }
    
    reader.readAsDataURL(imageFile)
  })
}

// Exportación por defecto con todas las funciones
export default {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  uploadProfileImage,
  uploadProfileImageFormData
}

 