import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedPageProps {
    children: ReactNode;
    className?: string;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 10,
    },
    animate: {
        opacity: 1,
        y: 0,
    },
    exit: {
        opacity: 0,
    },
};

export const AnimatedPage = ({ children, className = '' }: AnimatedPageProps) => {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
