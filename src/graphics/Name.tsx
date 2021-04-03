import React from "react";

export interface NameProps {
    name: string;
}

export function Name({name}: NameProps) {
    return <h1>Hello, {name}!</h1>;
}

