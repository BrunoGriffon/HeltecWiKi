import React, {useMemo} from 'react';
import Original from '@theme-original/BlogPostPaginator';
import blogMeta from '@site/src/data/blog-meta.json';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';


function sortEntries([pa, ma], [pb, mb]) {
    const oa = Number.isFinite(+ma.order) ? +ma.order : Number.POSITIVE_INFINITY;
    const ob = Number.isFinite(+mb.order) ? +mb.order : Number.POSITIVE_INFINITY;
    if (oa !== ob) return oa - ob;

    const ap = !!ma.pinned;
    const bp = !!mb.pinned;
    if (ap !== bp) return ap ? -1 : 1;

    const ta = new Date(ma.date || 0).getTime();
    const tb = new Date(mb.date || 0).getTime();
    return tb - ta;
}

export default function BlogPostPaginatorWrapper(props) {
    const {metadata: cur} = useBlogPost();
    const curPermalink = cur?.permalink;

    const orderedPermalinks = useMemo(() => {
        return Object.entries(blogMeta).sort(sortEntries).map(([permalink]) => permalink);
    }, []);

    const idx = orderedPermalinks.indexOf(curPermalink);
    const prevPermalink = idx > 0 ? orderedPermalinks[idx - 1] : undefined;
    const nextPermalink = idx >= 0 && idx < orderedPermalinks.length - 1 ? orderedPermalinks[idx + 1] : undefined;

    const previous = prevPermalink
        ? {metadata: {permalink: prevPermalink, title: blogMeta[prevPermalink]?.title || props.previous?.title || 'Previous'}}
        : undefined;

    const next = nextPermalink
        ? {metadata: {permalink: nextPermalink, title: blogMeta[nextPermalink]?.title || props.next?.title || 'Next'}}
        : undefined;

    return <Original {...props} previous={previous} next={next} />;
}