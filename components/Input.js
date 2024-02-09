import { useId } from "react"

export default function Input ({ label, name, value, onChange, placeholder }) {
  const id = useId();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      alignItems: "start",
      maxWidth: "400px",
      justifyContent: "start"
    }}>
      <label for={name} style={{
        fontSize: "24px",
      }}>{label}</label>
      <style jsx>{`
        #${name}::placeholder {
          color: var(--red);
          opacity: 0.7;
        }

      `}</style>
      <input name={name} id={name} placeholder={placeholder} type="text" style={{
        width: "100%",
        height: "32px",
        border: "1px solid var(--red)",
        background: "var(--tan)",
        color: "var(--red)",
        fontSize: "20px",
        padding: "12px 12px",
      }} value={value} className={"akaya"} onChange={onChange} />
    </div>
  )
}