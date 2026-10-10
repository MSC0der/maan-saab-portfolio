import { Article } from '../../models/article.model';
import {
  callout,
  code,
  estimateReadTime,
  h3,
  intro,
  list,
  p,
  section,
  steps,
  table,
} from './article-blocks';

const sections = [
  intro(
    p(
      'Authentication is the first architectural decision most backends make and one of the hardest to change later. The usual framing is "JWT versus sessions", as if one were modern and the other legacy. In practice they answer the same question, "who is making this request?", with different trade-offs around state, revocation and scale.',
    ),
    p(
      'This article walks through how each model works, where each one hurts, and the hybrid I reach for when the choice is not obvious.',
    ),
  ),

  section(
    'How session authentication works',
    p(
      'With sessions, the server owns the state. After a successful login it creates a session record, stores it (in memory, Redis or a database) and sends the client an opaque identifier in a cookie. Every later request carries that cookie and the server looks the session up.',
    ),
    steps(
      'The client posts credentials to /login.',
      'The server verifies them and creates a session record containing the user id and any server-side data.',
      'The server responds with Set-Cookie: sid=<random id>.',
      'On every request the browser sends the cookie and the server loads the session by id.',
    ),
    code(
      'javascript',
      `
import session from 'express-session';
import { RedisStore } from 'connect-redis';

app.use(
  session({
    store: new RedisStore({ client: redis }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,   // not readable from JavaScript
      secure: true,     // HTTPS only
      sameSite: 'lax',  // blunts most CSRF
      maxAge: 1000 * 60 * 60 * 8,
    },
  }),
);`,
      'Server-side sessions backed by Redis',
    ),
    callout(
      'Why teams like it',
      'Revocation is trivial. To log a user out everywhere, or to react to a breach, you delete their session rows and the next request fails. There is no token to chase down.',
    ),
  ),

  section(
    'How JWT authentication works',
    p(
      'A JSON Web Token moves the state to the client. After login the server signs a small JSON payload (the claims) and hands it back. Later requests present the token and the server only has to verify the signature and the expiry, with no lookup.',
    ),
    p(
      'A JWT is three base64url parts: a header that names the algorithm, a payload of claims, and a signature over both. The payload is encoded, not encrypted, so anyone holding the token can read it. Never put secrets in it.',
    ),
    code(
      'javascript',
      `
import jwt from 'jsonwebtoken';

const accessToken = jwt.sign(
  { sub: user.id, role: user.role },
  process.env.JWT_SECRET,
  { algorithm: 'HS256', expiresIn: '15m', issuer: 'api.example.com' },
);

// In the auth middleware
const payload = jwt.verify(token, process.env.JWT_SECRET, {
  algorithms: ['HS256'], // pin the algorithm, never trust the header
  issuer: 'api.example.com',
});
req.user = { id: payload.sub, role: payload.role };`,
      'Signing and verifying with the algorithm pinned',
    ),
    p(
      'The scaling story is real: any instance that knows the key can authenticate a request, so there is no shared session store on the hot path. That is a genuine advantage for horizontally scaled APIs and for services that call each other.',
    ),
  ),

  section(
    'Side-by-side comparison',
    table(
      ['', 'Sessions', 'JWT'],
      ['State lives', 'On the server', 'In the token, on the client'],
      ['Per-request cost', 'A store lookup', 'A signature check (CPU only)'],
      ['Revocation', 'Immediate, delete the session', 'Hard until expiry, needs extra work'],
      ['Horizontal scaling', 'Needs a shared store', 'Any node with the key can verify'],
      ['Payload size on the wire', 'Tiny cookie', 'Grows with every claim'],
      ['Best fit', 'Server-rendered apps, admin tools', 'APIs, mobile clients, service-to-service'],
    ),
  ),

  section(
    'The real problem is revocation',
    p(
      'The popular objection to JWTs is correct: a signed token stays valid until it expires, even if the user is deleted or their role changes. Teams usually respond by lengthening the expiry for convenience, which makes the problem worse.',
    ),
    p('The pattern that holds up is a short-lived access token paired with a rotating refresh token:'),
    list(
      'Access token: 5 to 15 minutes, sent with each API call, never stored in localStorage.',
      'Refresh token: opaque, long-lived, stored server-side (hashed) and sent only to the refresh endpoint in an HttpOnly cookie.',
      'Rotation: every refresh issues a new refresh token and invalidates the old one. If an old token is ever replayed, treat the whole family as stolen and revoke it.',
    ),
    code(
      'javascript',
      `
app.post('/auth/refresh', async (req, res) => {
  const presented = req.cookies.refresh;
  const record = await refreshTokens.findByHash(sha256(presented));

  if (!record || record.revokedAt) {
    // Replay of a rotated token: kill the whole family.
    if (record) await refreshTokens.revokeFamily(record.familyId);
    return res.sendStatus(401);
  }

  const next = await refreshTokens.rotate(record); // new token, old one revoked
  res.cookie('refresh', next.value, { httpOnly: true, secure: true, sameSite: 'strict' });
  res.json({ accessToken: signAccessToken(record.userId) });
});`,
      'Refresh token rotation with reuse detection',
    ),
    callout(
      'Notice what happened',
      'To get revocation back, we added server-side state (the refresh token table). "Stateless" JWT auth stays stateless only until you need to log someone out. That is fine, as long as you choose it deliberately.',
    ),
  ),

  section(
    'Cookies done right, whichever you choose',
    p('Most real-world breaches here are not cryptography failures; they are storage and transport mistakes.'),
    list(
      'HttpOnly keeps the cookie away from JavaScript, which removes the easiest XSS-to-token-theft path.',
      'Secure keeps it off plain HTTP.',
      'SameSite=Lax or Strict stops the browser attaching the cookie to most cross-site requests. If you must allow cross-site use, add CSRF tokens.',
      'Do not keep tokens in localStorage. Any script on the page, including a compromised dependency, can read it.',
    ),
  ),

  section(
    'A hybrid that works in practice',
    p(
      'When the system has many roles and permissions, putting them all in the token bloats every request and goes stale the moment an admin changes something. The compromise I prefer is a hybrid claims model: keep the token small and let the server resolve detail on demand.',
    ),
    list(
      'The JWT carries identity and a high-level role only: sub, role, exp.',
      'Fine-grained permissions are resolved server-side from a cache keyed by role, so changes take effect without waiting for tokens to expire.',
      'A short expiry and refresh rotation cap how long a stale token can live.',
    ),
    p(
      'This is the approach I used in the PeopleFern compliance platform, where large permission sets made fat tokens slow on mobile clients.',
    ),
  ),

  section(
    'A decision framework',
    list(
      'Server-rendered app on one domain, with a team that wants simple logout and tight control: sessions.',
      'Public API, mobile clients or several services calling each other: short-lived JWTs with refresh rotation.',
      'Large permission model: JWT for identity, server-side permission lookup.',
      'Need instant global revocation more than anything else: sessions, or JWTs with a server-side deny list (at which point you have rebuilt sessions).',
    ),
    p(
      'Neither is "more secure" in the abstract. The secure choice is the one whose weak points you have actually covered: cookie flags, expiry, rotation and logging.',
    ),
  ),
];

export const JWT_VS_SESSION_ARTICLE: Article = {
  slug: 'jwt-vs-session-authentication',
  title: 'JWT vs Session Authentication',
  heroTitle: 'JWT vs Session Authentication: Choosing the Right Strategy',
  excerpt:
    'How stateful sessions and stateless tokens really differ, why revocation is the hard part, and a hybrid that works for APIs with large permission models.',
  category: 'AUTHENTICATION',
  publishedAt: 'Oct 02, 2026',
  filters: ['Backend', 'Node.js', 'Authentication'],
  featured: true,
  takeaways: [
    'Sessions keep state on the server; JWTs push it to the client.',
    'Revocation is the real trade-off, not performance.',
    'Short-lived access tokens plus rotating refresh tokens restore control.',
    'Keep tokens small and resolve permissions server-side.',
  ],
  tip: {
    label: 'PRO TIP',
    text: 'Use HttpOnly, Secure and SameSite cookies regardless of whether you pick JWTs or sessions.',
  },
  sections,
  readTime: estimateReadTime(sections),
};
