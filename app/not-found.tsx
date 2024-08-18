// handle expected not found errors
// but also...
// unmatched urls are all handled by this function too.

import Link from 'next/link';

export default function NotFound() {
    return(
        <div>
            <h2> Not Found </h2>
            <Link href='/'>Back to Home Page</Link>
        </div>
    )
};