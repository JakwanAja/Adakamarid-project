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
                            style={{ color: '#64748B' }}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }
                return (
                    <Link key={i} href={link.url}
                        className="px-3 py-2 text-sm rounded-lg font-medium transition-colors"
                        style={{
                            backgroundColor: link.active ? '#2563EB' : '#FFFFFF',
                            color: link.active ? '#FFFFFF' : '#1E293B',
                            border: `1px solid ${link.active ? '#2563EB' : '#E2E8F0'}`,
                        }}
                        onMouseEnter={e => { if (!link.active) { e.currentTarget.style.backgroundColor = '#F0F7FF'; e.currentTarget.style.borderColor = '#2563EB'; }}}
                        onMouseLeave={e => { if (!link.active) { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#E2E8F0'; }}}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        preserveScroll
                    />
                );
            })}
        </div>
    );
}
