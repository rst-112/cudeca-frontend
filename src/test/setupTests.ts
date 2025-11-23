/**
 * Configuración global para tests con Vitest
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Limpiar después de cada test
afterEach(() => {
  cleanup();
});
