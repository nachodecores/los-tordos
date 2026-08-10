export default function Hero() {
  return (
    <div
      className="w-full h-screen flex justify-center items-center flex-col text-coloryellow6 bg-colorpurple4 pt-20 px-4 text-center"
      style={{
        fontWeight: "bolder",
        lineHeight: "normal",
      }}
    >
      <h2
        className="opacity-90"
        style={{ fontSize: "clamp(2.5rem, 9vw, 5rem)" }}
      >
        INSPIRATE,
      </h2>

      <h2
        className="opacity-90"
        style={{ fontSize: "clamp(2.5rem, 9vw, 5rem)" }}
      >
        TENÉS QUESO.
      </h2>
    </div>
  );
}
