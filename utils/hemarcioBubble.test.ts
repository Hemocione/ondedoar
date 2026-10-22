import { describe, it, expect } from 'vitest';
import {
  buildHemarcioContext,
  shouldShowHemarcio,
  resolveHemarcioEnabled,
} from './hemarcioBubble';

const base = { enabled: true, iframedQuery: false, inIframe: false, path: '/' };

describe('shouldShowHemarcio', () => {
  it('mostra no mapa com a flag ligada', () => {
    expect(shouldShowHemarcio(base)).toBe(true);
  });
  it('esconde com a flag desligada', () => {
    expect(shouldShowHemarcio({ ...base, enabled: false })).toBe(false);
  });
  it('esconde com ?iframed=true', () => {
    expect(shouldShowHemarcio({ ...base, iframedQuery: true })).toBe(false);
  });
  it('esconde dentro de iframe', () => {
    expect(shouldShowHemarcio({ ...base, inIframe: true })).toBe(false);
  });
  it('esconde em /test e subpaginas', () => {
    expect(shouldShowHemarcio({ ...base, path: '/test' })).toBe(false);
    expect(shouldShowHemarcio({ ...base, path: '/test/x' })).toBe(false);
  });
  it('nao confunde /testimonials com /test', () => {
    expect(shouldShowHemarcio({ ...base, path: '/testimonials' })).toBe(true);
  });
});

describe('resolveHemarcioEnabled', () => {
  it('so liga com true ou "true"', () => {
    expect(resolveHemarcioEnabled(true)).toBe(true);
    expect(resolveHemarcioEnabled('true')).toBe(true);
    expect(resolveHemarcioEnabled('false')).toBe(false);
    expect(resolveHemarcioEnabled(false)).toBe(false);
    expect(resolveHemarcioEnabled(undefined)).toBe(false);
    expect(resolveHemarcioEnabled('1')).toBe(false);
  });
});

describe('buildHemarcioContext', () => {
  it('usa product ondedoar e o path atual', () => {
    expect(buildHemarcioContext('/')).toEqual({ product: 'ondedoar', page: '/' });
  });
});
