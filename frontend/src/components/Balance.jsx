export const Balance = ({value}) => {
    return (
        <div className="flex justify-between items-center">
            <div className="font-semibold text-lg text-gray-800">Your Balance</div>
            <div className="font-bold text-lg text-green-600">₹ {value}</div>
        </div>
    );
};
