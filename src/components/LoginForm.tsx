import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { LoginErrors, LoginFormValues } from '../types';

const API_URL = 'http://localhost:3000/api/v1';
const SESSION_TOKEN_KEY = 'campusconnect-token';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_VALUES: LoginFormValues = {
  email: '',
  password: '',
  remember: false,
};

function validate(values: LoginFormValues): LoginErrors {
  const errors: LoginErrors = {};
  if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }
  return errors;
}

export default function LoginForm() {
  const [values, setValues] = useState<LoginFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [welcomeName, setWelcomeName] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkingSession, setCheckingSession] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const token =
      localStorage.getItem(SESSION_TOKEN_KEY) ??
      sessionStorage.getItem(SESSION_TOKEN_KEY);

    if (!token) {
      setCheckingSession(false);
      return () => {
        active = false;
      };
    }

    async function restoreSession() {
      try {
        const meRes = await fetch(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (meRes.status === 401) {
          localStorage.removeItem(SESSION_TOKEN_KEY);
          sessionStorage.removeItem(SESSION_TOKEN_KEY);
          return;
        }

        const meData = await meRes.json();
        if (!meRes.ok) {
          throw new Error(meData?.message || 'Could not load your account.');
        }

        if (active) setWelcomeName(meData.name);
      } catch (err) {
        console.error('[API ERROR] Could not restore session', err);
        if (active) setApiError('Cannot reach the server. Is the API running?');
      } finally {
        if (active) setCheckingSession(false);
      }
    }

    void restoreSession();
    return () => {
      active = false;
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    setWelcomeName(null);
    setApiError(null);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, type, value, checked } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setApiError(null);
    setWelcomeName(null);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const payload = { email: values.email, password: values.password };
      console.log('[API REQUEST] POST /sessions', {
        email: payload.email,
        password: '********',
      });

      const loginRes = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const loginData = await loginRes.json().catch(() => null);
      console.log('[API RESPONSE] POST /sessions', loginRes.status, loginData);

      if (!loginRes.ok) {
        console.error('[API ERROR] POST /sessions', loginRes.status, loginData);
        setApiError(loginData?.message || 'Login failed. Please try again.');
        return;
      }

      console.log('[API REQUEST] GET /users/me', '(Bearer token)');
      const meRes = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${loginData.token}` },
      });
      const meData = await meRes.json().catch(() => null);
      console.log('[API RESPONSE] GET /users/me', meRes.status, meData);

      if (!meRes.ok) {
        console.error('[API ERROR] GET /users/me', meRes.status, meData);
        setApiError(meData?.message || 'Could not load your account.');
        return;
      }

      const storage = values.remember ? localStorage : sessionStorage;
      const otherStorage = values.remember ? sessionStorage : localStorage;
      otherStorage.removeItem(SESSION_TOKEN_KEY);
      storage.setItem(SESSION_TOKEN_KEY, loginData.token);
      setWelcomeName(meData.name);
    } catch (err) {
      console.error('[API ERROR] Network or server problem', err);
      setApiError('Cannot reach the server. Is the API running?');
    } finally {
      setLoading(false);
    }
  }

  if (welcomeName) {
    return (
      <section className="login-card" aria-labelledby="welcome-title">
        <h2 id="welcome-title" className="login-card__title">
          Welcome, {welcomeName}
        </h2>
        <button type="button" className="btn btn--secondary" onClick={handleLogout}>
          Log out
        </button>
      </section>
    );
  }

  if (checkingSession) {
    return (
      <section className="login-card" aria-label="Restoring session">
        <p>Checking your session...</p>
      </section>
    );
  }

  return (
    <section className="login-card" aria-labelledby="login-title">
      <h2 id="login-title" className="login-card__title">
        Sign in
      </h2>
      <p className="login-card__subtitle">Use your school email to continue.</p>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="email">School email</label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@school.edu.ph"
            value={values.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="form-error" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <div className="password-row">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              className="btn btn--ghost toggle-password"
              aria-controls="password"
              aria-pressed={showPassword}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="form-error" role="alert">
              {errors.password}
            </p>
          )}
        </div>

                <div className="form-options">
          <label className="checkbox">
            <input
              type="checkbox"
              name="remember"
              checked={values.remember}
              onChange={handleChange}
            />
            <span>Keep me signed in</span>
          </label>
          <a className="link" href="#forgot">
            Forgot password?
          </a>
        </div>

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        {apiError && (
          <p className="form-error" role="alert">
            {apiError}
          </p>
        )}
      </form>

      <div className="login-card__divider">
        <span>or</span>
      </div>

      <div className="alt-actions">
        <button type="button" className="btn btn--secondary">
          Create account
        </button>
        <button type="button" className="btn btn--secondary">
          Continue as guest
        </button>
      </div>
    </section>
  );
}