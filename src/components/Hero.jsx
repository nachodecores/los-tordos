export default function Hero() {
  return (
    <div className="relative">
      <div
        style={{
          width: "100vw",
          height: "calc(100vh - 80px)",
          backgroundImage: "url('../images/heroimage.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",

          filter: "blur(4px)",
        }}
      ></div>
      <div
        className="absolute inset-0 w-full h-full text-coloryellow2 flex justify-center items-center flex-col "
        style={{
          fontWeight: "bolder",
          fontSize: "60px",
          lineHeight: "normal",
        }}
      >
        <div className="w-11-12">
          <h2 className="opacity-80">INSPIRATE,</h2>
        </div>

        <div className="w-11-12">
          <h2 className="opacity-80">TENÉS QUESO.</h2>
        </div>
      </div>
    </div>
  );
}
