export default function Hero() {
  return (
    <div
      className="flex justify-center items-center flex-col text-colorwhite"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('../images/heroimage.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontWeight: "bolder",
        fontSize: "100px",
        lineHeight: "normal",
      }}
    >
      <h2 className="w-11/12">TENÉS</h2>
      <h2 className="w-11/12">QUESO</h2>
    </div>
  );
}
