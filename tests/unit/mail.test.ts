import { describe, it, expect } from 'vitest';
import { buildContactBody, buildMailto, buildOrderBody } from '../../src/lib/mail';
import { site, customOrder } from '../../src/lib/config';
describe('Les messages de contact', () => {
  it('préserve accents, retours de ligne, choix et référence de création', () => {
    const body = buildContactBody(
      {
        name: ' Zoé ',
        email: 'zoe@example.org',
        subject: 'Une création couture',
        message: 'Bonjour !\nLin & boutons ?',
        creation: 'La robe des sous-bois',
      },
      site.contact,
    );
    const url = new URL(buildMailto('atelier@example.org', 'Une idée & un rêve', body));
    expect(url.searchParams.get('subject')).toBe('Une idée & un rêve');
    expect(url.searchParams.get('body')).toBe(body);
    expect(body).toContain('Prénom : Zoé');
    expect(body).toContain('La robe des sous-bois');
    expect(body).toContain('Bonjour !\nLin & boutons ?');
  });
  it('refuse les adresses vides et l’injection de destinataires', () => {
    for (const email of [
      '',
      'a@example.org\r\nBcc:b@example.org',
      'a@example.org?bcc=b@example.org',
    ])
      expect(() => buildMailto(email, 'sujet', 'message')).toThrow();
  });
  it('empêche un retour de ligne dans l’objet', () => {
    expect(
      new URL(buildMailto('a@example.org', 'Bonjour\nBcc: x', '')).searchParams.get('subject'),
    ).not.toContain('\n');
  });
});
describe('Le socle sur mesure', () => {
  it('inclut les mesures et matières choisies sans ajouter de mesures vides', () => {
    const body = buildOrderBody(
      {
        poitrine: '92.5',
        taille: '72',
        hanches: '',
        tissu: 'Lin',
        boutons: 'Nacre',
        notes: 'Un ourlet plus long.',
      },
      customOrder,
    );
    expect(body).toContain('Tour de poitrine : 92.5 cm');
    expect(body).toContain('Tour de taille : 72 cm');
    expect(body).toContain('Le tissu : Lin');
    expect(body).toContain('Les boutons : Nacre');
    expect(body).not.toContain('Tour de hanches :');
    expect(body).toContain('Un ourlet plus long.');
  });
  it('ignore les options qui ne font pas partie du catalogue', () => {
    expect(buildOrderBody({ tissu: 'choix-inconnu' }, customOrder)).not.toContain('choix-inconnu');
  });
});
