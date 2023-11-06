export default function Hero() {
  return (
    <div
      className="flex justify-center items-center flex-col text-coloryellow2"
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
      <div className="w-11-12">
        <h2 className="opacity-40">TENÉS</h2>
      </div>

      <div className="w-11-12">
        <h2 className="opacity-40">QUESO</h2>
      </div>
    </div>
  );
}
