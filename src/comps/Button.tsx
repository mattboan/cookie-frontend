import React from 'react';

export interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

export const Button = (props: ButtonProps) => {
    return (
        <button onClick={props.onClick} className="button">
            {props.children}
        </button>
    )
}