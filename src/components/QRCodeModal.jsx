import QRCode from 'react-qr-code'

export default function QRCodeModal({ roomCode, onClose }) {
  const joinUrl = `${window.location.origin}?join=${roomCode}`

  function handleCopy() {
    navigator.clipboard?.writeText(joinUrl).catch(() => {})
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-xs mx-4 pixel-border-green p-6 flex flex-col items-center gap-5 animate-bounce-in"
        style={{ background: '#050510' }}
      >
        {/* Title */}
        <div className="font-pixel text-sm neon-green text-center">SCAN TO JOIN</div>

        {/* QR code */}
        <div className="p-3 bg-white">
          <QRCode
            value={joinUrl}
            size={200}
            bgColor="#ffffff"
            fgColor="#0a0a0a"
          />
        </div>

        {/* Room code */}
        <div className="text-center">
          <div className="font-pixel text-xs text-gray-500 mb-2">ROOM CODE</div>
          <div className="font-pixel text-2xl neon-cyan tracking-widest">{roomCode}</div>
        </div>

        {/* URL */}
        <div
          className="w-full px-3 py-2 border border-arcade-border text-center cursor-pointer hover:border-neon-green transition-colors"
          style={{ background: '#080818' }}
          onClick={handleCopy}
        >
          <div className="font-pixel leading-relaxed truncate" style={{ fontSize: '0.45rem', color: '#444466' }}>
            {joinUrl}
          </div>
          <div className="font-pixel mt-1" style={{ fontSize: '0.45rem', color: '#39ff1466' }}>
            TAP TO COPY LINK
          </div>
        </div>

        {/* Close */}
        <button
          className="btn-arcade btn-cyan text-xs py-3 px-6 w-full"
          onClick={onClose}
        >
          ✕ CLOSE
        </button>
      </div>
    </div>
  )
}
