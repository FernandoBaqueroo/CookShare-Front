// Script de prueba para verificar la API de favoritos
async function testFavoritos() {
  try {
    // 1. Login
    console.log('🔍 1. Haciendo login...')
    const loginResponse = await fetch('http://localhost/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'juan.mejorado@email.com',
        password: '123456'
      })
    })
    
    const loginData = await loginResponse.json()
    console.log('🔍 Login response:', loginData)
    
    if (!loginData.token) {
      throw new Error('No se obtuvo token')
    }
    
    const token = loginData.token
    console.log('🔍 Token obtenido:', token.substring(0, 20) + '...')
    
    // 2. Obtener favoritos
    console.log('🔍 2. Obteniendo favoritos...')
    const favoritosResponse = await fetch('http://localhost/api/favoritos?usuario_id=1', {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    const favoritosData = await favoritosResponse.json()
    console.log('🔍 Favoritos response:', favoritosData)
    
    // 3. Crear mapa de favoritos
    if (favoritosData.data) {
      const favoritosMap = {}
      favoritosData.data.forEach(favorito => {
        favoritosMap[favorito.receta_id] = favorito.id
      })
      console.log('🔍 Mapa de favoritos creado:', favoritosMap)
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error)
  }
}

// Ejecutar la prueba
testFavoritos() 