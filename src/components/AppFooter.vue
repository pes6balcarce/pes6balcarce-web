<!-- src/components/AppFooter.vue -->
<template>
  <footer class="app-footer">
    <div class="footer-content page-container">
      <div class="contact-section">
        <h3 class="footer-title">Contacto y Colaboraciones</h3>
        <p class="footer-text">
          ¿Quieres enviar información de equipos, kits, o te interesa aparecer como patrocinador?
          <br />
          ¡Nos encantaría escucharte! Contáctanos directamente a través de Instagram.
        </p>
        <div class="contact-buttons">
          <!-- Botón principal que intenta abrir la APP -->
          <a href="instagram://user?username=pes6balcarce" class="btn-contact">
            Contactar por Instagram (App)
          </a>
          <!-- Enlace secundario como fallback para el NAVEGADOR -->
          <a
            href="https://www.instagram.com/pes6balcarce"
            target="_blank"
            rel="noopener noreferrer"
            class="fallback-link"
          >
            (Abrir en navegador si no tienes la app)
          </a>
        </div>
      </div>
      <div class="copyright-section">
        <p>&copy; {{ new Date().getFullYear() }} PES 6 Balcarce. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #0a0a0a; /* Un negro un poco más puro */
  border-top: 1px solid var(--color-borde);
  padding: 3rem 0;
  margin-top: 3rem; /* Espacio para separarlo del contenido de la página */
}

.footer-content {
  text-align: center;
}

.footer-title {
  color: var(--color-primario);
  margin-bottom: 1rem;
}

.footer-text {
  max-width: 600px;
  margin: 0 auto 2rem auto;
  color: var(--color-texto-secundario);
  line-height: 1.8;
}

.contact-buttons {
  margin-bottom: 3rem;
}

.btn-contact {
  display: inline-block;
  background-color: var(--color-primario);
  color: #101010;
  padding: 0.8rem 2rem;
  border-radius: 50px; /* Botón píldora */
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.9rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.btn-contact:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(232, 185, 67, 0.3);
}

.fallback-link {
  display: block;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: var(--color-texto-secundario);
  text-decoration: underline;
}

.copyright-section p {
  font-size: 0.9rem;
  color: #666; /* Un gris aún más sutil para el copyright */
}
</style>
