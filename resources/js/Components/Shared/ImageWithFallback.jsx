export default function ImageWithFallback({ src, alt, className = '', style = {} }) {
    function handleError(e) {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
    }

    return (
        <div className={`relative overflow-hidden ${className}`} style={style}>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                onError={handleError}
            />
            <div
                className="absolute inset-0 items-center justify-center"
                style={{ display: 'none', backgroundColor: '#F0F7FF' }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#64748B" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        </div>
    );
}
