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

// Funciones específicas para ingredientes
export async function buscarIngredientes(termino, token) {
  try {
    const url = termino 
      ? `${API_BASE}ingredientes/lista?busqueda=${encodeURIComponent(termino)}`
      : `${API_BASE}ingredientes/lista`
    
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`
    
    const res = await fetch(url, { headers })
    return handleResponse(res)
  } catch (error) {
    console.error('Error buscando ingredientes:', error)
    throw error
  }
}

export async function crearIngrediente(nombre, unidadMedida, token) {
  try {
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`
    
    const res = await fetch(`${API_BASE}ingredientes/crear`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        nombre: nombre,
        unidad_medida: unidadMedida
      })
    })
    
    return handleResponse(res)
  } catch (error) {
    console.error('Error creando ingrediente:', error)
    throw error
  }
}

// ===== FUNCIONES DE ELIMINACIÓN Y FAVORITOS =====

/**
 * Eliminar una receta (marcar como inactiva)
 * @param {number} recetaId - ID de la receta a eliminar
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function eliminarReceta(recetaId, token) {
  try {
    const headers = {}
    if (token) headers.Authorization = `Bearer ${token}`
    
    const res = await fetch(`${API_BASE}receta/${recetaId}`, {
      method: 'DELETE',
      headers
    })
    return handleResponse(res)
  } catch (error) {
    console.error('Error eliminando receta:', error)
    throw error
  }
}

/**
 * Añadir una receta a favoritos
 * @param {number} recetaId - ID de la receta
 * @param {number} usuarioId - ID del usuario
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function añadirFavorito(recetaId, usuarioId, token) {
  try {
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`
    
    // Enviar datos en formato más simple
    const data = {
      receta_id: recetaId,
      usuario_id: usuarioId
    }
    
    const res = await fetch(`${API_BASE}favorito`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })
    
    // Manejar la respuesta directamente aquí para evitar el error de "body stream already read"
    const contentType = res.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`)
      }
      return await res.json()
    } else {
      // Si la respuesta es HTML (error de Laravel), crear un error apropiado
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }
      throw new Error('Respuesta inesperada del servidor')
    }
  } catch (error) {
    throw error
  }
}

/**
 * Eliminar una receta de favoritos
 * @param {number} favoritoId - ID del favorito a eliminar
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function eliminarFavorito(favoritoId, token) {
  try {
    const headers = {}
    if (token) headers.Authorization = `Bearer ${token}`
    
    const res = await fetch(`${API_BASE}favorito/${favoritoId}`, {
      method: 'DELETE',
      headers
    })
    return handleResponse(res)
  } catch (error) {
    throw error
  }
}







/**
 * Obtener perfil público de otro usuario por nombre de usuario
 * @param {string} nombreUsuario - Nombre de usuario
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function obtenerPerfilUsuario(nombreUsuario, token) {
  try {
    const headers = {}
    if (token) headers.Authorization = `Bearer ${token}`
    
    const res = await fetch(`${API_BASE}usuario/${encodeURIComponent(nombreUsuario)}`, {
      method: 'GET',
      headers
    })
    return handleResponse(res)
  } catch (error) {
    throw error
  }
}

/**
 * Obtener recetas de un usuario específico por nombre de usuario
 * @param {string} nombreUsuario - Nombre de usuario
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function obtenerRecetasUsuario(nombreUsuario, token) {
  try {
    const headers = {}
    if (token) headers.Authorization = `Bearer ${token}`
    
    const res = await fetch(`${API_BASE}usuario/${encodeURIComponent(nombreUsuario)}/recetas`, {
      method: 'GET',
      headers
    })
    return handleResponse(res)
  } catch (error) {
    throw error
  }
}



// Exportación por defecto con todas las funciones
export default {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  uploadProfileImage,
  uploadProfileImageFormData,
  buscarIngredientes,
  crearIngrediente,
  eliminarReceta,
  añadirFavorito,
  eliminarFavorito,
  obtenerPerfilUsuario,
  obtenerRecetasUsuario
}

 