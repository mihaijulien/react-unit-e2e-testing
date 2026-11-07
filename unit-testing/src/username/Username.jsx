import { useState } from 'react';

const Username = () => {
    const [username, setUsername] = useState('');

    return (
        <>
            <div data-testid="username">{username}</div>
            <button onClick={()=> setUsername("bar")} data-testid="button"/>
            <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                data-testid="username-input"
            />
        </>
    );
};

export default Username;