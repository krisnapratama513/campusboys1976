// client/src/components/StatusView.tsx

interface StatusProps {
    message: string;
    isError?: boolean;
}

const StatusView = ({ message, isError = false }: StatusProps) => (
    <p style={{ 
        textAlign: 'center', 
        color: isError ? 'red' : 'inherit' 
    }}>
        {message}
    </p>
);

export default StatusView;