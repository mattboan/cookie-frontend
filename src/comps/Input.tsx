import { useEffect } from "react";

export interface InputProps {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    setValue: (str: string) => void;
    onEnter?: () => void;
}

export const Input = (props: InputProps) => {
    // Listen for enter key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter" && props.onEnter) {
                props.onEnter();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [props.onEnter]);
    
    return (
        <div className="input-wrapper">
            <label>{props.label}</label>
            <input 
                type={props.type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={e => props.setValue(e.target.value)}
            />
        </div>

    )
}