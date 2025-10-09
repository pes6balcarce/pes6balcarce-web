// src/data/patrocinadores.js

// Para que esto funcione, primero debes colocar las imágenes
// dentro de la carpeta 'src/assets/patrocinadores/'

// 1. Importa cada imagen que quieras usar
import CostiBarber from '@/assets/patrocinadores/CostiBarber.png'
// (cuando añadas un nuevo logo, impórtalo aquí)

// 2. Crea y exporta el array de patrocinadores
export const listaPatrocinadores = [
  {
    id: 1,
    nombre: 'CostiBarber',
    enlace: 'https://www.instagram.com/costi.barberr',
    imagen: CostiBarber, // Usa la variable importada
  },
  // Para añadir más, solo copia un bloque de arriba y pégalo aquí
]

// NOTA: Para este ejemplo, necesitarás tener 4 imágenes de ejemplo en
// tu carpeta 'src/assets/patrocinadores/' llamadas:
// - sponsor-a.png
