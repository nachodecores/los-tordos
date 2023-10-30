import Image from "next/image";
import heroImage from "../../public/heroimage.jpg";

export default function Hero() {
  return (
    <>
      <div
        style={{
          // use relative position for the parent div
          position: "relative",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Image src={heroImage} alt={"Background Image"} />

        {/* The child element */}
        <div
          style={{
            // use absolute position for the child element
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // use higher zIndex than the image
            zIndex: 1,
            background: "yellow",
            padding: "30px",
          }}
        >
          <h1 className="inter text-8xl text-colorpurple">TENÉS QUESO</h1>
        </div>
      </div>
    </>
  );
}
