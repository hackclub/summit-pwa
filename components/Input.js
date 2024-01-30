export default function Input ({ label, name, value, onChange, placeholder }) {
  return (
    <div style={{
      display: "flex",
      gap: "16px",
      height: "32px",
      alignItems: "center",
      maxWidth: "400px"
    }}>
      <label for={name}>{label}</label>
      <input name={name} id={name} placeholder={placeholder} type="text" style={{
        width: "100%",
        height: "32px",
        borderRadius: "4px",
        border: "1px solid var(--red)",
        padding: "0 8px",
      }} value={value} onChange={onChange} />
    </div>
  )
}