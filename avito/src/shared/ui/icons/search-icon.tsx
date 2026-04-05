import type { SVGProps } from 'react';


export const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        {...props}
    >
        <circle cx="9" cy="9" r="5.75" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);