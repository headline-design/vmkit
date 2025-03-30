import styles from './loader.module.css';

export const Loader2 = ({ className }: {
    className?: string;
}) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        className={`${styles.loader} ${className}`}
    >
        <path
            d="M2,12 a10,10 0 0,1 10,-10 M12,22 a10,10 0 0,1 -10,-10 M22,12 a10,10 0 0,1 -10,10"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)
