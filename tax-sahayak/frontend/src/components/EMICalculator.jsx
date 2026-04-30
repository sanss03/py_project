import { useState } from "react";

function InputField({ label, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        display: "block",
        color: "#9ca3af",
        fontSize: 12,
        marginBottom: 6,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        fontWeight: 600,
      }}>{label}</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: "#0a0a0a",
          border: `1.5px solid ${focused ? "#00f5ff" : "#252540"}`,
          borderRadius: 10,
          color: "#fff",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: focused ? "0 0 0 3px #00f5ff18" : "none",
          caretColor: "#00f5ff",
        }}
      />
    </div>
  );
}

function CalcButton({ onClick, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        padding: "11px",
        background: hovered
          ? "linear-gradient(135deg, #00f5ff, #00c8d4)"
          : "linear-gradient(135deg, #00f5ffcc, #00c8d4cc)",
        border: "none",
        borderRadius: 10,
        color: "#000",
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        letterSpacing: "0.04em",
        transition: "all 0.2s",
        boxShadow: hovered ? "0 0 20px #00f5ff44" : "none",
        transform: hovered ? "translateY(-1px)" : "none",
      }}
    >
      {label}
    </button>
  );
}

function ResultPill({ label, value, accent = "#00f5ff" }) {
  return (
    <div style={{
      background: "#0a0a0a",
      borderRadius: 10,
      padding: "12px 16px",
      border: "1px solid #252540",
      textAlign: "center",
    }}>
      <div style={{ color: "#6b7280", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ color: accent, fontWeight: 700, fontSize: 15 }}>{value}</div>
    </div>
  );
}

export default function EMICalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const R = parseFloat(rate) / 12 / 100;
    const N = parseFloat(tenure);
    if (!P || !R || !N) return;
    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const total = emi * N;
    const interest = total - P;
    setResult({
      emi: emi.toFixed(2),
      interest: interest.toFixed(2),
      total: total.toFixed(2),
    });
  };

  const fmt = n => Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

  return (
    <div
      style={{
        background: "#111",
        borderRadius: 16,
        border: "1px solid #1a1a2e",
        padding: "24px",
        boxShadow: "0 4px 32px #00000066",
        transition: "border-color 0.3s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#00f5ff22"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a2e"}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: "1px solid #1a1a2e",
      }}>
        <span style={{ fontSize: 18 }}>📊</span>
        <h2 style={{ margin: 0, color: "#fff", fontSize: 16, fontWeight: 700, letterSpacing: "0.02em" }}>EMI Calculator</h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <InputField label="Principal Amount (₹)" value={principal} onChange={setPrincipal} placeholder="e.g. 500000" />
        <InputField label="Annual Interest Rate (%)" value={rate} onChange={setRate} placeholder="e.g. 8.5" />
        <InputField label="Tenure (months)" value={tenure} onChange={setTenure} placeholder="e.g. 60" />
        <CalcButton onClick={calculate} label="Calculate EMI" />

        {result && (
          <div style={{
            marginTop: 8,
            padding: "18px",
            background: "linear-gradient(135deg, #00f5ff08, #00f5ff03)",
            border: "1px solid #00f5ff22",
            borderRadius: 12,
            textAlign: "center",
          }}>
            <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Monthly EMI</div>
            <div style={{
              color: "#00f5ff",
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              textShadow: "0 0 24px #00f5ff55",
              marginBottom: 16,
            }}>
              ₹{fmt(result.emi)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <ResultPill label="Total Interest" value={`₹${fmt(result.interest)}`} />
              <ResultPill label="Total Payment" value={`₹${fmt(result.total)}`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
