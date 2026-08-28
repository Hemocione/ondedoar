import { describe, it, expect } from 'vitest';
import { mapHemocioneIdPointToResponse } from './hemocioneid';

describe('mapHemocioneIdPointToResponse', () => {
  it('carrega o id do hemocione-id como bloodBanksLocationId', () => {
    const point = {
      id: '3f2504e0-4f89-11d3-9a0c-0305e82c3301',
      name: 'Banco de Sangue Teste',
      address: 'Rua Teste, 123',
      latitude: -23.55,
      longitude: -46.63,
      displayName: null,
    };

    const result = mapHemocioneIdPointToResponse(point);

    expect(result.bloodBanksLocationId).toBe('3f2504e0-4f89-11d3-9a0c-0305e82c3301');
  });

  it('mantem o type fixo em bloodbank', () => {
    const point = {
      id: '3f2504e0-4f89-11d3-9a0c-0305e82c3301',
      name: 'Banco de Sangue Teste',
      address: 'Rua Teste, 123',
      latitude: -23.55,
      longitude: -46.63,
      displayName: null,
    };

    const result = mapHemocioneIdPointToResponse(point);

    expect(result.type).toBe('bloodbank');
  });
});
