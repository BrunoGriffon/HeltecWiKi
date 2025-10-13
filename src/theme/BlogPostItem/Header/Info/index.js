import React from 'react';
import Link from '@docusaurus/Link';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';

export default function Info() {
    const {metadata} = useBlogPost();
    const {authors = [], date, formattedDate} = metadata;


    let dateLabel = formattedDate;
    if (!dateLabel && date) {
        const d = new Date(date);
        if (!Number.isNaN(d.getTime())) {
            dateLabel = new Intl.DateTimeFormat('en-US', {
                year: 'numeric', month: 'long', day: '2-digit',
            }).format(d);
        }
    }


    const rt = metadata.readingTime;
    let readingLabel = null;

    if (typeof rt === 'number' && Number.isFinite(rt)) {
        readingLabel = `${Math.max(1, Math.ceil(rt))} min read`;
    } else if (rt && typeof rt.text === 'string') {
        readingLabel = rt.text;
    } else if (rt && Number.isFinite(rt.minutes)) {
        readingLabel = `${Math.max(1, Math.ceil(rt.minutes))} min read`;
    }


    const authorEl = authors.length > 0 ? (
        <>
            <span>Author:</span>
            <span style={{display: 'inline-flex', gap: 6, alignItems: 'center', color: "#1777FF", marginLeft: 10}}>
                {authors.map((a, idx) => {
                    const name = a?.name ?? '';
                    const url = a?.url ?? null;
                    const el = url ? <Link href={url}>{name}</Link> : <span>{name}</span>;
                    return (
                        <span key={idx} style={{display: 'inline-flex', gap: 6, alignItems: 'center'}}>
                      {el}{idx < authors.length - 1 ? <span>,</span> : null}
                    </span>
                    );
                })}
            </span>
        </>
    ) : null;

    const parts = [
        dateLabel ? <time key="date" dateTime={date}>{dateLabel}</time> : null,
        readingLabel ? <span key="read">{readingLabel}</span> : null,
        authorEl ? <span key="author">{authorEl}</span> : null,
    ].filter(Boolean);

    return (
        <div
            className="clean-blog-post-meta"
            style={{display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', opacity: 0.85, marginBottom: 10}}
        >
            {parts.map((el, i) => (
                <React.Fragment key={i}>
                    {i > 0 && <span>·</span>}
                    {el}
                </React.Fragment>
            ))}
        </div>
    );
}