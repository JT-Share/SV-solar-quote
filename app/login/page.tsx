import Link from "next/link";

export const metadata = { title: "Sign in — SunVena Solar Quote" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#e9e9ec",
        fontFamily:
          '"Helvetica Neue",Helvetica,Arial,"Segoe UI",sans-serif',
        color: "#393c41",
        padding: 24,
      }}
    >
      <form
        method="post"
        action="/api/login"
        style={{
          width: 360,
          maxWidth: "100%",
          background: "#fff",
          border: "1px solid #ced0d8",
          borderRadius: 12,
          padding: "28px 26px 24px",
          boxShadow: "0 6px 26px rgba(0,0,0,.10)",
        }}
      >
        <div
          style={{
            color: "#e31937",
            fontWeight: 700,
            letterSpacing: 3,
            fontSize: 16,
            marginBottom: 6,
          }}
        >
          SUNVENA
        </div>
        <h1 style={{ fontSize: 18, margin: "0 0 18px", fontWeight: 600 }}>
          Solar Roof Quote Builder
        </h1>

        {error ? (
          <div
            style={{
              background: "#fdecef",
              border: "1px solid #f5c2cd",
              color: "#c8112e",
              fontSize: 13,
              padding: "9px 11px",
              borderRadius: 8,
              marginBottom: 14,
            }}
          >
            Incorrect username or password.
          </div>
        ) : null}

        <label style={labelStyle}>Username</label>
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          autoFocus
          style={inputStyle}
        />

        <label style={labelStyle}>Password</label>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          style={inputStyle}
        />

        <button
          type="submit"
          style={{
            marginTop: 18,
            width: "100%",
            background: "#e31937",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            padding: "12px 16px",
            cursor: "pointer",
          }}
        >
          Sign in
        </button>
      </form>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12.5,
  color: "#5c5c5c",
  margin: "12px 0 4px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 11px",
  borderRadius: 7,
  border: "1px solid #ced0d8",
  background: "#fff",
  color: "#393c41",
  fontSize: 14,
  boxSizing: "border-box",
};
