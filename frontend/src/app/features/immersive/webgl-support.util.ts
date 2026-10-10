/**
 * Minimal, allocation-light WebGL capability probe. Used to decide whether the
 * Three.js scene is built at all — when it returns false the immersive theme
 * falls back to the plain HTML hero on a CSS atmosphere.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const context =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');

    return context instanceof WebGLRenderingContext ||
      (typeof WebGL2RenderingContext !== 'undefined' &&
        context instanceof WebGL2RenderingContext);
  } catch {
    return false;
  }
}
