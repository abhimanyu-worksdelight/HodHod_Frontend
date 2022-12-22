import { TrustHTMLPipe } from './trust-html.pipe';

describe('TrustHTMLPipe', () => {
  it('create an instance', () => {
    const pipe = new TrustHTMLPipe();
    expect(pipe).toBeTruthy();
  });
});
