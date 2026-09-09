import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex items-center justify-center gap-1 mt-8">
            {links.map((link, i) => {
                if (!link.url) {
                    return (
                        <span key={i}
                            className="px-3 py-2 text-sm rounded-lg"
                            style={{ color: '#8C6B63' }}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }
                return (
                    <Link key={i} href={link.url}
                        className="px-3 py-2 text-sm rounded-lg font-medium transition-colors"
                        style={{
                            backgroundColor: link.active ? '#C0392B' : '#FFFFFF',
                            color: link.active ? '#FFFFFF' : '#2D1B18',
                            border: `1px solid ${link.active ? '#C0392B' : '#EAE0DC'}`,
                        }}
                        onMouseEnter={e => { if (!link.active) { e.currentTarget.style.backgroundColor = '#F5EDE9'; e.currentTarget.style.borderColor = '#C0392B'; }}}
                        onMouseLeave={e => { if (!link.active) { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#EAE0DC'; }}}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        preserveScroll
                    />
                );
            })}
        </div>
    );
}
