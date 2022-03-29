import React, { useEffect, useState } from 'react';
import { Prompt } from 'react-router-dom';

export const useUnsavedChangesWarning = (message = 'Are you sure want to discard changes?') => {
    const [isDirty, setDirty] = useState(false);

    useEffect(() => {
        window.onbeforeunload = isDirty && (() => message);

        return () => {
            window.onbeforeunload = null;
        };
    }, [isDirty, message]);

    const routerPrompt = <Prompt when={isDirty} message={message} />;
    return [routerPrompt, () => setDirty(true), () => setDirty(false)];
};

// export default UseUnsavedChangesWarning;
