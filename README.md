<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/2

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## GitHub Actions

Este proyecto incluye workflows de GitHub Actions para CI/CD:

### CI Workflow
- Se ejecuta automáticamente en push y pull requests
- Construye el proyecto para verificar que no hay errores
- Guarda los artefactos de build

### Deploy Workflow
- Despliega automáticamente a GitHub Pages cuando se hace push a `main` o `master`
- También se puede ejecutar manualmente desde la pestaña "Actions" en GitHub

### Configuración

1. **Habilitar GitHub Pages:**
   - Ve a Settings > Pages en tu repositorio
   - Selecciona "GitHub Actions" como fuente

2. **Configurar secretos (opcional):**
   - Si necesitas `GEMINI_API_KEY` en el build, ve a Settings > Secrets and variables > Actions
   - Agrega el secreto `GEMINI_API_KEY` con tu clave de API

3. **Hacer el repositorio público:**
   - Ve a Settings > General > Danger Zone
   - Haz clic en "Change repository visibility" y selecciona "Public"

### Ver los workflows
Los workflows están en `.github/workflows/`:
- `ci.yml` - Construcción y verificación
- `deploy.yml` - Despliegue a GitHub Pages
