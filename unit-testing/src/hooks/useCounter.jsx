import { useState } from "react";

const useCounter = (initialCount = 0) => {
    const [count, setCount] = useState(initialCount);

    const increment = () => {
        setCount(count + 1);
    };

    return { count, increment };
};

export default useCounter;