// ElectricalPulseScene.tsx (desactivada, ver ServiceLayout.astro) importa
// three.js, que no trae tipos, y @types/three no está instalado. Esta
// declaración evita el error de `astro check` mientras la escena siga
// desactivada; si se reactiva, conviene instalar @types/three y borrar este
// archivo.
declare module 'three';
