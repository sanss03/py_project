import Chatbot from './components/Chatbot';
import EMICalculator from './components/EMICalculator';
import TaxCalculator from './components/TaxCalculator';

export default function App() {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      background: "#0a0a0a",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      overflow: "hidden",
    }}>
      {/* LEFT: Chatbot Sidebar */}
      <div style={{
        width: "30%",
        minWidth: 280,
        maxWidth: 380,
        height: "100vh",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
      }}>
        <Chatbot />
      </div>

      {/* RIGHT: Calculator Cards */}
      <div style={{
        flex: 1,
        height: "100vh",
        overflowY: "auto",
        padding: "28px 28px 28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        scrollbarWidth: "thin",
        scrollbarColor: "#1a1a2e transparent",
        boxSizing: "border-box",
      }}>
        {/* Top bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <h1 style={{
              margin: 0,
              color: "#fff",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}>
              Fintech <span style={{ color: "#00f5ff", textShadow: "0 0 16px #00f5ff66" }}>Dashboard</span>
            </h1>
            <p style={{ margin: "3px 0 0", color: "#4b5563", fontSize: 13 }}>Smart financial calculators at your fingertips</p>
          </div>
          <div style={{
            padding: "6px 14px",
            background: "#111",
            border: "1px solid #1a1a2e",
            borderRadius: 20,
            color: "#9ca3af",
            fontSize: 12,
            letterSpacing: "0.04em",
          }}>
            {new Date().toLocaleDateString("en-IN", { dateStyle: "medium" })}
          </div>
        </div>

        <EMICalculator />
        <TaxCalculator />

        <div style={{ color: "#2d2d40", fontSize: 11, textAlign: "center", paddingBottom: 8 }}>
          Calculations are indicative only. Consult a financial advisor for official guidance.
        </div>
      </div>
    </div>
  );
}
