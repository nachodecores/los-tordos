"use client";

export default function Triangle() {
  return (
    <div className="fixed bottom-0 right-0 z-50">
      <div 
        className="relative transition-all duration-300 hover:scale-110"
        style={{
          width: '300px',
          height: '300px',
          clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
          backgroundColor: '#ffd700',
          transformOrigin: 'bottom right'
        }}
      >
        <div 
          className="absolute flex items-end justify-center text-black font-bold text-4xl transition-all duration-300 hover:text-5xl"
          style={{
            clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
            padding: '60px 80px 60px 20px',
            textAlign: 'center',
            lineHeight: '1.3',
            transform: 'rotate(-45deg)',
            transformOrigin: 'center',
            width: '120%',
            height: '120%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            left: '-10%',
            top: '-10%'
          }}
        >
          QUE NO TE FALTE
        </div>
      </div>
    </div>
  );
}
