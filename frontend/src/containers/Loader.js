import React from 'react';

export const Loader = ({ isLoading }) => {
    return (
        <div>
            {isLoading && (
                <div className="loader">
                    <img src="./timer.png" alt="timer" />
                    <p>Секундомерчик</p>
                </div>
            )}
        </div>
    );
};
