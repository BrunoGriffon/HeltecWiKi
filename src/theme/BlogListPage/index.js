import React, {useMemo} from 'react';
import Original from '@theme-original/BlogListPage';
import blogMeta from '@site/src/data/blog-meta.json';

function getMeta(item) {
    return item?.metadata || item?.content?.metadata || {};
}
function getPermalink(item) {
    return getMeta(item).permalink;
}

function cmp(a, b) {
    const pa = getPermalink(a);
    const pb = getPermalink(b);

    const ma = blogMeta[pa] || {};
    const mb = blogMeta[pb] || {};

    const oa = Number.isFinite(+ma.order) ? +ma.order : Number.POSITIVE_INFINITY;
    const ob = Number.isFinite(+mb.order) ? +mb.order : Number.POSITIVE_INFINITY;
    if (oa !== ob) return oa - ob;

    const ap = !!ma.pinned;
    const bp = !!mb.pinned;
    if (ap !== bp) return ap ? -1 : 1;

    const ta = new Date(ma.date || getMeta(a).date || 0).getTime();
    const tb = new Date(mb.date || getMeta(b).date || 0).getTime();
    return tb - ta;
}

export default function BlogListPageWrapper(props) {
    const sortedItems = useMemo(() => {
        const raw = (Array.isArray(props.items) ? props.items : []).filter(Boolean);
        const safe = raw.filter((it) => getPermalink(it));
        return [...safe].sort(cmp);
    }, [props.items]);

    return <Original {...props} items={sortedItems} />;
}